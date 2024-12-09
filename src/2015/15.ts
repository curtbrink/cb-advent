export default function runSolution(fileInput: string): void {
  var ingredients: number[][] = [];
  var lines = fileInput.trim().split("\n");
  for (var line of lines) {
    var matches = [...line.matchAll(/(-?\d+)/g)].map((m) => parseInt(m[0]));
    ingredients.push(matches);
  }

  console.log(ingredients);

  // we're just brute forcing the hell out of this one, idk linear programming yet
  // maybe this is a good excuse to learn it though. but for now, brute force.

  // part one
  // i, j, k, l = respective amounts of ingredient 1, 2, 3, 4
  // totalScore = total capacity, total durability, total flavor, total texture
  var maxScore = 0;
  var maxScorePartTwo = 0;
  var startingScore = [0, 0, 0, 0, 0];
  for (var i = 0; i < 100; i++) {
    var componentScoresOne = ingredients[0].map((c) => c * i);
    var newScoreOne = addMatrices(startingScore, componentScoresOne);
    for (var j = 0; j < 100 - i; j++) {
      var componentScoresTwo = ingredients[1].map((c) => c * j);
      var newScoreTwo = addMatrices(newScoreOne, componentScoresTwo);
      for (var k = 0; k < 100 - i - j; k++) {
        var componentScoresThree = ingredients[2].map((c) => c * k);
        var newScoreThree = addMatrices(newScoreTwo, componentScoresThree);
        var l = 100 - i - j - k;
        var componentScoresFour = ingredients[3].map((c) => c * l);
        var newScoreFour = addMatrices(newScoreThree, componentScoresFour);

        var totalCookieScore = 1;
        for (var m = 0; m < 4; m++) {
          totalCookieScore *= (newScoreFour[m] < 0 ? 0 : newScoreFour[m]);
        }

        if (maxScore < totalCookieScore) {
          console.log("New cookie found!");
          console.log(`${i} ${j} ${k} ${l} => ${totalCookieScore}`);
          maxScore = totalCookieScore;
        }
        if (newScoreFour[4] === 500 && maxScorePartTwo < totalCookieScore) {
          console.log("New 500-calorie cookie found!");
          console.log(`${i} ${j} ${k} ${l} => ${totalCookieScore}`);
          maxScorePartTwo = totalCookieScore;
        }
      }
    }
  }
}

function addMatrices(a: number[], b: number[]): number[] {
  var result: number[] = [];
  for (var i = 0; i < a.length; i++) {
    result.push(a[i] + b[i]);
  }
  return result;
}

function multiplyMatrices(a: number[], b: number[]): number[] {
  var result: number[] = [];
  for (var i = 0; i < a.length; i++) {
    result.push(a[i] * b[i]);
  }
  return result;
}