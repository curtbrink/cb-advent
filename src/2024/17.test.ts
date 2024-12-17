import { Computer } from "./17";

test("test sample 1", () => {
  var testPc = new Computer(0, 0, 9);
  testPc.runProgram([2, 6]);
  expect(testPc.b).toBe(1);
});

test("test sample 2", () => {
  var testPc = new Computer(10, 0, 0);
  testPc.runProgram([5, 0, 5, 1, 5, 4]);
  expect(testPc.output.join(",")).toBe("0,1,2");
});

test("test sample 3", () => {
  var testPc = new Computer(2024, 0, 0);
  testPc.runProgram([0, 1, 5, 4, 3, 0]);
  expect(testPc.output.join(",")).toBe("4,2,5,6,7,7,7,7,3,1,0");
  expect(testPc.a).toBe(0);
});

test("test sample 4", () => {
  var testPc = new Computer(0, 29, 0);
  testPc.runProgram([1, 7]);
  expect(testPc.b).toBe(26);
});

test("test sample 5", () => {
  var testPc = new Computer(0, 2024, 43690);
  testPc.runProgram([4, 0]);
  expect(testPc.b).toBe(44354);
});
