import { fromJS, isImmutable } from 'immutable';

const removeNulls = (obj) => {
  obj && Object.entries(obj).forEach(([k, v]) => v === null && delete obj[k])
  return obj;
}

/**
 * Helper function for `Record` constructors to shape incoming data into a
 * form usable for our `Record` classes.
 *
 * It takes either an `Immutable` instance or a raw JS object and returns
 * an `Immutable` object with any `null` values removed.
 */
export const convertRawValues = (data) => {
  if (isImmutable(data)) {
    data = fromJS(removeNulls(data.toJS()));
  } else {
    data = fromJS(removeNulls(data));
  }

  return data;
};
