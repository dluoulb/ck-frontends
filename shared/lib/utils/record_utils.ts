export const removeNulls = (obj) => {
  obj && Object.entries(obj).forEach(([k, v]) => v === null && delete obj[k]);
  return obj;
};
