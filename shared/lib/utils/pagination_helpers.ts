export const resultChunks = (allRecords) => {
  return allRecords.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 15);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
};

export const pagination = (c, m) => {
  let current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i > left && i <= right + 1)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};
