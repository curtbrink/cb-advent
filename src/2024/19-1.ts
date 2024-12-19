export default function runSolution(fileInput: string): void {
  var lines = fileInput.trim().split("\n");

  var availableTowels = lines[0].split(", ");

  var targetDesigns = lines.slice(2).map((l) => l.trim());

  var sum = 0;
  var memo: Record<string, boolean> = {};
  for (var design of targetDesigns) {
    var result = isDesignPossible(availableTowels, design, memo);
    console.log(result ? `${design} is possible!` : `${design} is an OOF.`);
    sum += result ? 1 : 0;
  }
  console.log(`In total there are ${sum} possible designs.`);
}

function isDesignPossible(
  towels: string[],
  design: string,
  memo: Record<string, boolean>
) {
  if (design in memo) {
    return memo[design];
  }
  var startingTowels = towels
    .filter((t) => design.startsWith(t))
    .sort((a, b) => b.length - a.length);
  for (var prefix of startingTowels) {
    if (prefix.length === design.length) {
      memo[design] = true;
      return true;
    }
    if (isDesignPossible(towels, design.slice(prefix.length), memo)) {
      memo[design] = true;
      return true;
    }
  }
  memo[design] = false;
  return false;
}
