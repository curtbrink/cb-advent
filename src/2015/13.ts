export default function runSolution(fileInput: string): void {
  // modified traveling salesman from earlier problem?

  // "distance" = sum of individual gains or losses between two nodes

  var regex = /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\./g;
  var rules = [...fileInput.matchAll(regex)].map((r) => r.slice(1, 5));

  // construct map
  var allWeights: Record<string, Record<string, number>> = {};
  for (var rule of rules) {
    if (!allWeights[rule[0]]) {
      allWeights[rule[0]] = {};
    }

    if (!allWeights[rule[0]][rule[3]]) {
      allWeights[rule[0]][rule[3]] = (rule[1] === "lose" ? -1 : 1) * parseInt(rule[2]);
    }
  }
  console.log(allWeights);

  // always start with first one...
  var allNames = Object.keys(allWeights);
  var firstName = allNames[0];
  var otherNames = allNames.slice(1);
  var possibilities = getPossibilities(otherNames).map((p) => [firstName, ...p]);

  var happinessPartOne = optimizeHappiness(allWeights, possibilities, true);

  // part two, not a closed loop
  var allPossibilities = getPossibilities(allNames);
  var happinessPartTwo = optimizeHappiness(allWeights, allPossibilities, false);
  
  console.log(`Best happiness I can do is ${happinessPartOne}`);
  console.log(`But including yourself it's ${happinessPartTwo}`);
}

function optimizeHappiness(weights: Record<string, Record<string, number>>, possibilities: string[][], closedLoop: boolean) {
  // traverse each path and keep track of the minimum
  // var shortestDistance = Number.MAX_SAFE_INTEGER;
  var greatestNetChange = 0;

  var pathsChecked = 0;

  for (var possiblePath of possibilities) {
    pathsChecked++;
    if (pathsChecked % 50 === 0) {
      console.log(`[${pathsChecked}/${possibilities.length}] ...`);
    }
    // start with the total change from the last person because it's a closed loop of people
    var happiness = !closedLoop ? 0 : getTotalWeight(weights, possiblePath[0], possiblePath[possiblePath.length - 1]);
    for (var i = 0; i < possiblePath.length - 1; i++) {
      var src = possiblePath[i];
      var dst = possiblePath[i+1]; 
      happiness += getTotalWeight(weights, src, dst);
    }

    // if (distance < shortestDistance) {
    //   console.log(`Found new shortest path at distance ${distance}: ${possiblePath}`);
    //   shortestDistance = distance;
    // }
    if (happiness > greatestNetChange) {
      console.log(`Found new optimized happiness at total happiness ${happiness}: ${possiblePath}`);
      greatestNetChange = happiness;
    }
  }

  return greatestNetChange;
}

function getTotalWeight(itemWeights: Record<string, Record<string, number>>, a: string, b: string): number {
  return itemWeights[a][b] + itemWeights[b][a];
}

function getPossibilities(itemList: string[]): string[][] {
  if (itemList.length === 1) {
    return [itemList];
  }

  var possibilities = [];
  for (var listItem of itemList) {
    var listWithoutItem = itemList.filter((it) => it !== listItem);
    var sublistPossibilities = getPossibilities(listWithoutItem);
    var newPossibilitiesWithListItem = sublistPossibilities?.map((it) => [listItem, ...it]);
    for (var poss of newPossibilitiesWithListItem) {
      possibilities.push(poss);
    }
  }
  // console.log(possibilities);

  return possibilities;
}