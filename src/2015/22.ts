export default function runSolution(fileInput: string): void {
  // setup
  var nums = [...fileInput.matchAll(/(\d+)/g)];
  var bossStartingHp = parseInt(nums[0][0]);
  var bossDamage = parseInt(nums[1][0]);

  // this is a global var for pruning branches
  var globalMinimumMana: GlobalMin = {
    minimum: Number.MAX_SAFE_INTEGER,
  };

  // part one
  var result = doPlayerTurnRedux(
    {
      hp: 50,
      mana: 500,
    },
    {
      hp: bossStartingHp,
      damage: bossDamage,
    },
    [],
    0,
    globalMinimumMana,
  );
  console.log(`Minimum mana spent for part one: ${result}`);

  // part two
  // reset global minimum tracker
  globalMinimumMana = {
    minimum: Number.MAX_SAFE_INTEGER,
  };
  var result = doPlayerTurnRedux(
    {
      hp: 50,
      mana: 500,
    },
    {
      hp: bossStartingHp,
      damage: bossDamage,
    },
    [],
    0,
    globalMinimumMana,
    true,
  );
  console.log(`Minimum mana spent for part two (hard mode!): ${result}`);
}

function doPlayerTurnRedux(player: Player, boss: Boss, effects: Effect[], manaSpent: number, globalMin: GlobalMin, isHardMode: boolean = false): number {

  // apply all status effects
  var playerHpAfterHardMode = player.hp - (isHardMode ? 1 : 0);
  if (playerHpAfterHardMode <= 0) {
    // dead
    return Number.MAX_SAFE_INTEGER;
  }

  var bossHpAfterPoison = doPoisonEffect(boss, effects);
  if (bossHpAfterPoison <= 0) {
    // any time the boss dies, adjust global min
    globalMin.minimum = Math.min(globalMin.minimum, manaSpent);
    return manaSpent;
  }
  var playerManaAfterRecharge = doRechargeEffect(player, effects);
  // we can ignore the player armor from the shield effect on player's own turn.

  // tick status effects
  var effectsAfterTicking = tickDownEffects(effects);
  
  // get available spells
  var availableSpells = getAvailableSpells(playerManaAfterRecharge, effectsAfterTicking);
  if (availableSpells.length === 0) {
    // no available spells = bye
    return Number.MAX_SAFE_INTEGER;
  }

  var minimumManaRequiredToKillBossFromThisTurn = Number.MAX_SAFE_INTEGER; // this is initialized to max value since we do not yet know if we can kill boss from this turn.

  for (var spell of availableSpells) {
    // incur cost of spell
    var totalManaSpendAfterCasting = manaSpent + spell.cost;
    var playerManaAfterCasting = playerManaAfterRecharge - spell.cost;

    // we can prune this branch if we already have a branch that is as cheap or cheaper
    if (globalMin.minimum <= totalManaSpendAfterCasting) {
      continue;
    }

    // resolve instant effects
    var bossHpAfterCasting = bossHpAfterPoison - (spell.instantDamage ? spell.instantDamage : 0);
    if (bossHpAfterCasting <= 0) {
      // instant damage killed the boss. check if new minimum
      minimumManaRequiredToKillBossFromThisTurn = Math.min(minimumManaRequiredToKillBossFromThisTurn, totalManaSpendAfterCasting);
      // any time the boss dies, adjust global min
      globalMin.minimum = Math.min(globalMin.minimum, minimumManaRequiredToKillBossFromThisTurn);
      continue;
    }
    var playerHpAfterCasting = playerHpAfterHardMode + (spell.instantHeal ? spell.instantHeal : 0);

    var effectsBeforeCasting = copyEffects(effectsAfterTicking);
    var effectsAfterCasting = [...effectsBeforeCasting, ...(spell.effects ?? [])];

    var minimumManaRequiredToKillBossAfterCastingThisSpell = doBossTurnRedux(
      {
        hp: playerHpAfterCasting,
        mana: playerManaAfterCasting,
      },
      {
        hp: bossHpAfterCasting,
        damage: boss.damage,
      },
      effectsAfterCasting,
      totalManaSpendAfterCasting,
      globalMin,
      isHardMode,
    );
    minimumManaRequiredToKillBossFromThisTurn = Math.min(minimumManaRequiredToKillBossAfterCastingThisSpell, minimumManaRequiredToKillBossFromThisTurn);
  }
  return minimumManaRequiredToKillBossFromThisTurn;
}

function doBossTurnRedux(player: Player, boss: Boss, effects: Effect[], manaSpent: number, globalMin: GlobalMin, isHardMode: boolean = false): number {

  // apply status effects
  var bossHpAfterPoison = doPoisonEffect(boss, effects);
  if (bossHpAfterPoison <= 0) {
    // any time the boss dies, adjust global min
    globalMin.minimum = Math.min(globalMin.minimum, manaSpent);
    return manaSpent;
  }

  var playerArmorAfterShield = doShieldEffect(effects);
  var playerManaAfterRecharge = doRechargeEffect(player, effects);

  // tick effects
  var effectsAfterTicking = tickDownEffects(effects);

  // boss attacks player
  var actualDamage = Math.max(1, boss.damage - playerArmorAfterShield);
  var playerHpAfterDamage = player.hp - actualDamage;
  if (playerHpAfterDamage <= 0) {
    return Number.MAX_SAFE_INTEGER;
  }

  // only one way boss turns shake out, so return the next player turn
  return doPlayerTurnRedux(
    {
      hp: playerHpAfterDamage,
      mana: playerManaAfterRecharge,
    },
    {
      hp: bossHpAfterPoison,
      damage: boss.damage,
    },
    effectsAfterTicking,
    manaSpent,
    globalMin,
    isHardMode,
  );
}

// applies poison to boss if applicable and returns new boss HP
function doPoisonEffect(boss: Boss, effects: Effect[]): number {
  var poisonEffect = effects.find((e) => e.name === "Poison");
  var newBossHp = boss.hp;
  if (poisonEffect) {
    // console.log(`Boss takes ${poisonEffect.damageOverTime!} poison damage!`);
    newBossHp = boss.hp - poisonEffect.damageOverTime!;
  }
  return newBossHp;
}

// applies shield to player if applicable and returns player armor value
function doShieldEffect(effects: Effect[]): number {
  var playerArmor = 0;
  var shieldEffect = effects.find((e) => e.name === "Shield");
  if (shieldEffect) {
    // console.log(`Player Shield boosts armor to ${shieldEffect.armorBoost!}!`);
    playerArmor = shieldEffect.armorBoost!;
  }
  return playerArmor;
}

// applies recharge if applicable and returns the available mana for this turn
function doRechargeEffect(player: Player, effects: Effect[]): number {
  var playerMana = player.mana;
  var rechargeEffect = effects.find((e) => e.name === "Recharge");
  if (rechargeEffect) {
    // console.log(`Player recharges ${rechargeEffect.manaRecharge!} mana!`);
    playerMana += rechargeEffect.manaRecharge!;
  }
  return playerMana;
}

// ticks down effect timers, removing any that hit zero, returning the new list of effects
function tickDownEffects(effects: Effect[]): Effect[] {
  // console.log(`Ticking effects: ${effects.map((e) => e.name)}`);
  var ticked = effects.map((e) => {
    var newEffect = { ...e };
    newEffect.timer -= 1;
    return newEffect;
  })
  .filter((e) => e.timer > 0);
  // console.log(`==> ${ticked.map((e) => e.name)}`);
  return ticked;
}

function copyEffects(effects: Effect[]): Effect[] {
  var copy: Effect[] = [];
  for (var effect of effects) {
    copy.push({ ...effect });
  }
  return copy;
}

function getAvailableSpells(mana: number, effects: Effect[]): Spell[] {
  return allSpells
    .filter((spell) => {
      // must be able to afford
      if (spell.cost > mana) {
        return false;
      }
      // must not be an active effect
      if (spell.effects) {
        for (var spellEffect of spell.effects) {
          if (effects.map((e) => e.name).includes(spellEffect.name)) {
            return false;
          }
        }
      }
      return true;
    });
}

type Effect = {
  name: string, // can't have duplicate effects!
  timer: number,
  armorBoost?: number,
  damageOverTime?: number,
  manaRecharge?: number,
}

type Spell = {
  name: string,
  cost: number,
  instantDamage?: number,
  instantHeal?: number,
  effects?: Effect[],
}

type Boss = {
  hp: number,
  damage: number,
}

type Player = {
  hp: number,
  mana: number,
}

type GlobalMin = {
  minimum: number,
}

const allSpells: Spell[] = [
  {
    name: "Magic Missile",
    cost: 53,
    instantDamage: 4,
  },
  {
    name: "Drain",
    cost: 73,
    instantDamage: 2,
    instantHeal: 2,
  },
  {
    name: "Shield",
    cost: 113,
    effects: [
      {
        name: "Shield",
        timer: 6,
        armorBoost: 7,
      },
    ],
  },
  {
    name: "Poison",
    cost: 173,
    effects: [
      {
        name: "Poison",
        timer: 6,
        damageOverTime: 3,
      },
    ],
  },
  {
    name: "Recharge",
    cost: 229,
    effects: [
      {
        name: "Recharge",
        timer: 5,
        manaRecharge: 101,
      },
    ],
  },
];
