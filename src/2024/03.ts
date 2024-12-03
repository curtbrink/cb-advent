export default function runSolution(fileInput: string): void {
  var regex = /mul\(\d+,\d+\)/g;
  var partTwoRegex = /(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g;

  var allResults = [...fileInput.matchAll(regex)];

  if (allResults === null) {
    console.log("No matches found");
    return;
  }

  var sum = 0;
  for (var result of allResults) {
    // parse and multiply
    var substr = result[0].substring(4, result[0].length - 1);
    var numbers = substr.split(",").map((n) => parseInt(n));

    var mult = numbers[0] * numbers[1];
    console.log(`${numbers[0]} x ${numbers[1]} = ${mult}`);
    sum += numbers[0] * numbers[1];
    console.log(`Running total: ${sum}`);
  }

  console.log(`Sum of all valid multiplication instructions is ${sum}`);

  // part two
  console.log("\nPART TWO");

  var partTwoResults = [...fileInput.matchAll(partTwoRegex)];

  if (allResults === null) {
    console.log("Part two no matches found");
    return;
  }

  var sumP2 = 0;
  var mulEnabled = true;
  for (var result of partTwoResults) {
    if (result[0] === "do()") {
      console.log("mul ENABLED");
      mulEnabled = true;
      continue;
    }

    if (result[0] === "don't()") {
      console.log("mul DISABLED");
      mulEnabled = false;
      continue;
    }

    if (!mulEnabled) {
      console.log(`IGNORING ${result[0]}`);
      continue;
    }

    // parse and multiply
    var substr = result[0].substring(4, result[0].length - 1);
    var numbers = substr.split(",").map((n) => parseInt(n));

    var mult = numbers[0] * numbers[1];
    console.log(`${numbers[0]} x ${numbers[1]} = ${mult}`);
    sumP2 += numbers[0] * numbers[1];
    console.log(`Running total: ${sumP2}`);
  }

  console.log(`Sum of all valid multiplication instructions is ${sumP2}`);
}
