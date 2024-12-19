export default function runSolution(fileInput: string): void {
  var grid = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim().split(""));

  // let's try a DFS for this one first

  var globalMinScore: Min = { value: Number.MAX_SAFE_INTEGER };

  var start: Vector = getStart(grid);
  var dir: Facing = "E";

  walk(grid, { pos: start, facing: dir, visited: [] }, 0, globalMinScore);
}

function getStart(grid: Grid): Vector {
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") {
        return { x, y };
      }
    }
  }
  return { x: -1, y: -1 };
}

function walk(grid: Grid, state: Check, runningTotal: number, min: Min) {
  // is current node the end?
  if (grid[state.pos.y][state.pos.x] === "E") {
    // we made it! is this the shortest path?
    // console.log(`Reached the end!`);
    if (runningTotal < min.value) {
      console.log(`NEW MIN SCORE! ${runningTotal}`);
      min.value = runningTotal;
      return;
    }
  }

  // not at the end yet, so need to recurse all the possibilities, not including where we came from.
  var newVisited = [...state.visited, vectorStr(state.pos)];

  for (var dir of (["N", "E", "S", "W"] as Facing[]).filter(
    (d) => oppositeDirections[d] !== state.facing
  )) {
    var dirVec = directionMap[dir];
    var lookingAt: Vector = {
      x: state.pos.x + dirVec.x,
      y: state.pos.y + dirVec.y,
    };

    if (
      grid[lookingAt.y][lookingAt.x] === "#" ||
      state.visited.includes(vectorStr(lookingAt))
    ) {
      // that's a wall or we've been there already
      continue;
    }

    var newCost = runningTotal + 1 + directionCost[state.facing][dir];
    // prune branch if would be too costly
    if (newCost > min.value) {
      // console.log(`Pruned a branch!`);
      continue;
    }
    walk(
      grid,
      { pos: lookingAt, facing: dir, visited: newVisited },
      newCost,
      min
    );
  }
}

type Grid = string[][];

type Vector = {
  x: number;
  y: number;
};
var vectorStr = (v: Vector): string => `{${v.x},${v.y}}`;

type Facing = "N" | "S" | "E" | "W";

// I don't think there's ever a case where you'd do a 180 but for completeness.
var directionCost: Record<Facing, Record<Facing, number>> = {
  N: {
    E: 1000,
    W: 1000,
    S: 2000,
    N: 0,
  },
  E: {
    N: 1000,
    S: 1000,
    W: 2000,
    E: 0,
  },
  S: {
    E: 1000,
    W: 1000,
    N: 2000,
    S: 0,
  },
  W: {
    N: 1000,
    S: 1000,
    E: 2000,
    W: 0,
  },
};
var directionMap: Record<Facing, Vector> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};
var oppositeDirections: Record<Facing, Facing> = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
};

type Check = {
  pos: Vector;
  facing: Facing;
  visited: string[];
};

type Min = {
  value: number;
};
