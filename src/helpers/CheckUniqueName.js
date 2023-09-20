const CheckUniqueName = (arr, target) => {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      count++;
    }
  }
  return count <= 1;
};

module.exports = CheckUniqueName;
