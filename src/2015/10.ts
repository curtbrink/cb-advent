export default function runSolution(fileInput: string): void {
  var newLine = fileInput;

  for (var i = 0; i < 40; i++) {
    newLine = lookAndSay(newLine);
  }

  console.log(newLine);

  var lengthForty = newLine.length;

  // do it ten more times for part 2

  for (var i = 0; i < 10; i++) {
    newLine = lookAndSay(newLine);
  }

  var lengthFifty = newLine.length;

  console.log(`Result after 40 iterations is ${lengthForty} chars long`);
  console.log(`Result after 50 iterations is ${lengthFifty} chars long`);
}

function lookAndSay(line: string) {
  var currentChar = "";
  var currentLength = 0;
  var result = "";

  for (var char of line) {

    if (char === currentChar) {
      currentLength++;
      continue;
    }

    // push token to result and reset
    if (currentLength > 0) {
      result += `${currentLength}${currentChar}`;
    }

    currentChar = char;
    currentLength = 1;
  }
  // there will be a straggler
  result += `${currentLength}${currentChar}`;

  return result;
}