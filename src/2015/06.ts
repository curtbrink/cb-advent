export default function runSolution(fileInput: string): void {
  var lightGrid = new LightGrid();

  var instructions = fileInput
    .trim()
    .split("\n")
    .map((l) => new Instruction(l));

  console.log(`Parsed ${instructions.length} light grid instructions`);

  var idx = 0;
  for (var ins of instructions) {
    idx++;
    console.log(`[${idx}] ... ${ins.toString()}`);
    console.log(`    prev: ${lightGrid.getNumberOfLightsOn()} on`);
    lightGrid.executeInstruction(ins);
    console.log(`     now: ${lightGrid.getNumberOfLightsOn()} on`);
  }
}

type InstructionType = "on" | "off" | "toggle";
type Coordinate = {
  x: number;
  y: number;
};
type InstructionMethod = (x: number, y: number) => void;
type InstructionMap = Record<InstructionType, InstructionMethod>;

function parseCoordinate(input: string): Coordinate {
  var splitPair = input.split(",").map((v) => parseInt(v));
  return { x: splitPair[0], y: splitPair[1] };
}

class Instruction {
  instructionType: InstructionType;
  coord1: Coordinate;
  coord2: Coordinate;

  constructor(input: string) {
    console.log(`Parsing instruction ${input}`);
    var tokens = input.split(" ");
    var idx = 0;

    // first token or two tokens determines type.
    if (tokens[idx] === "toggle") {
      this.instructionType = "toggle";
    } else {
      idx++;
      this.instructionType = tokens[idx] === "on" ? "on" : "off";
    }

    // next token determines first coordinate
    idx++;
    this.coord1 = parseCoordinate(tokens[idx]);

    // next token should be "through", error if not for debug purposes
    idx++;
    if (tokens[idx] !== "through") {
      throw new Error("something went wrong with parsing");
    }

    // last token determines second coordinate
    idx++;
    this.coord2 = parseCoordinate(tokens[idx]);

    console.log(this.toString());
  }

  toString(): string {
    return `[${this.instructionType}] | [${this.coord1.x}, ${this.coord1.y}] => [${this.coord2.x}, ${this.coord2.y}]`;
  }
}

class LightGrid {
  lights: boolean[][] = [];

  instructionMap: InstructionMap = {
    off: this.turnOff,
    on: this.turnOn,
    toggle: this.toggle,
  };

  constructor() {
    for (var i = 0; i < 1000; i++) {
      var lightRow = [];
      for (var j = 0; j < 1000; j++) {
        lightRow.push(false);
      }
      this.lights.push(lightRow);
    }

    console.log(
      `Initialized light grid with ${this.lights.length} rows of ${this.lights[0].length} lights each.`
    );
  }

  turnOn(x: number, y: number): void {
    this.lights[x][y] = true;
  }

  turnOff(x: number, y: number): void {
    this.lights[x][y] = false;
  }

  toggle(x: number, y: number): void {
    var current = this.lights[x][y];
    this.lights[x][y] = !current;
  }

  getNumberOfLightsOn(): number {
    var sum = 0;
    for (var row of this.lights) {
      for (var light of row) {
        sum += light ? 1 : 0;
      }
    }
    return sum;
  }

  executeInstruction(instruction: Instruction) {
    var instructionMethod =
      this.instructionMap[instruction.instructionType].bind(this);

    for (var i = instruction.coord1.x; i <= instruction.coord2.x; i++) {
      for (var j = instruction.coord1.y; j <= instruction.coord2.y; j++) {
        instructionMethod(i, j);
      }
    }
  }
}
