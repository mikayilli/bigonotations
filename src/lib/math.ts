/** Pure math helpers shared by lessons, visualizations and tests. */

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** n! — returns Infinity once the result no longer fits in a double. */
export function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
    if (!Number.isFinite(result)) return Infinity;
  }
  return result;
}

export const pow2 = (n: number) => Math.pow(2, n);

/** Fibonacci number F(n) with F(0)=0, F(1)=1. */
export function fib(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

/** Number of calls made by the naive recursive fibonacci(n). Equals 2·F(n+1) − 1. */
export const fibCalls = (n: number) => 2 * fib(n + 1) - 1;

/** Sizes of a problem repeatedly halved (floor) until 1 remains: 16 → 8 → 4 → 2 → 1. */
export function halvingSequence(n: number): number[] {
  const seq = [n];
  let rest = n;
  while (rest > 1) {
    rest = Math.floor(rest / 2);
    seq.push(rest);
  }
  return seq;
}

/** Number of levels (divisions) merge sort needs to reach single elements. */
export const mergeLevels = (n: number) => (n <= 1 ? 0 : Math.ceil(Math.log2(n)));

/** Evenly spaced integer sample of [lo, hi], at most `max` values, always including both ends. */
export function sampleRange(lo: number, hi: number, max: number): number[] {
  const span = hi - lo + 1;
  if (span <= max) return Array.from({ length: span }, (_, i) => lo + i);
  const out: number[] = [];
  for (let i = 0; i < max; i++) out.push(Math.round(lo + (i * (hi - lo)) / (max - 1)));
  return out;
}
