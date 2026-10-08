import { describe, expect, it } from "vitest";
import {
  binarySearchTrace,
  countSort,
  linearSearchTrace,
  recordSort,
  shuffledData,
  SORT_NAMES,
} from "./algorithms";
import { factorial, fibCalls, halvingSequence, mergeLevels, sampleRange } from "./math";
import { formatCount } from "./format";

describe("math", () => {
  it("halves 16 down to 1", () => {
    expect(halvingSequence(16)).toEqual([16, 8, 4, 2, 1]);
  });
  it("counts naive fibonacci calls exactly", () => {
    expect(fibCalls(1)).toBe(1);
    expect(fibCalls(2)).toBe(3);
    expect(fibCalls(5)).toBe(15);
    expect(fibCalls(10)).toBe(177);
  });
  it("computes factorials and overflows to Infinity", () => {
    expect(factorial(5)).toBe(120);
    expect(factorial(10)).toBe(3628800);
    expect(factorial(500)).toBe(Infinity);
  });
  it("merge levels", () => {
    expect(mergeLevels(8)).toBe(3);
    expect(mergeLevels(9)).toBe(4);
  });
  it("samples ranges including both ends", () => {
    const s = sampleRange(1, 1000, 10);
    expect(s).toHaveLength(10);
    expect(s[0]).toBe(1);
    expect(s[9]).toBe(1000);
  });
});

describe("format", () => {
  it("uses scientific notation for huge values", () => {
    expect(formatCount(1.24e15)).toBe("1.24e+15");
    expect(formatCount(Infinity)).toBe("∞");
    expect(formatCount(1024)).toBe("1,024");
  });
});

describe("searching", () => {
  it("linear search inspects every element up to the target", () => {
    expect(linearSearchTrace(8, 4)).toEqual([0, 1, 2, 3, 4]);
    expect(linearSearchTrace(8, -1)).toHaveLength(8);
  });
  it("binary search takes floor(log2 n)+1 probes in the worst case", () => {
    expect(binarySearchTrace(16, 15)).toHaveLength(5);
    expect(binarySearchTrace(1024, -1)).toHaveLength(11);
    expect(binarySearchTrace(1000, 0).length).toBeLessThanOrEqual(10);
  });
});

describe("sorting", () => {
  const data = shuffledData(64, 7);
  it.each(SORT_NAMES)("%s sort actually sorts", (name) => {
    const run = recordSort(name, data);
    const last = run.frames[run.frames.length - 1]!;
    expect(last).toEqual([...data].sort((a, b) => a - b));
    expect(run.ops).toBe(countSort(name, data));
    expect(run.frames.length).toBe(run.frameOps.length);
  });
  it("quadratic sorts grow ~4x when n doubles, merge sort ~2x", () => {
    const ratio = (name: (typeof SORT_NAMES)[number]) =>
      countSort(name, shuffledData(400, 3)) / countSort(name, shuffledData(200, 3));
    expect(ratio("bubble")).toBeGreaterThan(3.5);
    expect(ratio("insertion")).toBeGreaterThan(3.5);
    expect(ratio("merge")).toBeLessThan(2.4);
  });
});

import { PROGRAMS } from "../data/basics";

describe("basics programs", () => {
  it.each(PROGRAMS.map((p) => [p.id, p] as const))("%s: trace matches the written formulas", (_id, program) => {
    for (let n = program.range.min; n <= program.range.max; n++) {
      const events = program.trace(n);
      expect(events.length).toBe(program.timeTotal(n));
      program.lines.forEach((info, i) => {
        expect(events.filter((e) => e.line === i + 1).length).toBe(info.runsFor(n));
      });
    }
  });
});
