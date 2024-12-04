export default function runSolution(fileInput: string): void {
  var wordSearch = new WordSearch(fileInput);
  var word = "XMAS";
  var wordsFound = wordSearch.getNumberOfWords(word);
  console.log(`Found ${wordsFound} instances of "${word}"`);

  // part two!
  var xesFound = wordSearch.getNumberOfXes("MAS");
  console.log(`Found ${xesFound} instances of an X-MAS`);
}

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static add(a: Vector, b: Vector): Vector {
    return new Vector(a.x + b.x, a.y + b.y);
  }
}

type Direction = "U" | "UR" | "R" | "DR" | "D" | "DL" | "L" | "UL";
type VectorMap = Record<Direction, Vector>;

const vectorMap: VectorMap = {
  "U": new Vector(0, -1),
  "UR": new Vector(1, -1),
  "R": new Vector(1, 0),
  "DR": new Vector(1, 1),
  "D": new Vector(0, 1),
  "DL": new Vector(-1, 1),
  "L": new Vector(-1, 0),
  "UL": new Vector(-1, -1),
};

class WordSearch {
  chars: string[][] = [];

  constructor(fileInput: string) {
    var lines = fileInput.trim().split("\n").map((w) => w.trim());
    for (var line of lines) {
      this.chars.push([...(line.split(""))]);
    }
    console.log(this.chars);
  }

  getNumberOfXes(word: string): number {
    var total = 0;
    for (var y = 0; y < this.chars.length; y++) {
      for (var x = 0; x < this.chars[0].length; x++) {
        total += this.isXCenteredOnCoord(new Vector(x, y), word) ? 1 : 0;
      }
    }
    return total;
  }

  /*

  how many orientations?

  M   M
    A
  S   S
  "DOWN"

  M   S
    A
  M   S
  "RIGHT"

  S   M
    A
  S   M
  "LEFT"

  S   S
    A
  M   M
  "UP"

  */

  isXCenteredOnCoord(coordinates: Vector, word: string): boolean {
    var middleCharIdx = Math.floor(word.length / 2);
    if (
      coordinates.x < middleCharIdx 
      || coordinates.x > this.chars[0].length - middleCharIdx - 1 
      || coordinates.y < middleCharIdx 
      || coordinates.y > this.chars[0].length - middleCharIdx - 1
    ) {
      return false; // not enough room here for a whole X
    }
    if (this.chars[coordinates.y][coordinates.x] !== word.charAt(middleCharIdx)) {
      return false;
    }

    // construct checks for Xes
    var leftDown = Vector.add(coordinates, vectorMap.DL);
    var leftUp = Vector.add(coordinates, vectorMap.UL);
    var rightDown = Vector.add(coordinates, vectorMap.DR);
    var rightUp = Vector.add(coordinates, vectorMap.UR);

    var wordReadingDownRight = this.checkWordByCoordinatesAndVector(leftUp, vectorMap.DR, word);
    var wordReadingDownLeft = this.checkWordByCoordinatesAndVector(rightUp, vectorMap.DL, word);
    var wordReadingUpRight = this.checkWordByCoordinatesAndVector(leftDown, vectorMap.UR, word);
    var wordReadingUpLeft = this.checkWordByCoordinatesAndVector(rightDown, vectorMap.UL, word);

    // up = starting left-down, looking up-right && starting right-down, looking up-left etc.
    var upXCheck = wordReadingUpRight && wordReadingUpLeft;
    var rightXCheck = wordReadingDownRight && wordReadingUpRight;
    var downXCheck = wordReadingDownRight && wordReadingDownLeft;
    var leftXCheck = wordReadingDownLeft && wordReadingUpLeft;

    return upXCheck || rightXCheck || downXCheck || leftXCheck;
  }

  getNumberOfWords(word: string): number {
    var total = 0;
    for (var y = 0; y < this.chars.length; y++) {
      for (var x = 0; x < this.chars[0].length; x++) {
        total += this.getNumberOfWordsStartingAtCoord(new Vector(x, y), word);
      }
    }
    return total;
  }

  getNumberOfWordsStartingAtCoord(coordinates: Vector, word: string): number {
    var validDirections = this.getValidDirectionVectorsForCoordinate(coordinates);
    return validDirections
      .map((directionVector) => this.checkWordByCoordinatesAndVector(coordinates, directionVector, word))
      .filter((w) => w === true)
      .length;
  }

  checkWordByCoordinatesAndVector(coordinates: Vector, direction: Vector, word: string): boolean {
    var coordCopy = new Vector(coordinates.x, coordinates.y);
    for (var i = 0; i < word.length; i++) {
      if (word.charAt(i) !== this.chars[coordCopy.y][coordCopy.x]) {
        return false;
      }
      coordCopy = Vector.add(coordCopy, direction);
    }
    console.log(`Found word at [${coordinates.x},${coordinates.y}] in direction ${direction.x},${direction.y}`);
    return true;
  }

  getValidDirectionVectorsForCoordinate(coordinates: Vector): Vector[] {
    var canGoUp = coordinates.y > 2;
    var canGoLeft = coordinates.x > 2;
    var canGoRight = coordinates.x < this.chars[0].length - 3;
    var canGoDown = coordinates.y < this.chars.length - 3;

    var validVectors: Vector[] = [...Object.values(vectorMap)];

    return validVectors.filter((v) => 
      (canGoUp || v.y !== -1) 
      && (canGoDown || v.y !== 1) 
      && (canGoRight || v.x !== 1) 
      && (canGoLeft || v.x !== -1)
    );
  }
}