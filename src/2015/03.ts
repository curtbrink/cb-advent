export default function runSolution(fileInput: string): void {
  var makeXYKey = (x: number, y: number) => `${x}|${y}`;
  var visitedHousesPart1 = new Set();
  var visitedHousesPart2 = new Set();

  // starting house
  var x = 0;
  var y = 0;
  // part 2 vars
  var santaX = 0;
  var santaY = 0;
  var roboX = 0;
  var roboY = 0;
  visitedHousesPart1.add(makeXYKey(x, y));
  visitedHousesPart2.add(makeXYKey(x, y));

  for (var i = 0; i < fileInput.length; i++) {
    var transform = { x: 0, y: 0 };
    switch (fileInput[i]) {
      case ">":
        transform.x = 1;
        break;
      case "v":
        transform.y = 1;
        break;
      case "<":
        transform.x = -1;
        break;
      case "^":
        transform.y = -1;
        break;
    }

    // update part 1 vars every time
    x += transform.x;
    y += transform.y;
    visitedHousesPart1.add(makeXYKey(x, y));

    // update part 2 vars based on idx
    if (i % 2 === 0) {
      santaX += transform.x;
      santaY += transform.y;
      visitedHousesPart2.add(makeXYKey(santaX, santaY));
    } else {
      roboX += transform.x;
      roboY += transform.y;
      visitedHousesPart2.add(makeXYKey(roboX, roboY));
    }
  }

  console.log(`Santa visited ${visitedHousesPart1.size} houses`);
  console.log(
    `Alternatively, if Santa was using Robo-Santa, they collectively visited ${visitedHousesPart2.size} houses`
  );
}
