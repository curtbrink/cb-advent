import Solution201501 from "./2015/01";
import Solution201502 from "./2015/02";
import Solution201503 from "./2015/03";
import Solution201504 from "./2015/04";
import Solution201505 from "./2015/05";
import Solution202401 from "./2024/01";
import Solution202402 from "./2024/02";
import { Solution } from "./types";

const solutionMap: Record<number, Record<string, Solution>> = {
  2015: {
    "01": Solution201501,
    "02": Solution201502,
    "03": Solution201503,
    "04": Solution201504,
    "05": Solution201505,
  },
  2024: {
    "01": Solution202401,
    "02": Solution202402,
  },
};

export function runSolution(
  year: number,
  problemId: string,
  fileInput: string
): void {
  solutionMap[year][problemId](fileInput);
}
