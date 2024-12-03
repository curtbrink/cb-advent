export default function runSolution(fileInput: string): void {
  var rulesPartOne: Rule[] = [hasThreeVowels, doubleLetter, passesBlacklist];
  var rulesPartTwo: Rule[] = [
    repeatedDoubleLetterNoOverlap,
    repeatedLetterSkipOne,
  ];

  var lines = fileInput.trim().split("\n");

  var partOneSum = 0;
  var partTwoSum = 0;
  for (var line of lines) {
    if (rulesPartOne.every((rule) => rule(line))) {
      partOneSum++;
    }
    if (rulesPartTwo.every((rule) => rule(line))) {
      partTwoSum++;
    }
  }

  console.log(
    `There are ${partOneSum} lines that pass all the rules for part one.`
  );
  console.log(
    `There are ${partTwoSum} lines that pass all the rules for part two.`
  );
}

type Rule = (input: string) => boolean;

function hasThreeVowels(input: string): boolean {
  var sum = 0;
  for (var letter of input) {
    if (["a", "e", "i", "o", "u"].includes(letter)) {
      sum++;
    }
    if (sum >= 3) {
      return true;
    }
  }
  return false;
}

function doubleLetter(input: string): boolean {
  for (var i = 0; i < input.length - 1; i++) {
    if (input[i] === input[i + 1]) {
      return true;
    }
  }
  return false;
}

function passesBlacklist(input: string): boolean {
  var bannedStrings = ["ab", "cd", "pq", "xy"];
  for (var bannedString of bannedStrings) {
    if (input.indexOf(bannedString) > -1) {
      return false;
    }
  }
  return true;
}

function repeatedDoubleLetterNoOverlap(input: string): boolean {
  if (input.length < 4) {
    return false;
  }

  for (var i = 0; i < input.length - 3; i++) {
    var checkString = input.substring(i, i + 2);
    for (var j = i + 2; j < input.length - 1; j++) {
      if (input.substring(j, j + 2) === checkString) {
        return true;
      }
    }
  }
  return false;
}

function repeatedLetterSkipOne(input: string): boolean {
  for (var i = 0; i < input.length - 2; i++) {
    if (input[i] === input[i + 2]) {
      return true;
    }
  }
  return false;
}
