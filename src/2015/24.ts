export default function runSolution(fileInput: string): void {
  var packages = fileInput.trim().split("\n").map((l) => parseInt(l.trim()));
  
  var sum = packages.reduce((sum, pack) => sum + pack, 0);

  var target = sum / 4; // part one = 3, part two = 4

  console.log(packages);
  console.log(`${sum} / ${target}`);

  // find the minimum that can add to target
  var targetFound = false;
  var targetGroupSize = 0;
  while (!targetFound) {
    targetGroupSize++;
    var allCombosOfSizeN = getCombinationsOfNElements(packages, targetGroupSize, []);
    if (allCombosOfSizeN.some((combo) => combo.reduce((sum, pack) => sum + pack, 0) === target)) {
      targetFound = true;
    }
  }
  console.log(`It takes a minimum of ${targetGroupSize} packages to sum to ${target}`);

  var allCombosOfTargetGroupSizeThatSumToTarget = getCombinationsOfNElements(packages, targetGroupSize, [])
    .filter((combo) => combo.reduce((sum, pack) => sum + pack, 0) === target);
  console.log(`Checking ${allCombosOfTargetGroupSizeThatSumToTarget.length} combos to see if they're valid`);
  console.log(`Verified with a manual step that all of these are valid!`);
  var validCombos = [...allCombosOfTargetGroupSizeThatSumToTarget];
  // validCombos is now a list of valid passenger compartment package configurations.
  console.log(validCombos);

  var qes = validCombos.map((combo) => combo.reduce((product, pack) => product * pack, 1));
  var minQE = Math.min(...qes);

  console.log(`The minimum QE for the ideal configuration is ${minQE}`);
}

function getCombinationsOfNElements(theList: number[], n: number, previous: number[] = []): number[][] {
  if (previous.length === n) {
    return [previous];
  }

  var combos: number[][] = [];
  for (var i = 0; i < theList.length; i++) {
    var newCombo = [...previous, theList[i]];
    var subList = theList.slice(i+1);
    combos.push(...getCombinationsOfNElements(subList, n, newCombo));
  }
  return combos;
}

/*

def combinations(array, tuple_length, prev_array=[]):
    if len(prev_array) == tuple_length:
        return [prev_array]
    combs = []
    for i, val in enumerate(array):
        prev_array_extended = prev_array.copy()
        prev_array_extended.append(val)
        combs += combinations(array[i+1:], tuple_length, prev_array_extended)
    return combs

*/