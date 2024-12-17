export default function runSolution(fileInput: string): void {
  var { grid, moves } = parseFile(fileInput);

  for (var currentMove of moves) {
    move(grid, currentMove);
  }

  printGrid(grid);

  var score = scoreGrid(grid);

  console.log(`GPS Score: ${score}`);
}

function parseFile(fileInput: string): { grid: Grid; moves: Moves } {
  var lines = fileInput.trim().split("\n");
  var i = 0;
  var grid: string[][] = [];
  while (lines[i] !== "") {
    var gridRow: string[] = [];
    for (var char of lines[i]) {
      gridRow.push(char);
    }
    grid.push(gridRow);
    i++;
  }

  i++;
  var moves: string[] = [];

  while (lines[i]) {
    moves.push(...lines[i].trim());
    i++;
  }

  return { grid, moves };
}

function findRobot(grid: Grid): Vector | null {
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "@") {
        return { x, y };
      }
    }
  }
  return null;
}

function move(grid: Grid, directionChar: string): void {
  var currentLocation = findRobot(grid);
  if (!currentLocation) {
    console.log("Couldn't find the robot!");
    return;
  }

  var dirVec = directionMap[directionChar];

  var lookingAt: Vector = {
    x: currentLocation.x + dirVec.x,
    y: currentLocation.y + dirVec.y,
  };
  var initialLookingAt = {
    x: lookingAt.x,
    y: lookingAt.y,
  };

  switch (grid[lookingAt.y][lookingAt.x]) {
    // free space?
    case ".":
      grid[currentLocation.y][currentLocation.x] = ".";
      grid[lookingAt.y][lookingAt.x] = "@";
      return;
    // wall?
    case "#":
      // can't do anything
      return;
    case "O":
      // wall, can we move it?
      while (grid[lookingAt.y][lookingAt.x] === "O") {
        lookingAt = { x: lookingAt.x + dirVec.x, y: lookingAt.y + dirVec.y };
      }
      // now if we have a wall, we can't move.
      if (grid[lookingAt.y][lookingAt.x] === "#") {
        return;
      }
      if (grid[lookingAt.y][lookingAt.x] === ".") {
        // push back the boxes.
        grid[lookingAt.y][lookingAt.x] = "O";
        grid[initialLookingAt.y][initialLookingAt.x] = "@";
        grid[currentLocation.y][currentLocation.x] = ".";
        return;
      }
    default:
      console.log("Defaulted in the switch, what did I miss...");
      return;
  }
}

var gpsScore = (x: number, y: number) => 100 * y + x;

function scoreGrid(grid: Grid): number {
  var total = 0;
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "O") {
        total += gpsScore(x, y);
      }
    }
  }
  return total;
}

function printGrid(grid: Grid) {
  var gridStr = "";
  for (var y = 0; y < grid.length; y++) {
    var gridRow = "";
    for (var x = 0; x < grid[0].length; x++) {
      gridRow += grid[y][x];
    }
    gridStr += `${gridRow}\n`;
  }
  console.log(gridStr);
}

type Grid = string[][];
type Moves = string[];

type Vector = { x: number; y: number };

var directionMap: Record<string, Vector> = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};
