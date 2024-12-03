export default function runSolution(fileInput: string): void {
  var lines = fileInput.trim().split("\n");

  // we're gonna brute force a traveling salesman here...

  // parse out distances between cities
  var cities: Record<string, City> = {};

  for (var line of lines) {
    var tokens = line.split(" ");
    var cityOne = tokens[0];
    var cityTwo = tokens[2];
    var distance = parseInt(tokens[4]);

    if (!(cityOne in cities)) {
      cities[cityOne] = new City();
    }
    if (!(cityTwo in cities)) {
      cities[cityTwo] = new City();
    }

    cities[cityOne].distanceMap[cityTwo] = distance;
    cities[cityTwo].distanceMap[cityOne] = distance;
  }

  // generate each unique path through the cities
  var poss = getPossibilities(Object.keys(cities));

  // traverse each path and keep track of the minimum
  var shortestDistance = Number.MAX_SAFE_INTEGER;
  var longestDistance = 0;

  var pathsChecked = 0;

  for (var possiblePath of poss) {
    pathsChecked++;
    if (pathsChecked % 50 === 0) {
      console.log(`[${pathsChecked}/${poss.length}] ...`);
    }
    var distance = 0;
    for (var i = 0; i < possiblePath.length - 1; i++) {
      var src = possiblePath[i];
      var dst = possiblePath[i+1];
      distance += cities[src].distanceMap[dst];
    }

    if (distance < shortestDistance) {
      console.log(`Found new shortest path at distance ${distance}: ${possiblePath}`);
      shortestDistance = distance;
    }
    if (distance > longestDistance) {
      console.log(`Found new longest path at distance ${distance}: ${possiblePath}`);
      longestDistance = distance;
    }
    
  }

  console.log();
  console.log(`Shortest distance: ${shortestDistance}`);
  console.log(`Longest distance: ${longestDistance}`);
}

class City {
  distanceMap: Record<string, number> = {}
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