export default function runSolution(fileInput: string): void {
  var lines = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim());

  // part one
  iterateBoard(lines);

  // part two
  // make sure the four corners start on
  var maxIdxX = lines[0].length - 1;
  var maxIdxY = lines.length - 1;
  lines[0] = "#" + lines[0].slice(1, maxIdxX) + "#";
  lines[maxIdxY] = "#" + lines[maxIdxY].slice(1, maxIdxX) + "#";

  iterateBoard(lines, true);
}

function iterateBoard(board: string[], isPartTwo: boolean = false) {
  var newBoard = [...board];
  for (var i = 0; i < 100; i++) {
    // iterate 100 times
    var result = [];
    for (var y = 0; y < board.length; y++) {
      var newRow = "";
      for (var x = 0; x < board[0].length; x++) {
        if (
          isPartTwo &&
          (x === 0 || x === board[0].length - 1) &&
          (y === 0 || y === board.length - 1)
        ) {
          newRow += "#"; // corners always on
        } else {
          var numNeighborsOn = getNumberOfNeighborsOn(newBoard, x, y);
          if (newBoard[y][x] === "#") {
            newRow += [2, 3].includes(numNeighborsOn) ? "#" : ".";
          } else {
            newRow += numNeighborsOn === 3 ? "#" : ".";
          }
        }
      }
      result.push(newRow);
    }
    newBoard = result;
  }

  var numLights = 0;
  for (var y = 0; y < newBoard.length; y++) {
    for (var x = 0; x < newBoard[0].length; x++) {
      if (newBoard[y][x] === "#") {
        numLights++;
      }
    }
  }
  console.log(`After 100 iterations there are ${numLights} lights on`);
}

function getNumberOfNeighborsOn(board: string[], x: number, y: number): number {
  var neighbors = 0;
  for (var i of [x - 1, x, x + 1]) {
    if (i < 0 || i >= board[0].length) {
      continue; // OOB
    }
    for (var j of [y - 1, y, y + 1]) {
      if (j < 0 || j >= board.length || (i === x && j === y)) {
        continue; // OOB or checking x,y itself
      }
      if (board[j][i] === "#") {
        neighbors++;
      }
    }
  }
  return neighbors;
}
