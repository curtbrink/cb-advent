export default function runSolution(fileInput: string): void {
  // theBoard[y][x] = x,y
  var theBoard: string[][] = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim().split(""));

  // find the guard
  var guardPos: Vector | undefined;
  for (var y = 0; y < theBoard.length; y++) {
    for (var x = 0; x < theBoard[0].length; x++) {
      if (theBoard[y][x] === "^") {
        guardPos = new Vector(x, y);
      }
    }
  }
  if (!guardPos) {
    throw new Error("Guard not found on board");
  }

  doPartOne(theBoard, guardPos);

  doPartTwo(theBoard, guardPos);
}

function doPartOne(theBoard: string[][], guardPos: Vector) {
  var guard = new Guard("^", guardPos.x, guardPos.y);

  var allVisitedLocations = new Set<string>();
  allVisitedLocations.add(guard.location.toString());
  var outOfBounds = false;

  while (!outOfBounds) {
    // check if guard can move and move if they can
    var nextPos = guard.getLookingAtPos();
    if (isPosOutOfBounds(nextPos, theBoard)) {
      outOfBounds = true;
      continue;
    }

    if (theBoard[nextPos.y][nextPos.x] === "#") {
      guard.turnRight();
      nextPos = guard.getLookingAtPos();
    }

    guard.location = nextPos;
    allVisitedLocations.add(guard.location.toString());
  }

  var overlaid = overlay(allVisitedLocations, theBoard);
  printBoard(overlaid);

  console.log(
    `The guard visited ${allVisitedLocations.size} distinct spots on the board`
  );
}

function doPartTwo(theBoard: string[][], guardPos: Vector) {
  // for part two, iterate every spot on the board and check if it produces a loop
  var numberOfValidObstructions = 0;
  for (var y = 0; y < theBoard.length; y++) {
    for (var x = 0; x < theBoard[0].length; x++) {
      console.log(`Checking ${x},${y}`);
      if (theBoard[y][x] !== ".") {
        continue;
      }

      var boardCopy = theBoard.map((bRow) => [...bRow]);
      boardCopy[y][x] = "#";

      var guard = new Guard("^", guardPos.x, guardPos.y);
      var allGuardOrientations = new Set<string>();
      allGuardOrientations.add(guard.toString());

      var outOfBounds = false;
      var looped = false;
      while (!outOfBounds && !looped) {
        // check if guard can move and move if they can
        var nextPos = guard.getLookingAtPos();
        if (isPosOutOfBounds(nextPos, boardCopy)) {
          outOfBounds = true;
          continue;
        }

        if (boardCopy[nextPos.y][nextPos.x] === "#") {
          guard.turnRight();
        } else {
          guard.location = nextPos;
        }

        if (allGuardOrientations.has(guard.toString())) {
          looped = true;
          console.log(guard.location.toString());
          boardCopy[guard.location.y][guard.location.x] = "X";
          continue;
        }
        allGuardOrientations.add(guard.toString());
      }

      if (looped) {
        var overlaid = overlay(allGuardOrientations, boardCopy);
        console.log();
        console.log(" ========= ");
        console.log();
        printBoard(overlaid);
        numberOfValidObstructions += 1;
      }
    }
  }

  console.log(
    `There are ${numberOfValidObstructions} locations where a new obstruction would cause a loop`
  );
}

type Direction = "N" | "S" | "E" | "W";

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  static add(v1: Vector, v2: Vector) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }
}

var vectorMap: Record<Direction, Vector> = {
  N: new Vector(0, -1),
  E: new Vector(1, 0),
  S: new Vector(0, 1),
  W: new Vector(-1, 0),
};

var clockwise: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

class Guard {
  facing: Direction;
  location: Vector;

  constructor(guardChar: string, x: number, y: number) {
    // presumably always starts facing north?
    // guardChar unused for now
    this.facing = "N";
    this.location = new Vector(x, y);
  }

  getLookingAtPos(): Vector {
    return Vector.add(this.location, vectorMap[this.facing]);
  }

  turnRight(): void {
    this.facing = clockwise[this.facing];
  }

  // part two, use this as key instead of just position
  toString(): string {
    return `${this.location.x},${this.location.y},${this.facing}`;
  }
}

function isPosOutOfBounds(pos: Vector, board: string[][]) {
  return (
    pos.x < 0 || pos.x >= board[0].length || pos.y < 0 || pos.y >= board.length
  );
}

// handy debug methods
function printBoard(board: string[][]): void {
  var boardAsStr = board.map((bRow: string[]) => bRow.join("")).join("\n");
  console.log(boardAsStr);
}

function overlay(positions: Set<string>, board: string[][]): string[][] {
  var boardCopy = board.map((bRow) => [...bRow]);
  var posArray = Array.from(positions.values());
  for (var pos of posArray) {
    var vec = parseCoordinates(pos);
    if (boardCopy[vec.y][vec.x] === ".") {
      boardCopy[vec.y][vec.x] = "o";
    }
  }
  return boardCopy;
}

function parseCoordinates(coordStr: string): Vector {
  var coords = coordStr
    .trim()
    .split(",")
    .map((c) => parseInt(c));
  return new Vector(coords[0], coords[1]);
}
