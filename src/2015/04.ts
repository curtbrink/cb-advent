import { Md5 } from "ts-md5";


export default function runSolution(fileInput: string): void {
    var md5Key = fileInput;
    var seed = 0;

    var hash = "999999";
    while (hash.substring(0, 5) != "00000") {
        seed++;
        hash = Md5.hashStr(`${md5Key}${seed}`);
    }
    console.log("The lowest number that produces an MD5 with 5 leading zeroes is " + seed);

    seed = 0;
    hash = "999999";
    while (hash.substring(0, 6) != "000000") {
        seed++;
        hash = Md5.hashStr(`${md5Key}${seed}`);
    }
    console.log("The lowest number that produces an MD5 with 6 leading zeroes is " + seed);
}
  