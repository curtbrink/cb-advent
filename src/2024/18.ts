export default function runSolution(fileInput: string): void {
  var dim = 71;
  var grid = createGrid(dim);
  var lines = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim());

  console.log("Start:");
  printGrid(grid);

  for (var i = 0; i < 1024; i++) {
    // first kilobyte only
    var coord = Vector.fromString(lines[i]);
    grid[coord.y][coord.x] = "#";
  }

  console.log("1 KB:");
  printGrid(grid);

  var result = aStar(grid);
  if (!result) {
    throw new Error("No valid path found");
  }
  var pathLength = reconstructPathOnGrid(grid, result.cameFrom, result.current);

  printGrid(grid);
  console.log(`Shortest path for part one is ${pathLength}`);

  console.log(`Starting part two...`);

  // this is not efficient because we're recreating the whole grid every time.
  // could be optimized by reusing the grid for [i] bytes, and adding just the [i+1]th byte.
  for (var i = 1024; i < lines.length; i++) {
    // what's the first value of i where the algorithm returns no path?
    var newGrid = createGrid(dim);
    for (var j = 0; j < i; j++) {
      // first i bytes get put on the grid
      var coord = Vector.fromString(lines[j]);
      newGrid[coord.y][coord.x] = "#";
    }

    var result = aStar(newGrid);
    if (!result) {
      console.log(
        `OOF! grid becomes unsolvable after i=${i} bytes @ ${lines[i - 1]}!`
      );
      var lastCoord = Vector.fromString(lines[i - 1]);
      newGrid[lastCoord.y][lastCoord.x] = "B";
      console.log(
        `Here's the resulting grid, with the offending byte marked with a B:`
      );
      printGrid(newGrid, lastCoord);
      break;
    }
  }
}

function createGrid(dim: number): string[][] {
  var grid: string[][] = [];
  for (var i = 0; i < dim; i++) {
    var gridRow: string[] = [];
    for (var j = 0; j < dim; j++) {
      gridRow.push(".");
    }
    grid.push(gridRow);
  }
  grid[0][0] = "S";
  grid[dim - 1][dim - 1] = "E";
  return grid;
}

// straight up adapted from the pseudocode on the Wikipedia page for A*
function aStar(
  grid: string[][]
): { cameFrom: Record<string, string>; current: Vector } | undefined {
  var start = find(grid, "S");
  var end = find(grid, "E");
  if (!(start && end)) {
    console.log("Invalid start or end!");
    return undefined;
  }

  // ready to start?
  var openSet = new VectorSet(start);
  var cameFrom: Record<string, string> = {};
  var gScore: Record<string, number> = { [start.label()]: 0 };
  var fScore: Record<string, number> = {
    [start.label()]: taxicabDistance(start, end),
  };

  while (!openSet.isEmpty()) {
    var currentCell = openSet.getMin(fScore);
    if (currentCell.label() === end.label()) {
      // we found it
      return { cameFrom, current: currentCell };
    }

    openSet.remove(currentCell);
    // iterate neighbors:
    var neighborVecs: Vector[] = [
      new Vector(currentCell.x, currentCell.y - 1), // north
      new Vector(currentCell.x + 1, currentCell.y), // east
      new Vector(currentCell.x, currentCell.y + 1), // south
      new Vector(currentCell.x - 1, currentCell.y), // west
    ];
    var validNeighbors = neighborVecs.filter(
      (v) =>
        v.x >= 0 &&
        v.x < grid[0].length &&
        v.y >= 0 &&
        v.y < grid.length &&
        grid[v.y][v.x] !== "#"
    );
    for (var validNeighbor of validNeighbors) {
      var tentativeGScore = gScore[currentCell.label()] + 1;
      if (
        tentativeGScore <
        (gScore[validNeighbor.label()] ?? Number.MAX_SAFE_INTEGER)
      ) {
        // record
        cameFrom[validNeighbor.label()] = currentCell.label();
        gScore[validNeighbor.label()] = tentativeGScore;
        fScore[validNeighbor.label()] =
          tentativeGScore + taxicabDistance(validNeighbor, end);
        openSet.add(validNeighbor);
      }
    }
  }

  return undefined;
}

// a* heuristic function
function taxicabDistance(a: Vector, b: Vector): number {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

function find(grid: string[][], target: string): Vector | undefined {
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === target) {
        return new Vector(x, y);
      }
    }
  }
  return undefined;
}

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  label(): string {
    return `${this.x},${this.y}`;
  }

  static fromString(str: string): Vector {
    var nums = str.split(",").map((n) => parseInt(n));
    return new Vector(nums[0], nums[1]);
  }
}

class VectorSet {
  set: Set<string>;

  constructor(v?: Vector) {
    this.set = new Set<string>();
    if (v) {
      this.add(v);
    }
  }

  add(v: Vector) {
    this.set.add(v.label());
  }

  remove(v: Vector) {
    this.set.delete(v.label());
  }

  getMin(fScore: Record<string, number>): Vector {
    var minScore = Number.MAX_SAFE_INTEGER;
    var min: Vector | undefined;
    for (var val of this.set.values()) {
      if (!min || fScore[val] < minScore) {
        min = Vector.fromString(val);
        minScore = fScore[val];
      }
    }
    if (!min) {
      throw new Error("no min?");
    }
    return min;
  }

  isEmpty(): boolean {
    return this.set.size === 0;
  }
}

function reconstructPathOnGrid(
  grid: string[][],
  cameFrom: Record<string, string>,
  end: Vector
) {
  var current = end;
  var length = 0;
  var keys = Object.keys(cameFrom);
  while (keys.includes(current.label())) {
    current = Vector.fromString(cameFrom[current.label()]);
    grid[current.y][current.x] = "O";
    length++;
  }
  return length;
}

function printGrid(grid: string[][], highlight?: Vector) {
  var gridStr = "";
  if (highlight) {
    gridStr = `${"V".padStart(highlight.x + 1)}\n`;
  }
  for (var y = 0; y < grid.length; y++) {
    var gridRow = "";
    for (var x = 0; x < grid[0].length; x++) {
      gridRow += grid[y][x];
    }
    if (highlight && highlight.y === y) {
      gridRow += " <";
    }
    gridStr += gridRow + "\n";
  }
  console.log(gridStr);
}
