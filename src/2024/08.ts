export default function runSolution(fileInput: string): void {
  // first thought: is this brute forceable in a reasonable timeframe?
  // - scan file once to find every antenna and stick them in a map.
  // - for every pair of frequencies:
  //    - find both antinodes. if they are on a blank spot on the grid, add to a SET (not array since we want uniques only).

  // parse the grid to a multidimensional array of chars
  var theGrid: string[][] = fileInput
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));

  // find all the antennas
  var antennas: Record<string, Vector[]> = {};
  for (var y = 0; y < theGrid.length; y++) {
    for (var x = 0; x < theGrid[0].length; x++) {
      var char = theGrid[y][x];
      if (char !== ".") {
        // found an antenna
        var vec = new Vector(x, y);
        if (!(char in antennas)) {
          antennas[char] = [];
        }
        antennas[char].push(vec);
      }
    }
  }

  // part one antinodes
  var allAntinodesP1 = new Set<string>();
  for (var frequency of Object.keys(antennas)) {
    for (var pair of getAllVectorPairs(antennas[frequency])) {
      var pairAntinodes = Vector.getAntinodes(pair[0], pair[1]);
      for (var pairAntinode of pairAntinodes) {
        allAntinodesP1.add(pairAntinode.toString());
      }
    }
  }
  var antinodeListP1 = [...allAntinodesP1];

  var actualAntinodesP1 = 0;
  for (var potentialAntinode of antinodeListP1) {
    // make sure there isn't anything there!
    var split = potentialAntinode.split(",");
    var x = parseInt(split[0]);
    var y = parseInt(split[1]);
    if (x >= 0 && x < theGrid[0].length && y >= 0 && y < theGrid.length) {
      actualAntinodesP1++;
    }
  }

  console.log(
    `Part 1: There are ${actualAntinodesP1} unique antinodes on this grid.`
  );

  // part two antinodes
  var allAntinodesP2 = new Set<string>();
  for (var frequency of Object.keys(antennas)) {
    for (var pair of getAllVectorPairs(antennas[frequency])) {
      var pairAntinodes = Vector.getAntinodesP2(
        pair[0],
        pair[1],
        new Vector(theGrid[0].length, theGrid.length)
      );
      for (var pairAntinode of pairAntinodes) {
        allAntinodesP2.add(pairAntinode.toString());
      }
    }
  }
  var antinodeListP2 = [...allAntinodesP2];

  var actualAntinodesP2 = 0;
  for (var potentialAntinode of antinodeListP2) {
    // make sure there isn't anything there!
    var split = potentialAntinode.split(",");
    var x = parseInt(split[0]);
    var y = parseInt(split[1]);
    if (x >= 0 && x < theGrid[0].length && y >= 0 && y < theGrid.length) {
      actualAntinodesP2++;
    }
  }

  console.log(
    `Part 2: There are ${actualAntinodesP2} unique antinodes on this grid.`
  );
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

  static add(v1: Vector, v2: Vector) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  // where's the antinodes?
  // ...
  // for any 2 vectors a and b:
  // xDiff = a.x - b.x
  // yDiff = a.y - b.y
  // (order is important because we want a straight line)
  // antinode 1 = a.x + xDiff, a.y + yDiff
  // antinode 2 = b.x - xDiff, b.y - yDiff
  static getAntinodes(v1: Vector, v2: Vector): Vector[] {
    var xDiff = v1.x - v2.x;
    var yDiff = v1.y - v2.y;
    return [
      new Vector(v1.x + xDiff, v1.y + yDiff),
      new Vector(v2.x - xDiff, v2.y - yDiff),
    ];
  }

  static getAntinodesP2(v1: Vector, v2: Vector, gridBounds: Vector): Vector[] {
    var xDiff = v1.x - v2.x;
    var yDiff = v1.y - v2.y;
    // walk directions until out of bounds
    // each antenna is also an antinode.
    var allAntinodes: Vector[] = [v1, v2];
    var d1OOB = false;
    var d1NewVec = new Vector(v1.x + xDiff, v1.y + yDiff);
    while (!d1OOB) {
      if (
        d1NewVec.x < 0 ||
        d1NewVec.x >= gridBounds.x ||
        d1NewVec.y < 0 ||
        d1NewVec.y >= gridBounds.y
      ) {
        d1OOB = true;
        continue;
      }
      allAntinodes.push(d1NewVec);
      d1NewVec = new Vector(d1NewVec.x + xDiff, d1NewVec.y + yDiff);
    }
    var d2OOB = false;
    var d2NewVec = new Vector(v2.x - xDiff, v2.y - yDiff);
    while (!d2OOB) {
      if (
        d2NewVec.x < 0 ||
        d2NewVec.x >= gridBounds.x ||
        d2NewVec.y < 0 ||
        d2NewVec.y >= gridBounds.y
      ) {
        d2OOB = true;
        continue;
      }
      allAntinodes.push(d2NewVec);
      d2NewVec = new Vector(d2NewVec.x - xDiff, d2NewVec.y - yDiff);
    }

    console.log(`Antinodes for... ${v1.toString()} - ${v2.toString()}`);
    console.log(allAntinodes);
    printTestGrid(gridBounds.x, gridBounds.y, "o", [v1, v2], allAntinodes);

    return allAntinodes;
  }
}

function getAllVectorPairs(vectors: Vector[]): Vector[][] {
  var allPairs: Vector[][] = [];
  for (var i = 0; i < vectors.length - 1; i++) {
    for (var j = i + 1; j < vectors.length; j++) {
      allPairs.push([vectors[i], vectors[j]]);
    }
  }
  return allPairs;
}

function printTestGrid(
  x: number,
  y: number,
  antennaChar: string,
  antennaLocations: Vector[],
  antinodeLocations: Vector[]
) {
  var gridStr = "";
  for (var i = 0; i < y; i++) {
    for (var j = 0; j < x; j++) {
      if (antennaLocations.find((v) => v.x === j && v.y === i)) {
        gridStr += antennaChar;
      } else if (antinodeLocations.find((v) => v.x === j && v.y === i)) {
        gridStr += "X";
      } else {
        gridStr += ".";
      }
    }
    gridStr += "\n";
  }
  console.log("====");
  console.log(gridStr);
  console.log("====");
}
