export default function runSolution(fileInput: string): void {
  // which ones can possibly be true?
  var allEquations = parseEquations(fileInput);

  var partOneSum = allEquations.reduce(
    (sum: number, currentEquation: Equation) =>
      sum +
      (evaluateEquation(currentEquation, false, true)
        ? currentEquation.target
        : 0),
    0
  );

  console.log("===================");

  var partTwoSum = allEquations.reduce(
    (sum: number, currentEquation: Equation) =>
      sum +
      (evaluateEquation(currentEquation, true, true)
        ? currentEquation.target
        : 0),
    0
  );

  console.log("===================");

  console.log(`Total sum of valid equations without concat was ${partOneSum}`);
  console.log(`Total sum of valid equations using concat was ${partTwoSum}`);
}

type Equation = {
  target: number;
  components: number[];
};

function parseEquations(fileInput: string): Equation[] {
  var lines = fileInput.trim().split("\n");
  return lines.map((l) => {
    var split = l.split(":");
    var target = parseInt(split[0]);
    var components = split[1]
      .trim()
      .split(" ")
      .map((v) => parseInt(v));
    return { target, components };
  });
}

// recurse components

// e.g. I enter with "10: 3 2 5"
// I want to check if either 10: (3 + 2) 5 is correct, or 10: (3 * 2) is correct
// therefore I will recurse with values 10: 5 5 and 10: 6 5
// base case is a: b and return whether a === b.
function evaluateEquation(
  equation: Equation,
  useConcat: boolean,
  isEntry?: boolean
): boolean {
  if (isEntry) {
    console.log(
      `Checking ${equation.target}: ${equation.components.join(" ")}`
    );
  }
  // base case
  if (equation.components.length === 1) {
    var result = equation.components[0] === equation.target;
    return equation.components[0] === equation.target;
  }

  // more than one, so check both operators
  var added = equation.components[0] + equation.components[1];
  var multiplied = equation.components[0] * equation.components[1];

  // part two adds concat
  var concatenated = parseInt(
    `${equation.components[0]}${equation.components[1]}`
  );

  var result =
    evaluateEquation(generateNewEquation(added, equation), useConcat) ||
    evaluateEquation(generateNewEquation(multiplied, equation), useConcat) ||
    (useConcat &&
      evaluateEquation(generateNewEquation(concatenated, equation), useConcat));
  return result;
}

function generateNewEquation(newNum: number, equation: Equation): Equation {
  return {
    target: equation.target,
    components: [newNum, ...equation.components.slice(2)],
  };
}
