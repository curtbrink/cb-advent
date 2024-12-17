export default async function runSolution(fileInput: string): Promise<void> {
  var robots = fileInput
    .trim()
    .split("\n")
    .map((l) => parseRobot(l.trim()));

  var gridX = 101;
  var gridY = 103;
  var time = 100;

  var robotsAfterTime = robots.map((r) => moveRobot(r, gridX, gridY, time));
  var partOneSafetyFactor = getSafetyFactor(robotsAfterTime, gridX, gridY);

  console.log(`Safety factor after ${time} seconds is ${partOneSafetyFactor}`);

  // note I did this manually at first which looks fun and cool

  // console.log(`Starting part two in 5 seconds...`);
  // await sleep(5000);

  // console.log(`Part two will loop indefinitely. Use Ctrl+C to exit.`);
  // await sleep(2000);
  // console.log(
  //   `Each loop will print the status of the robots after each second elapsed.`
  // );
  // await sleep(2000);

  // var i = 0;
  // while (true) {
  //   i++;
  //   console.log("\n\n");
  //   var robotsAtTime = robots.map((r) => moveRobot(r, gridX, gridY, i));
  //   console.log(`After ${i} seconds...`);
  //   printGrid(robotsAtTime, gridX, gridY);
  //   await sleep(200);
  // }

  // then someone on reddit mentioned usually the tree appears when the safety factor
  // is lowest, since the robots are all clustered together.
  // still needs to be checked manually but hey :D
  // it doesn't get beaten very easily so easy to spot and ctrl+C

  var i = 0;
  var minFactor = Number.MAX_SAFE_INTEGER;
  while (true) {
    i++;
    var newRobots = robots.map((r) => moveRobot(r, gridX, gridY, i));
    var safety = getSafetyFactor(newRobots, gridX, gridY);
    if (safety < minFactor) {
      console.log(`New minimum safety factor found at time ${i}`);
      printGrid(newRobots, gridX, gridY);
      minFactor = safety;
    }
  }
}

function parseRobot(input: string): Robot {
  var regex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/g;
  var matched = [...input.matchAll(regex)][0];
  return {
    pos: { x: parseInt(matched[1]), y: parseInt(matched[2]) },
    vel: { x: parseInt(matched[3]), y: parseInt(matched[4]) },
  };
}

function moveRobot(
  robot: Robot,
  gridX: number,
  gridY: number,
  time: number
): Robot {
  // maps a robot to a new x,y after given time, given its current position and velocity and the grid size
  return {
    pos: {
      x: modulo(robot.pos.x + robot.vel.x * time, gridX),
      y: modulo(robot.pos.y + robot.vel.y * time, gridY),
    },
    vel: robot.vel,
  };
}

function getSafetyFactor(
  robots: Robot[],
  gridX: number,
  gridY: number
): number {
  // map them into quadrants
  // assumption: grid dimensions are both always odd
  var robotsInQuadrants = robots.reduce(
    (quadrantMap: Robot[][], robot: Robot) => {
      var middleIdxX = Math.floor(gridX / 2);
      var middleIdxY = Math.floor(gridY / 2);
      if (robot.pos.x === middleIdxX || robot.pos.y === middleIdxY) {
        // no quadrant!
        return quadrantMap;
      }

      var quad = 0;
      if (robot.pos.x > middleIdxX) {
        quad++;
      }
      if (robot.pos.y > middleIdxY) {
        quad += 2;
      }
      quadrantMap[quad].push(robot);

      return quadrantMap;
    },
    [[], [], [], []]
  );

  // count quadrant sizes and multiply
  return robotsInQuadrants.reduce(
    (product: number, quadrant: Robot[]) => product * quadrant.length,
    1
  );
}

type Robot = {
  pos: { x: number; y: number };
  vel: { x: number; y: number };
};

// js doesn't do modulo correctly for negative numbers
var modulo = (a: number, b: number) => ((a % b) + b) % b;

// part two is a manual process so we need a sleep
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// print grid for part two
function printGrid(robots: Robot[], gridX: number, gridY: number) {
  var str = "";
  for (var y = 0; y < gridY; y++) {
    for (var x = 0; x < gridX; x++) {
      var hasRobot = robots.some((r) => r.pos.x === x && r.pos.y === y);
      str += hasRobot ? "O" : "-";
    }
    str += "\n";
  }
  console.log(str);
}
