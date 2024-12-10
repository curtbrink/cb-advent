export default function runSolution(fileInput: string): void {
  var containers = fileInput
    .trim()
    .split("\n")
    .map((l) => parseInt(l.trim()));

  // I first tried a brute force recursive function but realized that that repeats paths.
  // second idea was some sort of bit map

  // part one
  var paths = 0;
  var pathsP2 = 0;
  var minContainers = Number.MAX_SAFE_INTEGER;
  for (var i = 0; i < 2 ** containers.length; i++) {
    // console.log(`[${i + 1} / ${max}]`);
    var asBitArray = i
      .toString(2)
      .padStart(containers.length, "0")
      .split("")
      .map((a) => parseInt(a));

    var sum = containers.reduce(
      (sum, current, idx) => sum + (asBitArray[idx] ? current : 0),
      0
    );
    if (sum === 150) {
      paths++;
      var numContainers = asBitArray.reduce((sum, bit) => sum + bit, 0);
      if (numContainers < minContainers) {
        console.log(`New minimum! ${numContainers} containers`);
        minContainers = numContainers;
      }
    }
  }

  for (var i = 0; i < 2 ** containers.length; i++) {
    // console.log(`[${i + 1} / ${max}]`);
    var asBitArray = i
      .toString(2)
      .padStart(containers.length, "0")
      .split("")
      .map((a) => parseInt(a));

    if (asBitArray.reduce((sum, bit) => sum + bit, 0) !== minContainers) {
      continue;
    }

    var sum = containers.reduce(
      (sum, current, idx) => sum + (asBitArray[idx] ? current : 0),
      0
    );
    if (sum === 150) {
      pathsP2++;
    }
  }

  // now do it again counting only solutions with the minimum

  console.log(`There are ${paths} paths to 150`);
  console.log(
    `There are ${pathsP2} paths to 150 that only use ${minContainers} containers`
  );
}
