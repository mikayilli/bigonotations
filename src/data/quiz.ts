import { bi, type Bi } from "../i18n/types";
import type { ComplexityType } from "./types";

/** Calls `hit(line)` once for each "main operation" the snippet performs; `line` is 1-based. */
export type Runner = (n: number, hit: (line: number) => void) => void;

export interface QuizQuestion {
  id: string;
  code: string;
  options: ComplexityType[];
  answer: ComplexityType;
  run: Runner;
  /** Largest n the replay animation offers (keeps the animation short). */
  demoMax: number;
  /** n values for the "measured operations" table. */
  tableNs: number[];
  /** Four-step reasoning chain: what runs → per step → total → Big-O. */
  chain: [Bi, Bi, Bi, Bi];
  note?: Bi;
}

const loopN: Runner = (n, hit) => {
  for (let i = 0; i < n; i++) hit(2);
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "single-loop",
    code: `for (let i = 0; i < n; i++) {
  console.log(i);
}`,
    options: ["constant", "logarithmic", "linear", "quadratic"],
    answer: "linear",
    run: loopN,
    demoMax: 16,
    tableNs: [4, 8, 16, 32],
    chain: [
      bi("The loop runs n times", "Dövr n dəfə işləyir"),
      bi("One main operation (console.log) per iteration", "Hər iterasiyada bir əsas əməliyyat (console.log)"),
      bi("≈ n operations in total", "cəmi ≈ n əməliyyat"),
      bi("O(n)", "O(n)"),
    ],
  },
  {
    id: "nested",
    code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i, j);
  }
}`,
    options: ["linear", "quadratic", "logarithmic", "exponential"],
    answer: "quadratic",
    run: (n, hit) => {
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) hit(3);
    },
    demoMax: 10,
    tableNs: [4, 8, 16, 32],
    chain: [
      bi("The outer loop runs n times; the inner loop runs n times for EACH outer pass", "Xarici dövr n dəfə, daxili dövr isə HƏR xarici keçid üçün n dəfə işləyir"),
      bi("One console.log per inner iteration", "Hər daxili iterasiyada bir console.log"),
      bi("n × n = n² operations", "n × n = n² əməliyyat"),
      bi("O(n²)", "O(n²)"),
    ],
  },
  {
    id: "doubling",
    code: `for (let i = n; i > 0; i = Math.floor(i / 2)) {
  console.log(i);
}`,
    options: ["linear", "constant", "quadratic", "logarithmic"],
    answer: "logarithmic",
    run: (n, hit) => {
      for (let i = n; i > 0; i = Math.floor(i / 2)) hit(2);
    },
    demoMax: 64,
    tableNs: [4, 16, 256, 65536],
    chain: [
      bi("i is halved every iteration: n → n/2 → n/4 → … → 1", "i hər iterasiyada yarıya bölünür: n → n/2 → n/4 → … → 1"),
      bi("One console.log per iteration", "Hər iterasiyada bir console.log"),
      bi("Number of halvings until 0 ≈ log₂ n (+1)", "0-a qədər bölmələrin sayı ≈ log₂ n (+1)"),
      bi("O(log n)", "O(log n)"),
    ],
    note: bi(
      "Note the floor: with plain i /= 2 a JavaScript number would keep shrinking as a fraction and never reach 0.",
      "Qeyd: floor-a diqqət edin: sadə i /= 2 ilə JavaScript ədədi kəsr kimi kiçilməyə davam edər və heç vaxt 0-a çatmaz.",
    ),
  },
  {
    id: "n-log-n",
    code: `for (let i = 0; i < n; i++) {
  let j = 1;

  while (j < n) {
    j *= 2;
  }
}`,
    options: ["quadratic", "linearithmic", "linear", "logarithmic"],
    answer: "linearithmic",
    run: (n, hit) => {
      for (let i = 0; i < n; i++) {
        let j = 1;
        while (j < n) {
          hit(5);
          j *= 2;
        }
      }
    },
    demoMax: 8,
    tableNs: [4, 8, 16, 32],
    chain: [
      bi("The outer loop runs n times. For each pass the inner loop doubles j until it reaches n — about log₂ n times", "Xarici dövr n dəfə işləyir. Hər keçiddə daxili dövr j-ni n-ə çatana qədər ikiqat artırır — təxminən log₂ n dəfə"),
      bi("One doubling per inner iteration", "Hər daxili iterasiyada bir ikiqatlama"),
      bi("n passes × log₂ n doublings = n log n", "n keçid × log₂ n ikiqatlama = n log n"),
      bi("O(n log n)", "O(n log n)"),
    ],
  },
  {
    id: "triangle",
    code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {
    console.log(i, j);
  }
}`,
    options: ["linear", "linearithmic", "quadratic", "exponential"],
    answer: "quadratic",
    run: (n, hit) => {
      for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) hit(3);
    },
    demoMax: 10,
    tableNs: [4, 8, 16, 32],
    chain: [
      bi("The inner loop runs i times, and i grows 0, 1, 2, … n−1", "Daxili dövr i dəfə işləyir və i 0, 1, 2, … n−1 olaraq artır"),
      bi("One console.log per inner iteration", "Hər daxili iterasiyada bir console.log"),
      bi("0 + 1 + 2 + … + (n−1) = n(n−1)/2 operations", "0 + 1 + 2 + … + (n−1) = n(n−1)/2 əməliyyat"),
      bi("O(n²)", "O(n²)"),
    ],
    note: bi(
      "n(n−1)/2 = n²/2 − n/2. Big-O drops the constant ½ and the lower-order term n/2, leaving n². It is only about half of the full n × n grid — but still a square-shaped growth.",
      "n(n−1)/2 = n²/2 − n/2. Big-O sabit ½-ni və aşağı tərtibli n/2 həddini atır, n² qalır. Bu, tam n × n şəbəkənin təxminən yarısıdır — amma yenə də kvadrat tipli artımdır.",
    ),
  },
  {
    id: "sequential",
    code: `for (let i = 0; i < n; i++) {
  console.log(i);
}
for (let j = 0; j < n; j++) {
  console.log(j);
}`,
    options: ["quadratic", "linear", "constant", "linearithmic"],
    answer: "linear",
    run: (n, hit) => {
      for (let i = 0; i < n; i++) hit(2);
      for (let j = 0; j < n; j++) hit(5);
    },
    demoMax: 12,
    tableNs: [4, 8, 16, 32],
    chain: [
      bi("Two loops, one AFTER the other (not nested) — each runs n times", "İki dövr, biri digərindən SONRA (iç-içə deyil) — hər biri n dəfə işləyir"),
      bi("One console.log per iteration", "Hər iterasiyada bir console.log"),
      bi("n + n = 2n operations", "n + n = 2n əməliyyat"),
      bi("O(n)", "O(n)"),
    ],
    note: bi(
      "Sequential loops ADD; nested loops MULTIPLY. 2n still doubles when n doubles, so the constant 2 is dropped.",
      "Ardıcıl dövrlər TOPLANIR; iç-içə dövrlər VURULUR. 2n n ikiqat artanda yenə ikiqat artır, ona görə 2 sabiti atılır.",
    ),
  },
  {
    id: "first-last",
    code: `function firstAndLast(arr) {
  const first = arr[0];
  const last = arr[arr.length - 1];
  return first + last;
}`,
    options: ["constant", "linear", "logarithmic", "quadratic"],
    answer: "constant",
    run: (_n, hit) => {
      hit(2);
      hit(3);
    },
    demoMax: 16,
    tableNs: [4, 8, 16, 32],
    chain: [
      bi("Two array reads — no loop at all", "İki massiv oxuması — ümumiyyətlə dövr yoxdur"),
      bi("Each read is one operation", "Hər oxuma bir əməliyyatdır"),
      bi("2 operations, whatever n is", "n nə olursa olsun, 2 əməliyyat"),
      bi("O(1)", "O(1)"),
    ],
  },
  {
    id: "fibonacci",
    code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
    options: ["linear", "quadratic", "exponential", "logarithmic"],
    answer: "exponential",
    run: (n, hit) => {
      const fib = (k: number): number => {
        hit(1);
        return k <= 1 ? k : fib(k - 1) + fib(k - 2);
      };
      fib(n);
    },
    demoMax: 9,
    tableNs: [5, 10, 15, 20],
    chain: [
      bi("Each call makes two more calls (n−1 and n−2)", "Hər çağırış 2 yeni çağırış edir (n−1 və n−2)"),
      bi("Count one operation per call", "Hər çağırış üçün bir əməliyyat say"),
      bi("The call tree doubles in width each level → about 2ⁿ calls", "Çağırış ağacının eni hər səviyyədə ikiqat artır → təxminən 2ⁿ çağırış"),
      bi("O(2ⁿ)", "O(2ⁿ)"),
    ],
  },
];
