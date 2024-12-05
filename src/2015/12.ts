export default function runSolution(fileInput: string): void {
  // part one
  var regex = /(-?\d+)/g;
  var matchResults = fileInput.matchAll(regex);

  var total = 0;
  for (var result of matchResults) {
    total += parseInt(result[0]);
  }
  console.log(`Sum of all valid number tokens in the file is ${total}`);

  // part two
  const jsonObject = JSON.parse(fileInput);
  // we know the root is an array so just start there
  var p2Total = getNumberSumArray(jsonObject);
  console.log(`Sum of all number tokens that aren't in an object containing a property value of "red" is ${p2Total}`);
}

function getNumberSumArray(inArray: any[]): number {
  var total = 0;
  for (var val of inArray) {
    total += checkNode(val);
  }
  return total;
}

function getNumberSumObject(inObj: any): number {
  var total = 0;

  // total properties that are numbers, but short circuit if any properties are "red"
  for (var key of Object.keys(inObj)) {
    if (inObj[key] === "red") {
      return 0;
    }

    total += checkNode(inObj[key]);
  }

  return total;
}

function checkNode(node: any): number {
  // check if subarray or subobject
  if (Array.isArray(node)) {
    return getNumberSumArray(node);
  }

  if (typeof node === "object") {
    return getNumberSumObject(node);
  }

  if (typeof node === "number") {
    return node;
  }

  return 0;
}