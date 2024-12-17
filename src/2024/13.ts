export default function runSolution(fileInput: string): void {
  var fileSections = fileInput.trim().split("\n\n").map((l) => l.trim());

  var machines: ClawMachine[] = fileSections.map(parseClawMachine);
  
  var prizesWon = 0;
  var totalSpent = 0;
  for (var machine of machines) {
    var combos = waysPrizeCanBeReached(machine.prize, machine.a.delta, machine.b.delta);
    if (combos.length === 0) {
      // impossible game :(
      continue;
    }

    prizesWon++;
    totalSpent += Math.min(...(combos.map((c) => comboPrice(c))));
  }
  console.log(`Winning ${prizesWon} out of ${machines.length} would cost ${totalSpent}`);
}

function parseClawMachine(input: string): ClawMachine {
  var buttonRegex = (char: string) => new RegExp(`${char}: X\\+(\\d+), Y\\+(\\d+)`, "g");
  var prizeRegex = /X=(\d+), Y=(\d+)/g;

  var buttonAMatch = [...input.matchAll(buttonRegex("A"))][0];
  var buttonBMatch = [...input.matchAll(buttonRegex("B"))][0];
  var prizeMatch = [...input.matchAll(prizeRegex)][0];
  
  return {
    a: {
      cost: 3,
      delta: { x: parseInt(buttonAMatch[1]), y: parseInt(buttonAMatch[2]) },
    },
    b: {
      cost: 1,
      delta: { x: parseInt(buttonBMatch[1]), y: parseInt(buttonBMatch[2]) },
    },
    prize: { x: parseInt(prizeMatch[1]), y: parseInt(prizeMatch[2]) },
  };
}

function waysPrizeCanBeReached(target: Vector, optionA: Vector, optionB: Vector): number[][] {
  // returns a list of combos [x, y] where x = number of A presses and y = number of B presses
  var results: number[][] = [];
  for (var i = 0; i <= 100; i++) {
    for (var j = 0; j <= 100; j++) {
      if (target.x === optionA.x * i + optionB.x * j && target.y === optionA.y * i + optionB.y * j) {
        results.push([i, j]);
      }
    }
  }
  return results;
}

var comboPrice = (buttons: number[]) => buttons[0] * 3 + buttons[1];

type Vector = {
  x: number,
  y: number,
}
type Button = {
  cost: number,
  delta: Vector,
};
type ClawMachine = {
  a: Button,
  b: Button,
  prize: Vector,
}