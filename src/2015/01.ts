export default function runSolution(fileInput: string): void {
  // file input is one line of ('s and )'s
  // ( = increment
  // ) = decrement

  var floor = 0;
  var basementFound = false;
  let basementIdx;
  var idx = 0;
  for (var parenthesis of fileInput) {
    idx++;
    switch (parenthesis) {
      case "(":
        floor++;
        break;
      case ")":
        floor--;
        break;
    }
    if (!basementFound && floor < 0) {
      basementFound = true;
      basementIdx = idx;
    }
  }

  console.log(`The resulting floor is ${floor}`);
  console.log(`The first time the basement is entered is ${basementIdx}`);
}
