export default function runSolution(fileInput: string): void {
  var grid = fileInput.trim().split("\n").map((l) => l.trim().split("").map((c) => parseInt(c)));

  // algorithm:
  // func scoreCell(x, y)
  //   if x,y is a 9, return 1
  //   else get all ascending neighbors
  //        return sum(ascending neighbors.map(scoreCell))

  var totalScoreP1 = 0;
  var totalScoreP2 = 0;
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 0) {
        // console.log(`Found a trailhead @ ${x},${y}`);
        var ninesVisibleFromHere: string[] = [];
        scoreCell(grid, new Vector(x, y), ninesVisibleFromHere);
        totalScoreP2 += ninesVisibleFromHere.length;
        // part one score is the same source data but counting unique 9s only
        totalScoreP1 += [...new Set<string>(ninesVisibleFromHere)].length;
      }
    }
  }
  console.log(`P1: Scores for all trailheads is ${totalScoreP1}`);
  console.log(`P2: Scores for all trailheads is ${totalScoreP2}`);
}

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
}

function scoreCell(grid: number[][], pos: Vector, allNines: string[]): void {
  var cellValue = grid[pos.y][pos.x];
  // console.log(`===> ${cellValue} @ ${pos.x},${pos.y}`)
  if (cellValue === 9) {
    // we found a 9 so add it to our collection
    allNines.push(pos.toString());
    return;
  }

  // neighboring ascending cells
  var up = pos.y > 0 ? new Vector(pos.x, pos.y - 1) : null;
  var down = pos.y < grid.length - 1 ? new Vector(pos.x, pos.y + 1) : null;
  var left = pos.x > 0 ? new Vector(pos.x - 1, pos.y) : null;
  var right = pos.x < grid[0].length - 1 ? new Vector(pos.x + 1, pos.y) : null;

  var validNeighbors = [up, down, left, right].filter((dir) => dir !== null && grid[dir.y][dir.x] === cellValue + 1);
  // console.log(`Found ${validNeighbors.length} valid branches from this cell.`);
  for (var validNeighbor of validNeighbors) {
    scoreCell(grid, validNeighbor!, allNines);
  }
}