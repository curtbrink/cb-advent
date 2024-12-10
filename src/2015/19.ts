export default function runSolution(fileInput: string): void {
  var possibleReplacements: Record<string, string[]> = {};
  var backwardsReplacements: Record<string, string[]> = {};
  var lines = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim());

  var i = 0;
  while (lines[i]) {
    // parse rule
    var split = lines[i].split(" => ").map((it) => it.trim());
    if (!(split[0] in possibleReplacements)) {
      possibleReplacements[split[0]] = [];
    }
    if (!(split[1] in backwardsReplacements)) {
      backwardsReplacements[split[1]] = [];
    }
    possibleReplacements[split[0]].push(split[1]);
    backwardsReplacements[split[1]].push(split[0]);
    i++;
  }
  console.log(`Possible replacements moving forward:`);
  console.log(possibleReplacements);
  console.log(`Possible replacements moving backward:`);
  console.log(backwardsReplacements);

  i++;
  var molecule = lines[i];
  // console.log(molecule);

  // part one
  var newMoleculeSet = new Set<string>();
  for (var key of Object.keys(possibleReplacements)) {
    var replacementLocations = getAllIndexesOfSubstring(molecule, key);
    for (var pos of replacementLocations) {
      // splice key, insert replacements one by one
      for (var replacement of possibleReplacements[key]) {
        var newMolecule =
          molecule.slice(0, pos) +
          replacement +
          molecule.slice(pos + key.length);
        newMoleculeSet.add(newMolecule);
      }
    }
  }
  var newMolecules = [...newMoleculeSet];
  console.log(
    `There are ${newMolecules.length} unique new molecules that can result from one replacement operation.`
  );

  // part two
  // at first I tried brute forcing it, but with a depth search going down 200+ levels it was never gonna finish
  // so I read this comment instead https://www.reddit.com/r/adventofcode/comments/3xflz8/day_19_solutions/cy4etju/
  var tokens = parseTokens(molecule);
  var totalElements = tokens.length;
  var numParenthesesElements = tokens.filter(
    (it) => it === "Rn" || it === "Ar"
  ).length;
  var numCommaElements = tokens.filter((it) => it === "Y").length;
  var totalSteps =
    totalElements - numParenthesesElements - 2 * numCommaElements - 1;

  console.log(
    `Using pure formal mathematical mathematics, the required steps is ${totalSteps}`
  );
}

function getAllIndexesOfSubstring(str: string, substr: string) {
  var allLocations = [];
  var i = -1;
  while ((i = str.indexOf(substr, i + 1)) >= 0) {
    allLocations.push(i);
  }
  return allLocations;
}

function parseTokens(str: string): string[] {
  // a token is:
  // 1 uppercase letter
  // optionally, a lowercase letter
  var isUpper = /[A-Z]/;

  var tokens: string[] = [];
  var currentToken = str[0];

  for (var i = 1; i < str.length; i++) {
    var char = str[i];
    if (isUpper.test(char)) {
      tokens.push(currentToken);
      currentToken = "";
    }
    currentToken += char;
  }
  tokens.push(currentToken);

  return tokens;
}
