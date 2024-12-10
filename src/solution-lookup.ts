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
import Solution201512 from "./2015/12";
import Solution201513 from "./2015/13";
import Solution201514 from "./2015/14";
import Solution201515 from "./2015/15";
import Solution201516 from "./2015/16";
import Solution201517 from "./2015/17";
import Solution201518 from "./2015/18";
import Solution201519 from "./2015/19";
import Solution201520 from "./2015/20";
import Solution201521 from "./2015/21";
import Solution201522 from "./2015/22";
import Solution201523 from "./2015/23";
import Solution201524 from "./2015/24";
import Solution202401 from "./2024/01";
import Solution202402 from "./2024/02";
import Solution202403 from "./2024/03";
import Solution202404 from "./2024/04";
import Solution202405 from "./2024/05";
import Solution202406 from "./2024/06";
import Solution202407 from "./2024/07";
import Solution202408 from "./2024/08";
import Solution202409 from "./2024/09";
import Solution202410 from "./2024/10";
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
    "12": Solution201512,
    "13": Solution201513,
    "14": Solution201514,
    "15": Solution201515,
    "16": Solution201516,
    "17": Solution201517,
    "18": Solution201518,
    "19": Solution201519,
    "20": Solution201520,
    "21": Solution201521,
    "22": Solution201522,
    "23": Solution201523,
    "24": Solution201524,
  },
  2024: {
    "01": Solution202401,
    "02": Solution202402,
    "03": Solution202403,
    "04": Solution202404,
    "05": Solution202405,
    "06": Solution202406,
    "07": Solution202407,
    "08": Solution202408,
    "09": Solution202409,
    "10": Solution202410,
  },
};

export function runSolution(
  year: number,
  problemId: string,
  fileInput: string
): void {
  solutionMap[year][problemId](fileInput);
}
