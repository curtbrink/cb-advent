export default function runSolution(fileInput: string): void {
  var vals = fileInput.trim().split(" ").map((v) => parseInt(v.trim()));
  var targetRow = vals[0];
  var targetCol = vals[1];

  // // testing
  // var targetRow = 6;
  // var targetCol = 6;

  var totalCodes = 1;

  var currentRow = 1;
  var currentCol = 1;
  var currentCode = 20151125;

  while (currentRow !== targetRow || currentCol !== targetCol) {
    if (currentRow === 1) {
      currentRow = currentCol + 1;
      currentCol = 1;
    } else {
      currentRow--;
      currentCol++;
    }
    var currentCode = getNextValue(currentCode);
    totalCodes++;
  }
  console.log(`[${currentRow},${currentCol}] => ${currentCode}`);
  console.log(`It took ${totalCodes} to get there!`);
}

function getNextValue(num: number): number {
  var m = num * 252533;
  return m % 33554393;
}