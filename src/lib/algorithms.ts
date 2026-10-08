/**
 * Instrumented algorithms. They count *comparisons* (the dominant operation) so the UI can
 * show how work grows. These are educational operation counts, not CPU benchmarks.
 */

// ---------------------------------------------------------------- searching

/** Indices linear search inspects, in order. `target` = -1 means "not in the array". */
export function linearSearchTrace(n: number, target: number): number[] {
  const last = target < 0 || target >= n ? n - 1 : target;
  return Array.from({ length: last + 1 }, (_, i) => i);
}

export interface BinaryStep {
  lo: number;
  hi: number;
  mid: number;
}

/** Every probe binary search makes over the sorted array [0..n-1]. `target` = -1 means "missing". */
export function binarySearchTrace(n: number, target: number): BinaryStep[] {
  const steps: BinaryStep[] = [];
  let lo = 0;
  let hi = n - 1;
  // A missing target is modelled as "larger than everything", the worst case.
  const goal = target < 0 ? n : target;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push({ lo, hi, mid });
    if (mid === goal) break;
    if (mid < goal) lo = mid + 1;
    else hi = mid - 1;
  }
  return steps;
}

// ------------------------------------------------------------------ sorting

export type SortName = "bubble" | "insertion" | "merge" | "quick";
export const SORT_NAMES: SortName[] = ["bubble", "insertion", "merge", "quick"];

export interface SortRun {
  /** Total comparisons performed. */
  ops: number;
  /** Sampled snapshots of the array while sorting. */
  frames: number[][];
  /** Comparison count at which each frame was taken (same length as frames). */
  frameOps: number[];
}

type Hook = (live: number[]) => void;

function sortInPlace(name: SortName, a: number[], hook: Hook): void {
  /** Counted "greater than" comparison. */
  const gt = (x: number, y: number) => {
    hook(a);
    return x > y;
  };
  const n = a.length;

  if (name === "bubble") {
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - i; j++) {
        if (gt(a[j]!, a[j + 1]!)) {
          [a[j], a[j + 1]] = [a[j + 1]!, a[j]!];
          swapped = true;
        }
      }
      if (!swapped) break;
    }
  } else if (name === "insertion") {
    for (let i = 1; i < n; i++) {
      const key = a[i]!;
      let j = i - 1;
      while (j >= 0 && gt(a[j]!, key)) {
        a[j + 1] = a[j]!;
        j--;
      }
      a[j + 1] = key;
    }
  } else if (name === "merge") {
    const mergeSort = (lo: number, hi: number) => {
      if (hi - lo < 1) return;
      const mid = Math.floor((lo + hi) / 2);
      mergeSort(lo, mid);
      mergeSort(mid + 1, hi);
      const left = a.slice(lo, mid + 1);
      const right = a.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;
      while (i < left.length && j < right.length) {
        a[k++] = gt(left[i]!, right[j]!) ? right[j++]! : left[i++]!;
      }
      while (i < left.length) a[k++] = left[i++]!;
      while (j < right.length) a[k++] = right[j++]!;
    };
    mergeSort(0, n - 1);
  } else {
    const quickSort = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const pivot = a[hi]!;
      let p = lo;
      for (let i = lo; i < hi; i++) {
        if (gt(pivot, a[i]!)) {
          [a[i], a[p]] = [a[p]!, a[i]!];
          p++;
        }
      }
      [a[p], a[hi]] = [a[hi]!, a[p]!];
      quickSort(lo, p - 1);
      quickSort(p + 1, hi);
    };
    quickSort(0, n - 1);
  }
}

/** Count comparisons only (no frames). */
export function countSort(name: SortName, data: number[]): number {
  let ops = 0;
  sortInPlace(name, [...data], () => {
    ops++;
  });
  return ops;
}

/** Run a sort and keep up to ~`maxFrames` evenly spaced snapshots for replay. */
export function recordSort(name: SortName, data: number[], maxFrames = 160): SortRun {
  const ops = countSort(name, data);
  const stride = Math.max(1, Math.ceil(ops / maxFrames));
  const frames: number[][] = [[...data]];
  const frameOps: number[] = [0];
  let seen = 0;
  const work = [...data];
  sortInPlace(name, work, (live) => {
    seen++;
    if (seen % stride === 0) {
      frames.push([...live]);
      frameOps.push(seen);
    }
  });
  frames.push([...work]);
  frameOps.push(ops);
  return { ops, frames, frameOps };
}

/** Deterministic shuffled 1..n so reloading or re-rendering keeps the same dataset. */
export function shuffledData(n: number, seed: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  let s = seed >>> 0 || 1;
  const rand = () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0xffffffff;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** Index of the last frame taken at or before `ops` comparisons. */
export function frameIndexAt(run: SortRun, ops: number): number {
  let lo = 0;
  let hi = run.frameOps.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (run.frameOps[mid]! <= ops) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
