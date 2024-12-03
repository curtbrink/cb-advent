export default function runSolution(fileInput: string): void {

  var lines = fileInput.trim().split("\n").map((l) => l.trim());

  var totalDiffP1 = 0;
  var totalDiffP2 = 0;

  for (var line of lines) {
    var lineLength = line.length;

    var stringLength = parseString(line);
    var decodedDiff = lineLength - stringLength;

    var encodedLength = reencodeString(line);
    var encodedDiff = encodedLength - lineLength;
    
    console.log(`[${line}] ${stringLength} -> ${lineLength} -> ${encodedLength}`);

    totalDiffP1 += decodedDiff;
    totalDiffP2 += encodedDiff;
  }

  console.log(`Total diff is ${totalDiffP1} / ${totalDiffP2}`);
}

function parseString(token: string): number {
  var strLen = 0;
  var charIdx = -1;
  var tokenComplete = false;
  var stringOpen = false;

  while (!tokenComplete) {
    charIdx++;
    var currentChar = token[charIdx];

    // parse open/end quotes
    if (currentChar === '"') {

      if (!stringOpen) {
        stringOpen = true;
        continue;
      }

      // otherwise we're done
      stringOpen = false;
      tokenComplete = true;
      continue;
    }

    // parse escaped characters
    if (currentChar === '\\') {
      // need the next character
      charIdx++;
      var nextChar = token[charIdx];
      strLen++;
      if (['\\', '"'].includes(nextChar)) {
        continue;
      }
      if (nextChar === 'x') {
        charIdx += 2;
        continue;
      }
    }

    // else just add 1
    strLen++;
  }

  return strLen;
}

function reencodeString(token: string): number {
  var charMap: Record<string, number> = {
    '"': 2,
    '\\': 2,
  }

  var newLen = 2; // one for each surrounding double-quote
  for (var char of token) {
    newLen += charMap[char] ?? 1;
  }
  return newLen;
}
