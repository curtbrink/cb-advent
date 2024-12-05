export default function runSolution(fileInput: string): void {
  // initial approach:
  // - build a map of number -> numbers that must precede it
  // - iterate each test once:
  //       - start with empty rule list
  //       - validate number against all rules in rule list (first number obv is safe)
  //       - add that number's rule to the rule list.
  // - with this idea, if any number we check is in the "precede" list of any rule in the rule list,
  //   it is NOT in the correct order!

  // post mortem: wow that worked excellently!

  var { rules, tests } = parseInput(fileInput);

  // check each test
  var testResults: TestResult[] = tests.map((t) => testOrder(rules, t));

  // find the sum of the middle pages
  var correctResults = testResults.filter((r) => r.isCorrect);
  var incorrectResults = testResults.filter((r) => !r.isCorrect);

  var middlePageSum = getSumOfMiddlePages(
    testResults.filter((r) => r.isCorrect).map((r) => r.test)
  );

  console.log(
    `Part 1: The sum of the middle pages of the correctly ordered sets of pages is ${middlePageSum}`
  );

  // part two: reorder the incorrect ones, and do it again
  var sortedIncorrectResults = incorrectResults.map((result) => {
    var toSort = [...result.test];
    toSort.sort(getSortFunctionForRules(result.relevantRules));
    return toSort;
  });

  var sortedMiddlePageSum = getSumOfMiddlePages(sortedIncorrectResults);

  console.log(
    `Part 2: The sum of the middle pages of the newly-sorted sets of pages is ${sortedMiddlePageSum}`
  );
}

type TestResult = { test: number[]; isCorrect: boolean; relevantRules: Rule[] };

// a rule is a "check" number, and a list of "after" numbers that must come before it.

class Rule {
  check: number;
  after: number[] = [];

  constructor(check: number) {
    this.check = check;
  }

  addAfter(after: number): Rule {
    this.after.push(after);
    return this;
  }
}

class RuleSet {
  rules: Rule[] = [];

  addRule(check: number, after: number): void {
    var foundRule = this.rules.find((it) => it.check === check);
    if (!foundRule) {
      this.rules.push(new Rule(check).addAfter(after));
    } else {
      foundRule.addAfter(after);
    }
  }

  getRule(check: number): Rule {
    var foundRule = this.rules.find((it) => it.check === check);
    if (!foundRule) {
      throw new Error("rule not found");
    }
    return foundRule;
  }

  toString(): string {
    var result = "";
    for (var rule of this.rules) {
      result += `${rule.check} must come after ${rule.after}\n`;
    }
    return result;
  }
}

function testOrder(ruleSet: RuleSet, pages: number[]): TestResult {
  var relevantRules: Rule[] = [];
  var valid = true;
  for (var page of pages) {
    if (relevantRules.some((r) => r.after.includes(page))) {
      valid = false;
    }
    relevantRules.push(ruleSet.getRule(page));
  }
  return { test: pages, isCorrect: valid, relevantRules };
}

function getSumOfMiddlePages(pageSet: number[][]): number {
  return pageSet.reduce(
    (sum: number, pages: number[]) => sum + pages[Math.floor(pages.length / 2)],
    0
  );
}

function getSortFunctionForRules(
  rules: Rule[]
): (a: number, b: number) => number {
  return (a: number, b: number) => {
    // a comes before b if the rule for b contains a
    return rules.find((r) => r.check === b)?.after.includes(a) ? -1 : 1;
  };
}

function parseInput(fileInput: string): { rules: RuleSet; tests: number[][] } {
  var lines = fileInput
    .trim()
    .split("\n")
    .map((l) => l.trim());

  // first set of lines are rules, second set is tests
  var ruleSet = new RuleSet();
  var blankLineFound = false;
  var idx = 0;
  while (!blankLineFound) {
    if (lines[idx] === "") {
      blankLineFound = true;
      idx++;
      break;
    }

    // parse
    var components = lines[idx].split("|").map((n) => parseInt(n));
    ruleSet.addRule(components[1], components[0]);
    idx++;
  }

  var tests: number[][] = [];
  while (idx < lines.length) {
    var testComponents = lines[idx].split(",").map((n) => parseInt(n));
    tests.push(testComponents);
    idx++;
  }

  return { rules: ruleSet, tests };
}
