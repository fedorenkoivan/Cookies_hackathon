export const asyncMap = async (arr, asyncCallback) => {
  return Promise.all(arr.map(asyncCallback));
};
