export default function runSolution(fileInput: string): void {
  // parse file into grid of chars
  var grid = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim().split(""));

  // loop through the grid to generate each region
  var allRegions: Region[] = [];
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      // skip this cell if it already belongs to a region
      if (allRegions.some((region) => region.cells.includes(vectorKey(x, y)))) {
        continue;
      }

      // new region found, so find all its cells and record some stats
      var crop = grid[y][x];
      var cells: string[] = [];
      var perim = { value: 0 }; // to be passed by reference
      var corners = { value: 0 }; // ditto
      fillRegion(grid, x, y, cells, perim, corners);

      // add the new region to our list
      allRegions.push({
        crop,
        cells,
        perimeter: perim.value,
        corners: corners.value,
      });

      // console.log(
      //   `Pushed region: ${crop} (perim=${perim.value}) (corners=${corners.value}) => ${cells}`
      // );
    }
  }

  // part one formula
  var totalFencePrice = allRegions.reduce(
    (sum, region) => sum + regularRegionPrice(region),
    0
  );
  // part two formula
  var totalFencePriceWithVolumePricing = allRegions.reduce(
    (sum, region) => sum + bulkRegionPrice(region),
    0
  );

  console.log(
    `Total fence price of all regions on this map is ${totalFencePrice}`
  );
  console.log(
    `With volume pricing, total fence price becomes ${totalFencePriceWithVolumePricing}`
  );
}

// given a grid, a cell (x,y), a list of cells belonging to the current region,
// and running totals of perimeter and corner count, adds the cell to the list
// of cells, and recurses for each of its neighbors of the same crop that aren't
// already in the list.
function fillRegion(
  grid: string[][],
  x: number,
  y: number,
  regionCells: string[],
  perimeter: { value: number },
  numCorners: { value: number } // part two
) {
  // this cell should be part of this region because that's why we're here
  regionCells.push(vectorKey(x, y));

  // add each neighbor if same crop
  // also keep a running total of perimeter and number of "corners" (part two)
  var crop = grid[y][x];
  var allDirections = directionMap(x, y);
  var matchingNeighbors: string[] = [];
  for (var direction of Object.keys(allDirections)) {
    var x1 = allDirections[direction].x;
    var y1 = allDirections[direction].y;
    var isCardinal = cardinalDirections.includes(direction);
    var isOutOfBounds =
      x1 < 0 || y1 < 0 || x1 >= grid[0].length || y1 >= grid.length;
    var matchesCrop = isOutOfBounds ? false : grid[y1][x1] === crop;
    var alreadyCounted = regionCells.includes(vectorKey(x1, y1));

    // check if cell even belongs in the region. needs to match and be inbounds
    if (isOutOfBounds || !matchesCrop) {
      // only cardinal neighbors affect perimeter
      perimeter.value += isCardinal ? 1 : 0;
      continue;
    }

    // this neighbor matches, so add it to the list of matching neighbors
    matchingNeighbors.push(direction);
    if (isCardinal && !alreadyCounted) {
      // recurse if this neighbor has not already been included in region
      fillRegion(grid, x1, y1, regionCells, perimeter, numCorners);
    }
  }

  // list of matching neighbors is now complete, so we can calculate the number
  // of corners of this cell which is used for part two
  var matchingCardinals = matchingNeighbors.filter((it) =>
    cardinalDirections.includes(it)
  );
  var matchingDiagonals = matchingNeighbors.filter(
    (it) => !cardinalDirections.includes(it)
  );

  numCorners.value += getNumberOfCorners(matchingCardinals, matchingDiagonals);
}

// utilizing the hint from this reddit post
// https://www.reddit.com/r/adventofcode/comments/1hcf16m/2024_day_12_everyone_must_be_hating_today_so_here/
// tl;dr number of sides = number of corners.
function getNumberOfCorners(
  matchingCardinals: string[],
  matchingDiagonals: string[]
) {
  switch (matchingCardinals.length) {
    // ===========
    case 0:
      // one cell all by its lonesome with its four lonely corners:
      //  x
      // xOx
      //  x
      return 4;
    // ===========
    case 1:
      // outer corners only, diagonals will be counted by neighboring cells
      //  O
      // xOx
      //  x
      return 2;
    // ===========
    case 2:
      // there are two ways to have two cardinal neighbors:
      if (
        ["north", "south"].every((d) => matchingCardinals.includes(d)) ||
        ["east", "west"].every((d) => matchingCardinals.includes(d))
      ) {
        // only opposing neighbors, no corners to count for this cell.
        //  O
        // xOx
        //  O
        return 0;
      }
      // otherwise it's an L shape.
      // ?O
      // OOx
      //  x
      // 1 corner for the outside, plus 1 additional if the diagonal is empty
      // what's the corner? if there's exactly two, and not opposed, we can
      // generate this direction name - exactly one of north or south, and
      // exactly one of east or west (e.g. "southwest"). the list of cardinal
      // directions is already ordered NSEW so we can loop that once to check.
      var cornerToCheck = "";
      for (var d of cardinalDirections) {
        cornerToCheck += matchingCardinals.includes(d) ? d : "";
      }
      return matchingDiagonals.includes(cornerToCheck) ? 1 : 2;
    // ===========
    case 3:
      // T shape. 2 corners, less one for each matching inner diagonal.
      // ?O?
      // OOO
      //  x
      var missingCardinal = cardinalDirections.find(
        (d) => !matchingCardinals.includes(d)
      );
      var diagonalsToCheck = oppositeDiagonals[missingCardinal!];
      var matchedDiagonals = matchingDiagonals.filter((d) =>
        diagonalsToCheck.includes(d)
      );
      return 2 - matchedDiagonals.length;
    // ===========
    case 4:
      // + shape. 4 corners, minus one per matching diagonal.
      // ?O?
      // OOO
      // ?O?
      return 4 - matchingDiagonals.length;
    default:
      console.log("wtf, m8");
      return 0; // should never get here but ya never know
  }
}

// types
type DirectionMap = Record<string, { x: number; y: number }>;

type Region = {
  crop: string;
  cells: string[];
  perimeter: number;
  corners: number;
};

// util functions and variables
var vectorKey = (x: number, y: number) => `${x}-${y}`;

var regularRegionPrice = (region: Region): number =>
  region.cells.length * region.perimeter;
var bulkRegionPrice = (region: Region): number =>
  region.cells.length * region.corners;

var cardinalDirections = ["north", "south", "east", "west"];
var directionMap = (x: number, y: number): DirectionMap => ({
  north: {
    x,
    y: y - 1,
  },
  northeast: {
    x: x + 1,
    y: y - 1,
  },
  east: {
    x: x + 1,
    y,
  },
  southeast: {
    x: x + 1,
    y: y + 1,
  },
  south: {
    x,
    y: y + 1,
  },
  southwest: {
    x: x - 1,
    y: y + 1,
  },
  west: {
    x: x - 1,
    y,
  },
  northwest: {
    x: x - 1,
    y: y - 1,
  },
});
var oppositeDiagonals: Record<string, string[]> = {
  // useful for part two
  north: ["southeast", "southwest"],
  east: ["northwest", "southwest"],
  south: ["northwest", "northeast"],
  west: ["northeast", "southeast"],
};
