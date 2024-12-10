export default function runSolution(fileInput: string): void {
  // first order of business: parse the Sues

  // each sue:
  // - "Sue"
  // - index
  // - list of params
  var sues = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim().split(/ (\d+): /g));

  var rules: Record<string, { target: number; operation?: string }> = {
    children: { target: 3 },
    cats: { target: 7, operation: ">" },
    samoyeds: { target: 2 },
    pomeranians: { target: 3, operation: "<" },
    akitas: { target: 0 },
    vizslas: { target: 0 },
    goldfish: { target: 5, operation: "<" },
    trees: { target: 3, operation: ">" },
    cars: { target: 2 },
    perfumes: { target: 1 },
  };

  // part one
  var potentialSues = [...sues];
  for (var param of Object.keys(rules)) {
    console.log(`Checking param "${param}"`);
    console.log(`Started with ${potentialSues.length} candidates`);

    var regex = new RegExp(`${param}: (\\d+)`, "g");
    potentialSues = potentialSues.filter((s) => {
      var matches = [...s[2].matchAll(regex)];
      if (matches.length === 0) {
        // no rule found so could be
        return true;
      }
      return parseInt(matches[0][1]) === rules[param].target;
    });
    console.log(`Whittled to ${potentialSues.length} candidates`);
  }

  console.log(`Remaining Sues after checking every rule:`);
  console.log(potentialSues);

  // part two
  potentialSues = [...sues];

  for (var param of Object.keys(rules)) {
    console.log(`Checking param "${param}"`);
    console.log(`Started with ${potentialSues.length} candidates`);

    var regex = new RegExp(`${param}: (\\d+)`, "g");
    potentialSues = potentialSues.filter((s) => {
      var matches = [...s[2].matchAll(regex)];
      if (matches.length === 0) {
        // no rule found so could be
        return true;
      }
      var parsedParamValue = parseInt(matches[0][1]);
      if (!rules[param].operation) {
        return parsedParamValue === rules[param].target;
      }
      if (rules[param].operation === ">") {
        // at least rule target
        return parsedParamValue > rules[param].target;
      }
      if (rules[param].operation === "<") {
        return parsedParamValue < rules[param].target;
      }
      console.log("somehow matched none?");
      return false;
    });
    console.log(`Whittled to ${potentialSues.length} candidates`);
  }

  console.log(`Remaining Sues after checking every rule for part two:`);
  console.log(potentialSues);
}
