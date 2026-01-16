import Session from 'supertokens-auth-react/recipe/session';

export const headers = (options) =>
  Object.keys(options.headers).map((key) => ({
    name: key,
    value: options.headers[key] as string,
  }));

export async function addAuthorization(options) {
  if (await Session.doesSessionExist()) {
    const accessToken = await Session.getAccessToken();
    options.headers = {
      ...options.headers,
      Authorization: 'Bearer ' + accessToken,
    };
  } else {
    if (options.headers && options.headers.Authorization) {
      delete options.headers.Authorization;
    }
  }

  return options;
}

export const parseUserJwt = (token) => {
  if (!token) return;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jwt = JSON.parse(window.atob(base64));

  return {
    userID: jwt.sub,
    isImpersonating: jwt.isImpersonating,
    parentID: jwt.parentUserId,
  };
};
