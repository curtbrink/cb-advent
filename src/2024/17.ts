export default function runSolution(fileInput: string): void {
  // parse the stuff
  var registerRegex = /Register (\w): (\d+)/g;
  var programRegex = /Program: ([\d,]+)/g;

  var registers = [...fileInput.matchAll(registerRegex)].map((m) =>
    parseInt(m[2])
  );
  var program = [...fileInput.matchAll(programRegex)][0][1]
    .split(",")
    .map((n) => parseInt(n));

  // run the stuff
  var computer = new Computer(registers[0], registers[1], registers[2]);
  var result = computer.runProgram(program);
  console.log(`Part one output: ${result}`);

  /*
  part two is finding a register value for A that outputs the program itself...
  brute force is not feasible since the answer for A is in the order of magnitude of
  2 ^ (3 * program length) which here would be 2^48.

  from some of my handwritten notes:
  - each loop of the program is truncating A by 3 bits. (a = floor(a / 8))
  - each loop, B and C are entirely functions of A, meaning for each loop the starting values of B and C are irrelevant.
  - the value of A, other than truncating by 3 bits, is never changed.
  - CONCLUSION: we can think of each loop of the program as operating on a distinct chunk of 3 bits.

  this led to some furious scribbling from the investigation of patterns of binary representations of A inputs...

  program is p1, p2, p3, ..., p(n)

  program resulting in "0" i.e. pn -> brute forced values of A < 8 (2^3) -> A must be 5 (101 as bit representation)

  program ending in "3,0" i.e. [p(n-1), p(n)] -> brute forced values of A < 64 (2^6) -> A is either 43 (101011) or 47 (101111)
  "oh hey, both of those numbers start with 101..."

  program ending in "5,3,0" i.e. [p(n-2), p(n-1), p(n)] -> brute forced values of A < 512 (2^9) -> A is either 346 (101011010) or 378 (101111010)
  "oh hey, both of those numbers start with one of the numbers that outputs 3,0..."

  the key here is that to end in [p(n-2), p(n-1), p(n)], the input for A must begin with one of the valid
  inputs that outputs [p(n-1), p(n)].

  we can build up our answer 3 bits at a time starting from the bottom!
  */

  var potentialPrefixes = [""]; // start with an empty prefix to get things going
  for (var n = 1; n <= program.length; n++) {
    var newPrefixes = [];
    var desiredOutput = program.slice(program.length - n).join(","); // last n digits of the program

    // only need to check each prefix against every combo of the right 3 bits (0-7)
    for (var i = 0; i < 8; i++) {
      for (var pre of potentialPrefixes) {
        // slam i onto the right of the prefix and convert to a number
        var prefixedI = parseInt(`${pre}${i.toString(2).padStart(3, "0")}`, 2);

        // simulate for this input
        var comp = new Computer(prefixedI);
        var result = comp.runProgram(program);

        // check if it matches the last n digits of our program
        if (result === desiredOutput) {
          // if it matches n digits, it is potentially a prefix of a valid input for matching n+1 digits.
          newPrefixes.push(prefixedI.toString(2));
        }
      }
    }
    // now we'll use those prefixes to check for the last n+1 digits.
    potentialPrefixes = [...newPrefixes];
  }

  // by the end of it, potentialPrefixes should contain only inputs of A that produce the whole program as output.
  // obviously, we want the smallest of these numbers as our answer.
  if (potentialPrefixes.length === 0) {
    console.log("Hmm...no inputs for A would produce the program as output...");
  } else {
    var minimum = Math.min(...potentialPrefixes.map((n) => parseInt(n, 2)));
    console.log(
      `Minimum value of A that produces the program itself is ${minimum}`
    );
  }
}

export class Computer {
  a: number;
  b: number;
  c: number;

  pc: number;

  output: number[];

  constructor(a?: number, b?: number, c?: number) {
    this.a = a ?? 0;
    this.b = b ?? 0;
    this.c = c ?? 0;
    this.pc = 0;
    this.output = [];
  }

  runProgram(instructions: number[]): string {
    while (this.pc >= 0 && this.pc < instructions.length) {
      var opcode = instructions[this.pc];
      var operand = instructions[this.pc + 1];

      var shouldIncrement = true;
      switch (opcode) {
        case 0:
          this.adv(operand);
          break;
        case 1:
          this.bxl(operand);
          break;
        case 2:
          this.bst(operand);
          break;
        case 3:
          var jumped = this.jnz(operand);
          shouldIncrement = !jumped;
          break;
        case 4:
          this.bxc();
          break;
        case 5:
          this.out(operand);
          break;
        case 6:
          this.bdv(operand);
          break;
        case 7:
          this.cdv(operand);
          break;
        default:
          console.log("Unsupported opcode");
          this.pc = -99;
          break;
      }

      if (shouldIncrement) {
        this.pc += 2;
      }
    }

    return this.output.join(",");
  }

  private adv(operand: number): void {
    var result = this.dv(operand);
    this.a = result;
  }

  private bdv(operand: number): void {
    var result = this.dv(operand);
    this.b = result;
  }

  private cdv(operand: number): void {
    var result = this.dv(operand);
    this.c = result;
  }

  private bxl(operand: number): void {
    this.b = (this.b ^ operand) >>> 0;
  }

  private bst(operand: number): void {
    this.b = this.getCombo(operand) % 8;
  }

  private jnz(operand: number): boolean {
    if (this.a === 0) {
      return false;
    }
    this.pc = operand;
    return true;
  }

  private bxc(): void {
    this.b = (this.b ^ this.c) >>> 0;
  }

  private out(operand: number): void {
    var result = this.getCombo(operand) % 8;
    this.output.push(result);
  }

  private dv(operand: number): number {
    var numerator = this.a;
    var denominator = Math.pow(2, this.getCombo(operand));
    return Math.floor(numerator / denominator);
  }

  private getCombo(operand: number) {
    if (operand >= 0 && operand < 4) {
      return operand;
    }
    switch (operand) {
      case 4:
        return this.a;
      case 5:
        return this.b;
      case 6:
        return this.c;
    }
    this.pc = -99;
    return 0;
  }
}
