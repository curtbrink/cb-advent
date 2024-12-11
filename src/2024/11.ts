export default function runSolution(fileInput: string): void {
  // real input
  var rocks = fileInput.trim().split(" ").map((r) => parseInt(r));

  // test input
  // var rocks = [125, 17];

  // testing timings of different depths
  // for (var i = 1; i <= 75; i++) {
  //   var startTime = performance.now();
  //   var result = countRocks(rocks, i, {});
  //   var endTime = performance.now();
  //   var ms = endTime - startTime;
  //   console.log(`(i=${i}) rock count: ${result} completed in ${ms} ms`);
  // }

  var cache: RockMemo = {};

  var result = countRocks(rocks, 25, cache);
  console.log(`Part one: after 25 blinks, ${result} stones remain`);

  var resultPartTwo = countRocks(rocks, 75, cache);
  console.log(`Part two: after 75 blinks, ${resultPartTwo} stones remain`);
}

// basic caching...
// the memo "key" is {rock}|{depth}
// the value is the number of rocks that {rock} becomes after {depth} blinks
// if we see the same rock at the same depth we don't have to calculate it again
type RockMemo = Record<string, number>;
var rockMemoKey = (rock: number, depth: number) => `${rock}|${depth}`;

// get number of digits without converting to string first. maybe an unnecessary micro-optimization
var getNumberOfDigits = (num: number) => num === 0 ? 1 : Math.floor(Math.log10(num) + 1);

function countRocks(rocks: number[], blinksLeft: number, rockMemo: RockMemo): number {
  if (blinksLeft === 0) {
    return rocks.length;
  }

  var rockCount = 0;
  for (var rock of rocks) {

    // first check the cache
    var rockKey = rockMemoKey(rock, blinksLeft);
    if (rockKey in rockMemo) {
      // we've already seen this rock at this depth
      rockCount += rockMemo[rockKey];
      continue;
    }

    // otherwise we'll have to calculate it
    var newRocks = updateRock(rock);
    var newRocksBecomes = countRocks(newRocks, blinksLeft - 1, rockMemo);
    rockCount += newRocksBecomes;
    rockMemo[rockKey] = newRocksBecomes;
  }
  return rockCount;
}

function updateRock(rock: number): number[] {
  if (rock === 0) {
    return [1];
  }
  var numDigits = getNumberOfDigits(rock);
  if (numDigits % 2 === 0) {
    var rockStr = rock.toString();
    var half = rockStr.length / 2;
    return [parseInt(rockStr.slice(0, half)), parseInt(rockStr.slice(half))];
  }
  return [rock * 2024];
}
