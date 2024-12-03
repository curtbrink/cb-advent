export default function runSolution(fileInput: string): void {
  console.log(`Start: ${fileInput}`);

  var nextPw = getNewPassword(fileInput);
  console.log(`First new password: ${nextPw}`);

  // part two do it again!
  nextPw = getNewPassword(nextPw);
  console.log(`Second new password: ${nextPw}`);
}

function getNewPassword(input: string): string {
  var pw = new Password(input);

  var validPassword = false;
  while (!validPassword) {
    pw.incrementPosition(7);
    validPassword = pw.validPassword();
  }
  return pw.printPassword();
}

function blacklistRule(input: number[]): boolean {
  // no i, o, or l
  //    105, 111, 108
  return input.every((n) => n !== 105 && n !== 111 && n !== 108);
}

function straightRule(input: number[]): boolean {
  // need a straight no gaps
  for (var i = 0; i < input.length - 2; i++) {
    if (input[i + 2] === input[i] + 2 && input[i + 1] === input[i] + 1) {
      return true;
    }
  }
  return false;
}

function multipleRepeatingCharsRule(input: number[]): boolean {
  var charIdx = 1;

  var repeatFound = false;
  var firstRepeat = -1;
  while (charIdx < input.length) {
    if (input[charIdx] === input[charIdx - 1]) {
      // this is a repeat.
      if (repeatFound) {
        // we've already found one repeat
        if (firstRepeat !== input[charIdx]) {
          // different repeat than the first one
          return true;
        }
        // same repeat, skip it
        charIdx += 2;
        continue;
      }

      // first repeat found.
      repeatFound = true;
      firstRepeat = input[charIdx];
      charIdx += 2;
      continue;
    }
    charIdx++;
  }
  return false;
}

class Password {
  aCode: number = 97;
  zCode: number = 122;

  pwAsNumbers: number[]

  rules: ((nums: number[]) => boolean)[] = [blacklistRule, straightRule, multipleRepeatingCharsRule];

  constructor(pw: string) {
    this.pwAsNumbers = pw.split("").map((c) => c.charCodeAt(0));
    console.log(this.pwAsNumbers);
  }

  incrementPosition(idx: number) {
    this.pwAsNumbers[idx]++;
    if (this.pwAsNumbers[idx] > this.zCode) {
      this.pwAsNumbers[idx] = this.aCode;
      if (idx > 0) {
        this.incrementPosition(idx - 1);
      }
    }
  }

  printPassword() {
    return String.fromCharCode(...this.pwAsNumbers);
  }

  validPassword() {
    return this.rules.map((r) => r(this.pwAsNumbers)).every((r) => r === true);
  }
}
