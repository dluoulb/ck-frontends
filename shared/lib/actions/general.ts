export const asyncActions = (...actions) => {
  return actions
    .filter((a) => a)
    .reduce((previousPromise, nextAsyncFunction) => {
      return previousPromise.then(() => nextAsyncFunction());
    }, Promise.resolve())
    .catch(async (err) => {
      const parsedError = await err;

      // Selectivly rethrow expceptions. Errors from our API will be rethrown
      // but network failures and runtime errors will go to the Redux general
      // store and another component will handle those globally.
      //
      // This is meant to be a distinction between user addressable issues
      // vs non addressable ones.
      if (
        !['runtime', 'unknown'].includes(parsedError.source) &&
        parsedError.status !== 401
      ) {
        throw parsedError;
      } else {
        console.error('Error occurred:', parsedError);

        // Signal to the caller that this failed since we won't get
        // into a `catch` in these cases.
        return false;
      }
    });
};
