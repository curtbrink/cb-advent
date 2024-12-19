export default function runSolution(fileInput: string): void {
  var lines = fileInput.trim().split("\n");

  var availableTowels = lines[0].split(", ");

  var targetDesigns = lines.slice(2).map((l) => l.trim());

  var memo: Record<string, number> = {};
  var sum = 0;
  for (var design of targetDesigns) {
    var result = numberOfWays(availableTowels, design, memo);
    console.log(
      result > 0
        ? `${design} is possible in ${result} different ways!`
        : `${design} is an OOF.`
    );
    sum += result;
  }
  console.log(`In total there are ${sum} possible designs.`);
}

// some pseudocode
//
// for ex: pattern gbbr with towels g, b, r, br, gb
// possible prefixes: g, gb
// for g:
//    now checking bbr
//    possible prefixes: b (1)
//      now checking br
//      possible prefixes: b, br
//        now checking r
//        1 way to make r
//      b, r is 1 way to make br
//      br is 1 way to make br
//    so for b, 2 total ways
// so for g, 2 total ways.
// then check gb
//    we already know from memoization that bbr has 2 combos.
// so for gb, 2 total ways.
// so total is 4.

function numberOfWays(
  towels: string[],
  design: string,
  memo: Record<string, number>
): number {
  // if we've seen this pattern before, we know how many combos we can use already
  if (design in memo) {
    return memo[design];
  }

  // find possible prefixes
  var startingTowels = towels
    .filter((t) => design.startsWith(t))
    .sort((a, b) => b.length - a.length);

  var totalCombos = 0;
  for (var prefix of startingTowels) {
    // for each prefix, find the number of ways the subpattern can be made.
    // if we can match it once exactly, that's one combo
    if (prefix.length === design.length) {
      totalCombos += 1;
      continue;
    }

    // check subpattern combos now
    var subpatternCombos = numberOfWays(
      towels,
      design.slice(prefix.length),
      memo
    );
    totalCombos += subpatternCombos;
  }
  memo[design] = totalCombos;
  return totalCombos;
}
