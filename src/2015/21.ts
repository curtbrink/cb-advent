export default function runSolution(fileInput: string): void {

  // setup
  var nums = [...fileInput.matchAll(/(\d+)/g)];
  console.log(nums);

  var bossStartingHp = parseInt(nums[0][0]);
  var playerStartingHp = 100;

  var theBoss = new Attacker("Boss", bossStartingHp, parseInt(nums[1][0]), parseInt(nums[2][0]));
  var thePlayer = new Attacker("Player", playerStartingHp, 0, 0);

  // part one: find the cheapest loadout that wins
  var allLoadouts = Shop.getPossibleLoadouts();
  allLoadouts.sort((a, b) => getCostOfLoadout(a) - getCostOfLoadout(b)); // least expensive -> most expensive

  var cheapestWinnerCost: number;
  for (var loadout of allLoadouts) {
    theBoss.hp = bossStartingHp;
    thePlayer.hp = playerStartingHp;
    thePlayer.unequipAll();
    thePlayer.equipLoadout(loadout);

    var result = simulateBattle(thePlayer, theBoss);
    if (result) {
      cheapestWinnerCost = getCostOfLoadout(thePlayer.loadout);
      break;
    }
  }

  // part two: find the most expensive loadout that loses
  allLoadouts.sort((a, b) => getCostOfLoadout(b) - getCostOfLoadout(a)); // most expensive -> least expensive

  var expensivestLoserCost: number;
  for (var loadout of allLoadouts) {
    theBoss.hp = bossStartingHp;
    thePlayer.hp = playerStartingHp;
    thePlayer.unequipAll();
    thePlayer.equipLoadout(loadout);

    var result = simulateBattle(thePlayer, theBoss);
    if (!result) {
      expensivestLoserCost = getCostOfLoadout(thePlayer.loadout);
      break;
    }
  }

  console.log(`Cheapest winner (part one): ${cheapestWinnerCost!} gold`);
  console.log(`Most expensive loser (part two): ${expensivestLoserCost!} gold`);
}

function simulateBattle(p1: Attacker, p2: Attacker): boolean {
  // simulates battle between p1 who goes first and p2. returns true if p1 wins.
  while (true) {
    // p1 goes first
    var p1Result = p2.receiveAttack(p1.getAttackDamage());
    if (p1Result.killed) {
      return true;
    }
    var p2Result = p1.receiveAttack(p2.getAttackDamage());
    if (p2Result.killed) {
      return false;
    }
  }
}

function getCostOfLoadout(loadout: Item[]): number {
  return loadout.reduce((totalCost, currentItem) => totalCost + currentItem.cost, 0);
}

class Attacker {
  name: string;
  hp: number;
  damage: number;
  armor: number;
  loadout: Item[];

  constructor(name: string, hp: number, damage: number, armor: number) {
    this.name = name;
    this.hp = hp;
    this.damage = damage;
    this.armor = armor;
    this.loadout = [];
  }

  getAttackDamage(): number {
    return this.damage + this.loadout.reduce((sum, currentItem) => sum + currentItem.damage, 0);
  }

  getDefense(): number {
    return this.armor + this.loadout.reduce((sum, currentItem) => sum + currentItem.armor, 0);
  }

  equipLoadout(items: Item[]) {
    this.loadout = items;
  }

  unequipAll() {
    this.loadout = [];
  }

  receiveAttack(attackDamage: number): AttackResult {
    var actualDamage = Math.max(attackDamage - this.getDefense(), 1);
    this.hp -= actualDamage;
    return { damageDone: actualDamage, killed: this.hp <= 0 };
  }
}

type AttackResult = {
  damageDone: number,
  killed: boolean,
}

type Item = {
  name: string;
  cost: number;
  damage: number;
  armor: number;
};

class Shop {
  static weapons: Item[] = [
    {
      name: "Dagger",
      cost: 8,
      damage: 4,
      armor: 0,
    },
    {
      name: "Shortsword",
      cost: 10,
      damage: 5,
      armor: 0,
    },
    {
      name: "Warhammer",
      cost: 25,
      damage: 6,
      armor: 0,
    },
    {
      name: "Longsword",
      cost: 40,
      damage: 7,
      armor: 0,
    },
    {
      name: "Greataxe",
      cost: 74,
      damage: 8,
      armor: 0,
    },
  ];

  static armor: Item[] = [
    {
      name: "Leather",
      cost: 13,
      damage: 0,
      armor: 1,
    },
    {
      name: "Chainmail",
      cost: 31,
      damage: 0,
      armor: 2,
    },
    {
      name: "Splintmail",
      cost: 53,
      damage: 0,
      armor: 3,
    },
    {
      name: "Bandedmail",
      cost: 75,
      damage: 0,
      armor: 4,
    },
    {
      name: "Platemail",
      cost: 102,
      damage: 0,
      armor: 5,
    },
  ];

  static rings: Item[] = [
    {
      name: "Damage +1",
      cost: 25,
      damage: 1,
      armor: 0,
    },
    {
      name: "Damage +2",
      cost: 50,
      damage: 2,
      armor: 0,
    },
    {
      name: "Damage +3",
      cost: 100,
      damage: 3,
      armor: 0,
    },
    {
      name: "Defense +1",
      cost: 20,
      damage: 0,
      armor: 1,
    },
    {
      name: "Defense +2",
      cost: 40,
      damage: 0,
      armor: 2,
    },
    {
      name: "Defense +3",
      cost: 80,
      damage: 0,
      armor: 3,
    },
  ];

  // gets a list of loadouts, represented by an Item array.
  // a valid loadout consist of 1 weapon, 0-1 armor, and 0-2 rings.
  static getPossibleLoadouts(): Item[][] {
    var allPossibilities: Item[][] = [];

    var weaponPossibilities: Item[] = [...this.weapons];
    var armorPossibilities: (Item | null)[] = [null, ...this.armor];
    var ringPossibilities: (Item | null)[] = [null, ...this.rings];

    // this will be slightly unoptimized, because wearing exactly 
    // one of the same ring on either LH or RH count as separate 
    // "loadouts" despite being functionally identical...

    for (var weapon of weaponPossibilities) {
      for (var armor of armorPossibilities) {
        for (var ringOne of ringPossibilities) {
          for (var ringTwo of ringPossibilities) {
            var loadout = [weapon, armor, ringOne, ringTwo].filter((item) => item !== null);
            allPossibilities.push(loadout);
          }
        }
      }
    }
    return allPossibilities;
  }
}