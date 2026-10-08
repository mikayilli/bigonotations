import type { Bi } from "../i18n/types";

export type ComplexityType =
  | "constant"
  | "logarithmic"
  | "linear"
  | "linearithmic"
  | "quadratic"
  | "exponential"
  | "factorial";

export type VizType =
  | "array-access"
  | "array-scan"
  | "binary-search"
  | "grid"
  | "merge-levels"
  | "recursion-tree"
  | "permutations"
  | "memory-constant"
  | "memory-array"
  | "call-stack"
  | "memory-grid";

export type Metric = "time" | "space";

export interface SeriesDef {
  id: string;
  label: Bi;
  fn: (n: number) => number;
  dashed?: boolean;
  /** The curve the current-n marker sits on. Exactly one series per lesson has this. */
  marker?: boolean;
}

/** The five-step reasoning chain every lesson explains. */
export interface WhyStages {
  what: Bi;
  times: Bi;
  why: Bi;
  math: Bi;
  graph: Bi;
}

export interface Lesson {
  id: string;
  type: ComplexityType;
  metric: Metric;
  notation: string;
  name: Bi;
  tagline: Bi;
  /** Where this shows up in real code. */
  inPractice: Bi;
  range: { min: number; max: number; initial: number; scale: "linear" | "log" };
  /** Exact number of operations (or memory units) the example performs for input size n. */
  count: (n: number) => number;
  graph: SeriesDef[];
  /** Short shape of the graph, used in the CODE → OPERATIONS → FORMULA → GRAPH strip. */
  shape: Bi;
  formula: {
    symbolic: Bi[];
    /** Lines with the current n substituted. */
    numeric: (n: number, f: (x: number) => string) => string[];
    /** One-line version for the flow strip. */
    short: (n: number, f: (x: number) => string) => string;
  };
  code: { text: string; algorithm: Bi };
  viz: VizType;
  /** How many replay steps a full run has. */
  steps: (n: number) => number;
  /** 1-based code lines to highlight while running. */
  activeLines?: (step: number, n: number) => number[];
  /** Values for `{placeholders}` in the explanation texts. */
  vars: (n: number, f: (x: number) => string) => Record<string, string | number>;
  why: WhyStages;
  graphWhy: {
    lead: Bi;
    points: Bi[];
    deltaCaption: Bi;
    sizes: number[];
  };
  aha: {
    input: Bi;
    work: Bi;
    growth: Bi;
    complexity: string;
    graph: Bi;
  };
}
