export default function runSolution(fileInput: string): void {
  // first order of business: parse the Sues

  // each sue:
  // - "Sue"
  // - index
  // - list of params
  var sues = fileInput.trim().split("\n").map((l) => l.trim().split(/ (\d+): /g));

  var rules: Record<string, number> = {
    "children": 3,
    "cats": 7,
    "samoyeds": 2,
    "pomeranians": 3,
    "akitas": 0,
    "vizslas": 0,
    "goldfish": 5,
    "trees": 3,
    "cars": 2,
    "perfumes": 1,
  };

  var potentialSues = [...sues];
  for (var param of Object.keys(rules)) {
    console.log(`Checking param "${param}"`);
    console.log(`Started with ${potentialSues.length} candidates`);

    var regex = new RegExp(`${param}: (\\d+)`, "g");
    potentialSues = potentialSues.filter((s) => {
      console.log(s);
      console.log(regex);
      var matches = [...(s[2].matchAll(regex))];
      if (matches.length === 0) {
        // no rule found so could be
        return true;
      }
      return parseInt(matches[0][1]) === rules[param];
    });
    console.log(`Whittled to ${potentialSues.length} candidates`);
  }

  console.log(`Remaining Sues after checking every rule:`);
  console.log(potentialSues);
}