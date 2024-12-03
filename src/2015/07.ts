import { randomUUID } from "crypto";

export default function runSolution(fileInput: string): void {
  // parse each line:
  var lines = fileInput.trim().split("\n");

  var theBoard = generateBoard(lines);
  theBoard.simulate();
  var wireASignal = theBoard.getSignalForWire("a")!;

  console.log(`At the end of part one, wire A holds signal ${wireASignal}`);

  var partTwoBoard = generateBoard(lines, wireASignal);
  partTwoBoard.simulate();
  wireASignal = partTwoBoard.getSignalForWire("a")!;

  console.log(`At the end of part two, wire A holds signal ${wireASignal}`);
}

function generateBoard(lines: string[], overrideWireB?: number): Board {
  var theBoard = new Board();

  for (var line of lines) {
    var inAndOut = line.split("->").map((v) => v.trim());
    var outputWireId = inAndOut[1];

    // further parse lhs
    if (/^\d+$/.test(inAndOut[0])) {
      // constant val to wire
      // also this is where we would apply the override for part 2
      var shouldOverride = outputWireId === "b" && overrideWireB !== undefined;
      var inputSignal = shouldOverride ? overrideWireB! : parseInt(inAndOut[0]);
      theBoard.addWire(outputWireId, inputSignal);
      continue;
    }
    if (/^\w+$/.test(inAndOut[0])) {
      // pass thru gate
      theBoard.addWire(outputWireId);
      theBoard.addWire(inAndOut[0]);
      var passThruGate = new PassThroughGate([inAndOut[0]], [outputWireId]);
      theBoard.addGate(passThruGate);
      continue;
    }

    // always add output wire
    theBoard.addWire(outputWireId);

    // lhs is multiple tokens...
    var lhTokens = inAndOut[0].split(" ");
    if (lhTokens.length === 2) {
      // not gate
      var inputWireId = lhTokens[1];
      theBoard.addWire(inputWireId);
      var notGate = new NotGate([inputWireId], [outputWireId]);
      theBoard.addGate(notGate);
      continue;
    }

    // lhs is presumably 3 tokens now. we need to parse the 1st and 3rd as inputs and the 2nd as operation.
    // either input could be a constant.
    var inputOne = lhTokens[0];
    var inputOneWireId = inputOne;
    if (/^\d+$/.test(inputOne)) {
      inputOneWireId = randomUUID();
      theBoard.addWire(inputOneWireId, parseInt(inputOne));
    } else {
      theBoard.addWire(inputOneWireId);
    }
    var inputTwo = lhTokens[2];
    var inputTwoWireId = inputTwo;
    if (/^\d+$/.test(inputTwo)) {
      inputTwoWireId = randomUUID();
      theBoard.addWire(inputTwoWireId, parseInt(inputTwo));
    } else {
      theBoard.addWire(inputTwoWireId);
    }

    var gateToAdd: Gate | undefined;
    switch (lhTokens[1]) {
      case "AND":
        gateToAdd = new AndGate(
          [inputOneWireId, inputTwoWireId],
          [outputWireId]
        );
        break;
      case "OR":
        gateToAdd = new OrGate(
          [inputOneWireId, inputTwoWireId],
          [outputWireId]
        );
        break;
      case "LSHIFT":
        gateToAdd = new LeftShiftGate(
          [inputOneWireId, inputTwoWireId],
          [outputWireId]
        );
        break;
      case "RSHIFT":
        gateToAdd = new RightShiftGate(
          [inputOneWireId, inputTwoWireId],
          [outputWireId]
        );
        break;
    }
    if (gateToAdd !== undefined) {
      theBoard.addGate(gateToAdd);
    }
  }

  return theBoard;
}

// types of things happening here

// wire: holds a signal

// gate: performs some operation on one or more wires, giving its signal to another wire

class Wire {
  signal: number | undefined; // 0 to 65535

  constructor(signal?: number) {
    this.signal = signal;
  }

  setSignal(signal: number): void {
    this.signal = signal;
  }
}

abstract class Gate {
  inputs: string[] = [];
  outputs: string[] = [];
  finishedComputing: boolean = false;

  constructor(inputs: string[], outputs: string[]) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  abstract operation: (inputs: number[]) => number;
}

class PassThroughGate extends Gate {
  override operation: (inputs: number[]) => number = (inputs: number[]) =>
    inputs[0];
}

class AndGate extends Gate {
  override operation: (inputs: number[]) => number = (inputs: number[]) =>
    inputs[0] & inputs[1];
}

class OrGate extends Gate {
  override operation: (inputs: number[]) => number = (inputs: number[]) =>
    inputs[0] | inputs[1];
}

class NotGate extends Gate {
  override operation: (inputs: number[]) => number = (inputs: number[]) =>
    ~inputs[0] + 65536;
}

class LeftShiftGate extends Gate {
  override operation: (inputs: number[]) => number = (inputs: number[]) =>
    inputs[0] << inputs[1];
}

class RightShiftGate extends Gate {
  override operation: (inputs: number[]) => number = (inputs: number[]) =>
    inputs[0] >> inputs[1];
}

class Board {
  wires: Record<string, Wire> = {};
  gates: Gate[] = [];

  simulate() {
    while (!this.allFinished()) {
      //console.log("==============");
      for (var gate of this.gates) {
        if (!this.gateIsComputable(gate)) {
          continue;
        }

        // map inputs
        var inputs = gate.inputs.map((i) => this.getSignalForWire(i)!);
        var gateOutput = gate.operation(inputs);
        for (var outputWire of gate.outputs) {
          this.wires[outputWire].setSignal(gateOutput);
        }
        gate.finishedComputing = true;
      }

      //console.log(this.toString());
    }
  }

  addWire(id: string, signal?: number) {
    var keyExists = id in this.wires;
    if (keyExists && signal !== undefined) {
      throw new Error(`Wire ${id} with a set signal already exists`);
    }

    if (!keyExists) {
      var wire = new Wire(signal);
      this.wires[id] = wire;
    }
  }

  addGate(gate: Gate) {
    this.gates.push(gate);
  }

  getSignalForWire(id: string) {
    return this.wires[id].signal;
  }

  gateIsComputable(gate: Gate) {
    // a gate is computable when all its inputs have signals
    return gate.inputs.every((i) => this.getSignalForWire(i) !== undefined);
  }

  allFinished(): boolean {
    return this.gates.every((g) => g.finishedComputing);
  }

  toString(): string {
    var output = "";
    for (var wireId of Object.keys(this.wires)) {
      output += `[W] id ${wireId} signal ${this.wires[wireId].signal}\n`;
    }
    for (var gate of this.gates) {
      output += `[G] type ${typeof gate} in ${gate.inputs} out ${
        gate.outputs
      }\n`;
    }
    return output;
  }
}
