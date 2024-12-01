export default function runSolution(fileInput: string): void {
  var lines = fileInput.trim().split("\n");

  var leftList = [];
  var rightList = [];
  for (var line of lines) {
    var components = line.split("   ");
    leftList.push(parseInt(components[0]));
    rightList.push(parseInt(components[1]));
  }

  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  var sum = 0;
  for (var i = 0; i < leftList.length; i++) {
    var distance = Math.abs(leftList[i] - rightList[i]);
    sum += distance;
  }

  // part two mapping similarity score

  // construct map of right list
  var rightMap = rightList.reduce(
    (theMap: Record<number, number>, currentVal: number) => {
      if (!theMap[currentVal]) theMap[currentVal] = 1;
      else theMap[currentVal]++;
      return theMap;
    },
    {}
  );

  console.log(rightMap);

  var similaritySum = leftList.reduce(
    (runningSum: number, currentVal: number) =>
      currentVal in rightMap
        ? runningSum + currentVal * rightMap[currentVal]
        : runningSum,
    0
  );

  console.log(`Total distance is ${sum}`);
  console.log(`Total similarity score is ${similaritySum}`);
}
