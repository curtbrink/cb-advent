export default function runSolution(fileInput: string): void {
    var reports = fileInput
      .split("\n")
      .filter((line) => line != "")
      .map((line) => new Report(line));
  
    var safeReports = reports.reduce((runningSum: number, currentReport: Report) => currentReport.isSafe() ? runningSum + 1 : runningSum, 0);
    var safeDampenedReports = reports.reduce((runningSum: number, currentReport: Report) => currentReport.isSafeWithDampener() ? runningSum + 1 : runningSum, 0);
  
    console.log(`Number of safe reports: ${safeReports}`);
    console.log(`Number of safe reports with dampener: ${safeDampenedReports}`);
  }
  
  class Report {
    levels: number[] = []
  
    constructor(input: string) {
      var levelStrings = input.split(" ");
      this.levels = levelStrings.map((lvl) => parseInt(lvl));
    }
  
    isSafe(): boolean {
      return this.levelsAreSafe(this.levels);
    }
  
    isSafeWithDampener(): boolean {
      if (this.levelsAreSafe(this.levels)) {
        return true;
      }
  
      // do dampeners
      for (var i = 0; i < this.levels.length; i++) {
        var levelCopy = [...this.levels];
        levelCopy.splice(i, 1);
        if (this.levelsAreSafe(levelCopy)) {
          return true;
        }
      }
  
      return false;
    }
  
    levelsAreSafe(levels: number[]): boolean {
      return this.isSafeIncreasing(levels) || this.isSafeDecreasing(levels);
    }
  
    private isSafeIncreasing(levels: number[]): boolean {
      var lastVal: number | undefined;
      for (var level of levels) {
        if (lastVal && (level - lastVal < 1 || level - lastVal > 3)) {
          return false;
        }
        lastVal = level;
      }
      return true;
    }
  
    private isSafeDecreasing(levels: number[]): boolean {
      var lastVal: number | undefined;
      for (var level of levels) {
        if (lastVal && (lastVal - level < 1 || lastVal - level > 3)) {
          return false;
        }
        lastVal = level;
      }
      return true;
    }
  }
  