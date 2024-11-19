import { readFileSync } from "fs";
import { runSolution } from "./solution-lookup";

console.log(`
             888                        888    .d88888b.  .d888 .d8888b.              888         
             888                        888   d88P" "Y88bd88P" d88P  Y88b             888         
             888                        888   888     888888   888    888             888         
 8888b.  .d88888888  888 .d88b. 88888b. 888888888     888888888888        .d88b.  .d88888 .d88b.  
    "88bd88" 888888  888d8P  Y8b888 "88b888   888     888888   888       d88""88bd88" 888d8P  Y8b 
.d888888888  888Y88  88P88888888888  888888   888     888888   888    888888  888888  88888888888 
888  888Y88b 888 Y8bd8P Y8b.    888  888Y88b. Y88b. .d88P888   Y88b  d88PY88..88PY88b 888Y8b.     
"Y888888 "Y88888  Y88P   "Y8888 888  888 "Y888 "Y88888P" 888    "Y8888P"  "Y88P"  "Y88888 "Y8888  
`);

// verify we have flags so we know where we're going
var flags = process.argv.slice(2);
if (flags.length < 2) {
  console.error(
    "Invalid flags. Please provide an AOC year and problem ID. ex: 2019 13 or 2021 15-2"
  );
  process.exit(1);
}

var year = parseInt(flags[0]);
if (year < 2015 || year > 2024) {
  console.error(`Invalid year "${year}" - use a year 2015 thru 2024.`);
  process.exit(1);
}

var problemId = flags[1];

// parse input data as lines
var inputFilePath = `data/${year}/${problemId}.txt`;
var fileText = readFileSync(inputFilePath, "utf-8");

console.log(`Successfully loaded input data.`);
console.log(`Executing solution for problem ${year}-${problemId}...`);
console.log("======================================================\n");
runSolution(year, problemId, fileText);
console.log("\n======================================================");
console.log(`Finished execution. Good luck!`);
