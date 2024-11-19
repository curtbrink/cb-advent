import Solution201501 from "./2015/01";
import Solution201502 from "./2015/02";
import Solution201503 from "./2015/03";
import { Solution } from "./types";

const solutionMap: Record<number, Record<string, Solution>> = {
  2015: {
    "01": Solution201501,
    "02": Solution201502,
    "03": Solution201503,
  },
};

export function runSolution(
  year: number,
  problemId: string,
  fileInput: string
): void {
  solutionMap[year][problemId](fileInput);
}
