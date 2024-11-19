import Solution01 from "./2015/01";
import { Solution } from "./types";

const solutionMap: Record<number, Record<string, Solution>> = {
  2015: {
    "01": Solution01,
  },
};

export function runSolution(
  year: number,
  problemId: string,
  fileInput: string
): void {
  solutionMap[year][problemId](fileInput);
}
