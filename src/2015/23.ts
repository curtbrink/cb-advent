export default function runSolution(fileInput: string): void {
  // remove commas because they're dumb
  var commaless = fileInput.split(",").join("");
  var instructions = commaless.trim().split("\n").map((l) => l.trim());
  
  var comp = new Computer();
  comp.runProgram(instructions);

  console.log(`After running part one, the value of register b is ${comp.b.value}`);

  var compP2 = new Computer(1);
  compP2.runProgram(instructions);

  console.log(`After running part two, the value of register b is ${compP2.b.value}`);
}

type Register = {
  value: number,
}

class Computer {
  a: Register;
  b: Register;

  pc: number;

  constructor(a?: number) {
    this.a = a ? { value: a } : { value: 0 };
    this.b = { value: 0 };
    this.pc = 0;
  }

  runProgram(instructions: string[]) {
    // program ends when pc goes outside the instruction set
    while (this.pc >= 0 && this.pc < instructions.length) {
      var instruction = instructions[this.pc].split(" ");
      console.log(instruction);
      switch (instruction[0]) {
        // which instr?
        case "hlf":
          this.half(instruction);
          break;
        case "tpl":
          this.triple(instruction);
          break;
        case "inc":
          this.increment(instruction);
          break;
        case "jmp":
          this.jump(instruction);
          break;
        case "jie":
          this.jumpEven(instruction);
          break;
        case "jio":
          this.jumpOne(instruction);
          break;
        default:
          console.log(`==== UNRECOGNIZED INSTRUCTION ${instruction[0]} ====`);
          this.pc = instructions.length;
          break;
      }
    }
  }

  half(instruction: string[]) {
    // hlf r
    var reg = this.getRegister(instruction[1]);
    reg.value = Math.floor(reg.value / 2);
    this.pc++;
  }

  triple(instruction: string[]) {
    // tpl r
    var reg = this.getRegister(instruction[1]);
    reg.value = reg.value * 3;
    this.pc++;
  }
  
  increment(instruction: string[]) {
    // inc r
    var reg = this.getRegister(instruction[1]);
    reg.value = reg.value + 1;
    this.pc++;
  }

  jump(instruction: string[]) {
    // jmp offset ("+4" or "-17" e.g.)
    var sign = instruction[1][0];
    var factor = sign === "-" ? -1 : 1;
    var offset = parseInt(instruction[1].slice(1));
    this.pc = this.pc + (factor * offset);
  }

  jumpEven(instruction: string[]) {
    // jie r offset
    var reg = this.getRegister(instruction[1]);
    if (reg.value % 2 === 0) {
      this.jump([instruction[0], instruction[2]]);
    } else {
      this.pc++;
    }
  }

  jumpOne(instruction: string[]) {
    // jio r offset
    var reg = this.getRegister(instruction[1]);
    if (reg.value === 1) {
      this.jump([instruction[0], instruction[2]]);
    } else {
      this.pc++;
    }
  }

  getRegister(reg: string) {
    if (reg === "a") {
      return this.a;
    }
    if (reg === "b") {
      return this.b;
    }
    throw new Error("Unknown register");
  }
}