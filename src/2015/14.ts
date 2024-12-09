export default function runSolution(fileInput: string): void {
  var regex = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./g;
  var matches = fileInput.matchAll(regex);

  var reindeer: Reindeer[] = [];
  for (var match of matches) {
    reindeer.push(new Reindeer(match[1], match[2], match[3], match[4]));
  }

  var maxDistance = 0;
  for (var r of reindeer) {
    if (r.getDistanceAfterSecond(2503) > maxDistance) {
      maxDistance = r.getDistanceAfterSecond(2503);
    }
  }
  console.log(`Winning reindeer has traveled ${maxDistance} km`);

  // brute force part 2 to avoid a complete rewrite...
  var totalScores: Record<string, number> = {};
  var reindeerNames = reindeer.map((r) => r.name);
  for (var name of reindeerNames) {
    totalScores[name] = 0;
  }

  for (var i = 1; i <= 2503; i++) {
    var distances: Record<string, number> = {};
    for (var r of reindeer) {
      distances[r.name] = r.getDistanceAfterSecond(i);
    }
    var maxDistance = Math.max(...Object.values(distances));
    for (var r of reindeer) {
      if (distances[r.name] === maxDistance) {
        totalScores[r.name] += 1;
      }
    }
  }

  console.log(`After 2503 seconds, the scores are:`);
  console.log(totalScores);
}

class Reindeer {
  name: string;
  maxVelocity: number;
  burstPeriod: number;
  restPeriod: number;

  constructor(name: string, maxVelocity: string, burstPeriod: string, restPeriod: string) {
    this.name = name;
    this.maxVelocity = parseInt(maxVelocity);
    this.burstPeriod = parseInt(burstPeriod);
    this.restPeriod = parseInt(restPeriod);
  }

  getTotalPeriod(): number {
    return this.burstPeriod + this.restPeriod;
  }

  getDistanceAfterSecond(second: number): number {
    // where in the total period are we?
    var totalPeriod = this.getTotalPeriod();
    var totalPeriods = Math.floor(second / totalPeriod);
    var rem = second % totalPeriod;

    var secondsSpentMoving = totalPeriods * this.burstPeriod + Math.min(this.burstPeriod, rem);

    return secondsSpentMoving * this.maxVelocity;
  }
}