export default function runSolution(fileInput: string): void {
  var presents = fileInput.trim().split("\n");
  var presentRequirements = presents.map((p) => {
    var dims = p.split("x").map((d) => parseInt(d));
    return getRequirements(dims[0], dims[1], dims[2]);
  });
  var totals = presentRequirements.reduce(
    (sums, currentPresent) => {
      sums.paper += currentPresent.paper;
      sums.ribbon += currentPresent.ribbon;
      return sums;
    },
    { paper: 0, ribbon: 0 }
  );
  console.log(`Total paper requirement is ${totals.paper}`);
  console.log(`Total ribbon requirement is ${totals.ribbon}`);
}

function getRequirements(
  x: number,
  y: number,
  z: number
): { paper: number; ribbon: number } {
  // paper reqs
  var lwa = x * y;
  var wha = y * z;
  var lha = z * x;
  var extra = Math.min(lwa, wha, lha);

  // ribbon reqs
  var lwp = 2 * x + 2 * y;
  var whp = 2 * y + 2 * z;
  var lhp = 2 * z + 2 * x;
  var ribbonWrap = Math.min(lwp, whp, lhp);
  var ribbonBow = x * y * z;

  return {
    paper: 2 * lwa + 2 * wha + 2 * lha + extra,
    ribbon: ribbonWrap + ribbonBow,
  };
}
