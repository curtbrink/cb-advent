import Solution201501 from "./2015/01";
import Solution201502 from "./2015/02";
import Solution201503 from "./2015/03";
import Solution201504 from "./2015/04";
import Solution201505 from "./2015/05";
import Solution201506a from "./2015/06";
import Solution201506b from "./2015/06-2";
import Solution201507 from "./2015/07";
import Solution201508 from "./2015/08";
import Solution201509 from "./2015/09";
import Solution201510 from "./2015/10";
import Solution201511 from "./2015/11";
import Solution202401 from "./2024/01";
import Solution202402 from "./2024/02";
import Solution202403 from "./2024/03";
import { Solution } from "./types";

const solutionMap: Record<number, Record<string, Solution>> = {
  2015: {
    "01": Solution201501,
    "02": Solution201502,
    "03": Solution201503,
    "04": Solution201504,
    "05": Solution201505,
    "06": Solution201506a,
    "06-2": Solution201506b,
    "07": Solution201507,
    "08": Solution201508,
    "09": Solution201509,
    "10": Solution201510,
    "11": Solution201511,
  },
  2024: {
    "01": Solution202401,
    "02": Solution202402,
    "03": Solution202403,
  },
};

export function runSolution(
  year: number,
  problemId: string,
  fileInput: string
): void {
  solutionMap[year][problemId](fileInput);
}
