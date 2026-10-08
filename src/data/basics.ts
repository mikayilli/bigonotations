import { bi, type Bi } from "../i18n/types";

/** One thing the "computer" does: runs one line once. Costs exactly 1 step. */
export interface TraceEvent {
  line: number;
  note: Bi;
  /** Single boxes on the desk (variables) after this event. */
  vars: { name: string; value: string }[];
  /** A growing row of boxes (an array we build ourselves), if any. */
  built?: { name: string; items: string[] };
}

export interface LineInfo {
  /** The line costs steps only when it does work; a lone `}` costs nothing. */
  worker: boolean;
  /** How many times this line runs, as a formula in n and as a number. */
  runs: string;
  runsFor: (n: number) => number;
}

export interface Program {
  id: string;
  name: Bi;
  code: string;
  /** The program receives a list `arr` of n items from outside; it is not our memory. */
  givenInput: boolean;
  range: { min: number; max: number; initial: number };
  lines: LineInfo[];
  trace: (n: number) => TraceEvent[];
  timeFormula: string;
  timeTotal: (n: number) => number;
  timeBigO: string;
  memoryFormula: string;
  memoryBigO: string;
  /** Plain-words verdicts. */
  timeWhy: Bi;
  memoryWhy: Bi;
}

const line = (runs: string, runsFor: (n: number) => number): LineInfo => ({ worker: true, runs, runsFor });
const bracket: LineInfo = { worker: false, runs: "0", runsFor: () => 0 };

/* -------------------------------------------------------------- A: sum */

const sum: Program = {
  id: "sum",
  name: bi("Add up all numbers", "Bütün ədədləri topla"),
  code: `let total = 0;
for (let i = 0; i < n; i++) {
  total = total + arr[i];
}
return total;`,
  givenInput: true,
  range: { min: 1, max: 8, initial: 4 },
  lines: [line("1", () => 1), line("n + 1", (n) => n + 1), line("n", (n) => n), bracket, line("1", () => 1)],
  timeFormula: "1 + (n + 1) + n + 1 = 2n + 3",
  timeTotal: (n) => 2 * n + 3,
  timeBigO: "O(n)",
  memoryFormula: "total, i = 2 boxes",
  memoryBigO: "O(1)",
  timeWhy: bi(
    "The steps grow together with n: 2n + 3. The “+ 3” and the “2” are small stuff. What matters: twice as many numbers → about twice as many steps. That is O(n).",
    "Addımlar n ilə birlikdə böyüyür: 2n + 3. “+ 3” və “2” xırda şeylərdir. Əsas olan: ədədlər 2 dəfə çoxdursa, addımlar da təxminən 2 dəfə çoxdur. Bu O(n)-dir.",
  ),
  memoryWhy: bi(
    "We only ever used 2 boxes (total and i), whether the list has 4 numbers or 4 million. The list itself was GIVEN to us, so it is not our memory. That is O(1).",
    "Siyahıda 4 ədəd də olsa, 4 milyon da — biz həmişə cəmi 2 qutu (total və i) işlətdik. Siyahının özü bizə VERİLİB, ona görə bizim yaddaşımız sayılmır. Bu O(1)-dir.",
  ),
  trace: (n) => {
    const ev: TraceEvent[] = [];
    let total = 0;
    ev.push({
      line: 1,
      vars: [{ name: "total", value: "0" }],
      note: bi("Take a new box, write “total” on it and put 0 inside. 1 step, 1 new box.", "Yeni qutu götür, üstünə “total” yaz, içinə 0 qoy. 1 addım, 1 yeni qutu."),
    });
    ev.push({
      line: 2,
      vars: [{ name: "total", value: "0" }, { name: "i", value: "0" }],
      note: bi("New box “i” = 0 (our finger on the list). Is i < n? Yes → go inside. 1 step, 1 new box.", "Yeni “i” qutusu = 0 (barmağımız siyahıda). i < n? Hə → içəri gir. 1 addım, 1 yeni qutu."),
    });
    for (let k = 0; k < n; k++) {
      total += k + 1;
      ev.push({
        line: 3,
        vars: [{ name: "total", value: String(total) }, { name: "i", value: String(k) }],
        note: bi(`Add item number ${k} (it is ${k + 1}) into total. Now total = ${total}. 1 step, no new box.`, `${k}-cı elementi (${k + 1}) total-a əlavə et. İndi total = ${total}. 1 addım, yeni qutu yoxdur.`),
      });
      ev.push({
        line: 2,
        vars: [{ name: "total", value: String(total) }, { name: "i", value: String(k + 1) }],
        note:
          k + 1 < n
            ? bi(`Move the finger: i = ${k + 1}. Is ${k + 1} < ${n}? Yes → again. 1 step.`, `Barmağı sürüşdür: i = ${k + 1}. ${k + 1} < ${n}? Hə → yenə. 1 addım.`)
            : bi(`Move the finger: i = ${k + 1}. Is ${k + 1} < ${n}? No → leave the loop. 1 step.`, `Barmağı sürüşdür: i = ${k + 1}. ${k + 1} < ${n}? Xeyr → dövrdən çıx. 1 addım.`),
      });
    }
    ev.push({
      line: 5,
      vars: [{ name: "total", value: String(total) }, { name: "i", value: String(n) }],
      note: bi(`Give the answer back: ${total}. 1 step.`, `Cavabı qaytar: ${total}. 1 addım.`),
    });
    return ev;
  },
};

/* ------------------------------------------------------------- B: copy */

const copy: Program = {
  id: "copy",
  name: bi("Make a copy of the list", "Siyahının surətini çıxar"),
  code: `const copy = [];
for (const x of arr) {
  copy.push(x);
}
return copy;`,
  givenInput: true,
  range: { min: 1, max: 8, initial: 4 },
  lines: [line("1", () => 1), line("n + 1", (n) => n + 1), line("n", (n) => n), bracket, line("1", () => 1)],
  timeFormula: "1 + (n + 1) + n + 1 = 2n + 3",
  timeTotal: (n) => 2 * n + 3,
  timeBigO: "O(n)",
  memoryFormula: "n boxes in copy + 1 box x",
  memoryBigO: "O(n)",
  timeWhy: bi(
    "Again about 2n + 3 steps. Twice as many items → about twice as many steps: O(n).",
    "Yenə təxminən 2n + 3 addım. Elementlər 2 dəfə çoxdursa, addımlar da təxminən 2 dəfə çoxdur: O(n).",
  ),
  memoryWhy: bi(
    "Every item we copy needs its OWN new box. 4 items → 4 boxes, 40 items → 40 boxes. The desk grows together with n, so memory is O(n).",
    "Köçürdüyümüz HƏR element üçün ÖZ yeni qutusu lazımdır. 4 element → 4 qutu, 40 element → 40 qutu. Masa n ilə birlikdə böyüyür, ona görə yaddaş O(n)-dir.",
  ),
  trace: (n) => {
    const ev: TraceEvent[] = [];
    const items: string[] = [];
    ev.push({
      line: 1,
      vars: [],
      built: { name: "copy", items: [] },
      note: bi("Make an empty shelf called “copy”. 1 step. It has 0 boxes for now.", "“copy” adlı boş rəf düzəlt. 1 addım. Hələlik içində 0 qutu var."),
    });
    for (let k = 0; k < n; k++) {
      ev.push({
        line: 2,
        vars: [{ name: "x", value: String(k + 1) }],
        built: { name: "copy", items: [...items] },
        note: bi(`Take the next item from the list into box “x” = ${k + 1}. 1 step.`, `Siyahıdakı növbəti elementi “x” = ${k + 1} qutusuna götür. 1 addım.`),
      });
      items.push(String(k + 1));
      ev.push({
        line: 3,
        vars: [{ name: "x", value: String(k + 1) }],
        built: { name: "copy", items: [...items] },
        note: bi(`Put a copy of x on the shelf: a NEW box appears. The shelf now has ${items.length}. 1 step.`, `x-in surətini rəfə qoy: YENİ qutu yaranır. Rəfdə indi ${items.length} qutu var. 1 addım.`),
      });
    }
    ev.push({
      line: 2,
      vars: [{ name: "x", value: String(n) }],
      built: { name: "copy", items: [...items] },
      note: bi("Nothing left in the list → leave the loop. 1 step.", "Siyahıda heç nə qalmayıb → dövrdən çıx. 1 addım."),
    });
    ev.push({
      line: 5,
      vars: [{ name: "x", value: String(n) }],
      built: { name: "copy", items: [...items] },
      note: bi("Hand the shelf back. 1 step.", "Rəfi qaytar. 1 addım."),
    });
    return ev;
  },
};

/* ------------------------------------------------------------ C: pairs */

const pairs: Program = {
  id: "pairs",
  name: bi("Count every pair", "Hər cütü say"),
  code: `let count = 0;
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    count = count + 1;
  }
}`,
  givenInput: false,
  range: { min: 1, max: 5, initial: 3 },
  lines: [line("1", () => 1), line("n + 1", (n) => n + 1), line("n × (n + 1)", (n) => n * (n + 1)), line("n × n", (n) => n * n), bracket, bracket],
  timeFormula: "1 + (n + 1) + n(n + 1) + n × n = 2n² + 2n + 2",
  timeTotal: (n) => 2 * n * n + 2 * n + 2,
  timeBigO: "O(n²)",
  memoryFormula: "count, i, j = 3 boxes",
  memoryBigO: "O(1)",
  timeWhy: bi(
    "The inner line runs n × n times. 2n² + 2n + 2: when n is big, n² is a giant and the rest are ants. Twice as big n → about FOUR times the steps: O(n²).",
    "Daxili sətir n × n dəfə işləyir. 2n² + 2n + 2: n böyük olanda n² nəhəngdir, qalanları isə qarışqadır. n 2 dəfə böyüyəndə addımlar təxminən DÖRD dəfə artır: O(n²).",
  ),
  memoryWhy: bi(
    "Only 3 boxes (count, i, j), however big n is. We made loops, not new boxes. So memory is O(1) even though time is O(n²). Time and memory are two different questions!",
    "n nə qədər böyük olsa da, cəmi 3 qutu (count, i, j). Biz dövr düzəltdik, yeni qutu yox. Ona görə zaman O(n²) olsa da yaddaş O(1)-dir. Zaman və yaddaş iki fərqli sualdır!",
  ),
  trace: (n) => {
    const ev: TraceEvent[] = [];
    let count = 0;
    const v = (i?: number, j?: number) => [
      { name: "count", value: String(count) },
      ...(i !== undefined ? [{ name: "i", value: String(i) }] : []),
      ...(j !== undefined ? [{ name: "j", value: String(j) }] : []),
    ];
    ev.push({ line: 1, vars: v(), note: bi("New box “count” = 0. 1 step, 1 new box.", "Yeni “count” qutusu = 0. 1 addım, 1 yeni qutu.") });
    ev.push({ line: 2, vars: v(0), note: bi("New box “i” = 0. Is i < n? Yes → go inside. 1 step.", "Yeni “i” qutusu = 0. i < n? Hə → içəri gir. 1 addım.") });
    for (let i = 0; i < n; i++) {
      ev.push({
        line: 3,
        vars: v(i, 0),
        note: bi(`Start the inner loop again from the beginning: j = 0. (New box “j” the first time only.) 1 step.`, `Daxili dövrü yenidən əvvəldən başla: j = 0. (“j” qutusu yalnız ilk dəfə yaranır.) 1 addım.`),
      });
      for (let j = 0; j < n; j++) {
        count++;
        ev.push({ line: 4, vars: v(i, j), note: bi(`Pair (${i}, ${j}): count = ${count}. 1 step.`, `(${i}, ${j}) cütü: count = ${count}. 1 addım.`) });
        ev.push({
          line: 3,
          vars: v(i, j + 1),
          note:
            j + 1 < n
              ? bi(`j = ${j + 1}. Still < ${n}? Yes → again. 1 step.`, `j = ${j + 1}. Hələ < ${n}? Hə → yenə. 1 addım.`)
              : bi(`j = ${j + 1}. Still < ${n}? No → inner loop is finished. 1 step.`, `j = ${j + 1}. Hələ < ${n}? Xeyr → daxili dövr bitdi. 1 addım.`),
        });
      }
      ev.push({
        line: 2,
        vars: v(i + 1, n),
        note:
          i + 1 < n
            ? bi(`i = ${i + 1}. Still < ${n}? Yes → do the WHOLE inner loop again. 1 step.`, `i = ${i + 1}. Hələ < ${n}? Hə → BÜTÜN daxili dövrü yenə et. 1 addım.`)
            : bi(`i = ${i + 1}. Still < ${n}? No → everything is finished. 1 step.`, `i = ${i + 1}. Hələ < ${n}? Xeyr → hər şey bitdi. 1 addım.`),
      });
    }
    return ev;
  },
};

export const PROGRAMS: Program[] = [sum, copy, pairs];
