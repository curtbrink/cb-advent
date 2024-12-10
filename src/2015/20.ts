export default function runSolution(fileInput: string): void {
  var target = parseInt(fileInput.trim());

  // for this, we find the divisors of each number
  var sumFunc = (factor: number) => (div: number[]) =>
    div.reduce((sum, divisor) => sum + divisor * factor, 0);
  var sumDivisorsP1 = sumFunc(10);
  var sumDivisorsP2 = sumFunc(11);

  // var i = 0;
  // var max = 0;
  // var currentDivisorSum = 0;
  // while (currentDivisorSum < target) {
  //   i++;
  //   var divisors = getDivisors(i);
  //   currentDivisorSum = sumDivisorsP1(divisors);
  //   if (max < currentDivisorSum) {
  //     max = currentDivisorSum;
  //     console.log(`new max ${currentDivisorSum} @ i=${i} ... ${divisors}`);
  //   }
  // }

  // part two
  var j = 0;
  var max = 0;
  var currentDivisorSum = 0;
  while (currentDivisorSum < target) {
    j++;
    var divisors = getDivisors(j, true);
    currentDivisorSum = sumDivisorsP2(divisors);
    if (max < currentDivisorSum) {
      max = currentDivisorSum;
      console.log(`new max ${currentDivisorSum} @ i=${j} ... ${divisors}`);
    }
  }
}

function getDivisors(num: number, isPartTwo: boolean = false): number[] {
  var divisors: number[] = [num];
  for (var i = Math.floor(num / 2); i > 0; i--) {
    // once we cross the 50 threshold for part two, shortcut
    if (isPartTwo && Math.floor(num / i) > 50) {
      return divisors;
    }
    if (num % i === 0) {
      divisors.push(i);
    }
  }
  return divisors;
}
