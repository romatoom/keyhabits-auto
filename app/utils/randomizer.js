function randIntMinMax(min, max) {
  const rand = Math.random();
  return min + Math.floor(rand * (max - min + 1));
}

function randItemOfArray(arr) {
  return arr[randIntMinMax(0, arr.length - 1)];
}

export { randIntMinMax, randItemOfArray };
