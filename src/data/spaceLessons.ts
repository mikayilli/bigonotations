import { bi } from "../i18n/types";
import { COMPLEXITY } from "./complexities";
import type { ComplexityType, Lesson, SeriesDef } from "./types";

const single = (type: ComplexityType, notation: string): SeriesDef[] => [
  { id: type, label: bi(notation, notation), fn: COMPLEXITY[type].growth, marker: true },
];

const spaceConstant: Lesson = {
  id: "constant",
  type: "constant",
  metric: "space",
  notation: "O(1)",
  name: bi("Constant Space", "Sabit yaddaş"),
  tagline: bi(
    "A few variables are enough, however large the input is.",
    "Giriş nə qədər böyük olsa da, bir neçə dəyişən kifayətdir.",
  ),
  inPractice: bi(
    "Summing, counting, finding a maximum, swapping two values in place.",
    "Cəmləmək, saymaq, maksimumu tapmaq, iki dəyəri yerində dəyişmək.",
  ),
  range: { min: 1, max: 1000, initial: 10, scale: "log" },
  count: () => 1,
  graph: single("constant", "O(1)"),
  shape: bi("flat line", "düz üfüqi xətt"),
  formula: {
    symbolic: [bi("memory = 1 variable", "yaddaş = 1 dəyişən"), bi("(no n in the formula)", "(düsturda n yoxdur)")],
    numeric: (n) => [`n = ${n}`, "memory = 1"],
    short: () => "1",
  },
  code: {
    algorithm: bi("Sum with one running total", "Bir cari cəmlə toplama"),
    text: `function sum(arr) {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}`,
  },
  viz: "memory-constant",
  steps: (n) => n,
  activeLines: (step) => (step > 0 ? [2, 3] : []),
  vars: (n, f) => ({ n: f(n), count: 1 }),
  why: {
    what: bi(
      "sum walks through the input and keeps one running number, total. The input array already exists — it is not extra memory that this function creates.",
      "sum girişi gəzir və bir cari ədəd — total saxlayır. Giriş massivi artıq mövcuddur — bu funksiyanın yaratdığı əlavə yaddaş deyil.",
    ),
    times: bi(
      "Memory we create: 1 variable (total) — whether the array has {n} items or a million.",
      "Yaratdığımız yaddaş: 1 dəyişən (total) — massivdə {n} element olsun, ya milyon.",
    ),
    why: bi(
      "total is overwritten on every step instead of a new variable being created. Memory use does not depend on how many items we process.",
      "Yeni dəyişən yaratmaq əvəzinə total hər addımda yenidən yazılır. Yaddaş istifadəsi emal etdiyimiz elementlərin sayından asılı deyil.",
    ),
    math: bi("memory = 1 variable. No n in the formula → constant.", "yaddaş = 1 dəyişən. Düsturda n yoxdur → sabit."),
    graph: bi(
      "Memory that does not change when n grows is a flat line.",
      "n artanda dəyişməyən yaddaş düz xətt verir.",
    ),
  },
  graphWhy: {
    lead: bi("The extra memory is always one variable:", "Əlavə yaddaş həmişə bir dəyişəndir:"),
    points: [
      bi("n = 10 → 1 variable", "n = 10 → 1 dəyişən"),
      bi("n = 1,000 → 1 variable", "n = 1 000 → 1 dəyişən"),
    ],
    deltaCaption: bi(
      "Every bar is zero: more input needs no more memory.",
      "Bütün sütunlar sıfırdır: daha çox giriş əlavə yaddaş tələb etmir.",
    ),
    sizes: [10, 100, 1000],
  },
  aha: {
    input: bi("n items (given)", "n element (verilib)"),
    work: bi("1 extra variable", "1 əlavə dəyişən"),
    growth: bi("does not depend on n", "n-dən asılı deyil"),
    complexity: "O(1)",
    graph: bi("No memory is added when n grows.", "n artanda yaddaş əlavə olunmur."),
  },
};

const spaceLinear: Lesson = {
  id: "linear",
  type: "linear",
  metric: "space",
  notation: "O(n)",
  name: bi("Linear Space — Array", "Xətti yaddaş — massiv"),
  tagline: bi(
    "Every additional input needs roughly one more memory slot.",
    "Hər əlavə giriş təxminən bir əlavə yaddaş xanası tələb edir.",
  ),
  inPractice: bi(
    "Copying a list, building a hash map of all items, storing results in a new array.",
    "Siyahını kopyalamaq, bütün elementlərdən hash xəritəsi qurmaq, nəticələri yeni massivdə saxlamaq.",
  ),
  range: { min: 1, max: 200, initial: 8, scale: "linear" },
  count: (n) => n,
  graph: single("linear", "O(n)"),
  shape: bi("straight line", "düz xətt"),
  formula: {
    symbolic: [bi("memory = n slots × 1 unit", "yaddaş = n xana × 1 vahid"), bi("= n", "= n")],
    numeric: (n, f) => [`n = ${f(n)}`, `${f(n)} × 1 = ${f(n)}`],
    short: (n, f) => `${f(n)} × 1`,
  },
  code: {
    algorithm: bi("Allocate an array of n items", "n elementlik massiv ayırmaq"),
    text: `function makeArray(n) {
  const arr = new Array(n);
  for (let i = 0; i < n; i++) arr[i] = i;
  return arr;
}`,
  },
  viz: "memory-array",
  steps: (n) => n,
  activeLines: (step) => (step > 0 ? [2, 3] : []),
  vars: (n, f) => ({ n: f(n), count: f(n) }),
  why: {
    what: bi(
      "new Array(n) reserves room for {n} items, and the loop fills each slot.",
      "new Array(n) {n} element üçün yer ayırır, dövr isə hər xananı doldurur.",
    ),
    times: bi(
      "One memory slot per item → {count} slots for n = {n}.",
      "Hər element üçün bir yaddaş xanası → n = {n} üçün {count} xana.",
    ),
    why: bi(
      "Every item we want to remember needs its own slot. Twice as many items means twice as much memory.",
      "Yadda saxlamaq istədiyimiz hər elementin öz xanası lazımdır. İki dəfə çox element iki dəfə çox yaddaş deməkdir.",
    ),
    math: bi(
      "memory = n × 1 = n → memory ∝ n.",
      "yaddaş = n × 1 = n → yaddaş ∝ n.",
    ),
    graph: bi(
      "One more item always costs one more slot: steady growth → a straight line.",
      "Bir əlavə element həmişə bir əlavə xanaya başa gəlir: sabit artım → düz xətt.",
    ),
  },
  graphWhy: {
    lead: bi("Memory grows in step with the input:", "Yaddaş girişlə eyni tempdə böyüyür:"),
    points: [
      bi("n = 5 → 5 slots", "n = 5 → 5 xana"),
      bi("n = 50 → 50 slots", "n = 50 → 50 xana"),
      bi("n = 200 → 200 slots", "n = 200 → 200 xana"),
    ],
    deltaCaption: bi(
      "All bars equal 1: each new item adds exactly one slot → a straight line.",
      "Bütün sütunlar 1-dir: hər yeni element dəqiq bir xana əlavə edir → düz xətt.",
    ),
    sizes: [5, 50, 100, 200],
  },
  aha: {
    input: bi("n items", "n element"),
    work: bi("1 memory slot per item", "hər element üçün 1 yaddaş xanası"),
    growth: bi("n × 1 = n", "n × 1 = n"),
    complexity: "O(n)",
    graph: bi("Each item adds one slot, so the graph is straight.", "Hər element bir xana əlavə edir, ona görə qrafik düzdür."),
  },
};

const spaceStack: Lesson = {
  id: "stack",
  type: "linear",
  metric: "space",
  notation: "O(n)",
  name: bi("Linear Space — Recursion Stack", "Xətti yaddaş — rekursiya yığını"),
  tagline: bi(
    "Every pending recursive call stays in memory until it can return.",
    "Hər gözləyən rekursiv çağırış qaytara bilənə qədər yaddaşda qalır.",
  ),
  inPractice: bi(
    "Recursive factorial or list traversal, depth-first search on a long path. Deep recursion can cause a stack overflow.",
    "Rekursiv faktorial və ya siyahı gəzintisi, uzun yolda dərinlik üzrə axtarış. Dərin rekursiya stack overflow-a səbəb ola bilər.",
  ),
  range: { min: 1, max: 30, initial: 5, scale: "linear" },
  count: (n) => n,
  graph: single("linear", "O(n)"),
  shape: bi("straight line", "düz xətt"),
  formula: {
    symbolic: [
      bi("memory = deepest stack × 1 frame", "yaddaş = ən dərin yığın × 1 çərçivə"),
      bi("deepest stack = n", "ən dərin yığın = n"),
    ],
    numeric: (n) => [`n = ${n}`, `${n} frames × 1 = ${n}`],
    short: (n) => `${n} frames`,
  },
  code: {
    algorithm: bi("Recursive factorial", "Rekursiv faktorial"),
    text: `function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}`,
  },
  viz: "call-stack",
  steps: (n) => 2 * n,
  activeLines: (step) => (step > 0 ? [2, 3] : []),
  vars: (n) => ({ n, count: n }),
  why: {
    what: bi(
      "factorial({n}) cannot finish until factorial({n}−1) returns, which waits for factorial({n}−2), and so on down to factorial(1).",
      "factorial({n}) factorial({n}−1) qayıtmayınca bitə bilməz, o da factorial({n}−2)-ni gözləyir və s., factorial(1)-ə qədər.",
    ),
    times: bi(
      "All {count} calls are waiting at the same time — each one holds a frame on the call stack.",
      "Bütün {count} çağırış eyni vaxtda gözləyir — hər biri çağırış yığınında bir çərçivə saxlayır.",
    ),
    why: bi(
      "A call frame is only removed when its call returns. The deepest moment — when factorial(1) runs — has all {count} frames alive at once.",
      "Çağırış çərçivəsi yalnız çağırış qayıdanda silinir. Ən dərin an — factorial(1) işləyəndə — bütün {count} çərçivə eyni anda canlıdır.",
    ),
    math: bi(
      "peak memory = n frames × 1 frame each = n → O(n). (A plain loop would need only 1 variable: O(1).)",
      "pik yaddaş = n çərçivə × hər biri 1 = n → O(n). (Sadə dövr yalnız 1 dəyişən tələb edərdi: O(1).)",
    ),
    graph: bi(
      "One more level of recursion = exactly one more frame → a straight line.",
      "Rekursiyanın bir əlavə səviyyəsi = dəqiq bir əlavə çərçivə → düz xətt.",
    ),
  },
  graphWhy: {
    lead: bi("The stack gets one frame taller for every extra level of n:", "n-in hər əlavə səviyyəsi üçün yığın bir çərçivə hündürləşir:"),
    points: [
      bi("factorial(5) → 5 frames", "factorial(5) → 5 çərçivə"),
      bi("factorial(10) → 10 frames", "factorial(10) → 10 çərçivə"),
      bi("factorial(30) → 30 frames", "factorial(30) → 30 çərçivə"),
    ],
    deltaCaption: bi(
      "All bars equal 1: each extra level is one extra frame → a straight line.",
      "Bütün sütunlar 1-dir: hər əlavə səviyyə bir əlavə çərçivədir → düz xətt.",
    ),
    sizes: [5, 10, 20, 30],
  },
  aha: {
    input: bi("n (recursion depth)", "n (rekursiya dərinliyi)"),
    work: bi("1 stack frame per pending call", "hər gözləyən çağırış üçün 1 yığın çərçivəsi"),
    growth: bi("n frames alive at the deepest point", "ən dərin nöqtədə n çərçivə canlıdır"),
    complexity: "O(n)",
    graph: bi("One more level = one more frame, so the graph is straight.", "Bir əlavə səviyyə = bir əlavə çərçivə, ona görə qrafik düzdür."),
  },
};

const spaceQuadratic: Lesson = {
  id: "quadratic",
  type: "quadratic",
  metric: "space",
  notation: "O(n²)",
  name: bi("Quadratic Space — n × n Matrix", "Kvadratik yaddaş — n × n matris"),
  tagline: bi(
    "A table with n rows and n columns needs n × n memory slots.",
    "n sətir və n sütunlu cədvəl n × n yaddaş xanası tələb edir.",
  ),
  inPractice: bi(
    "Adjacency matrix of a graph, distance tables between all pairs, dynamic-programming grids.",
    "Qrafın qonşuluq matrisi, bütün cütlər arasında məsafə cədvəlləri, dinamik proqramlaşdırma şəbəkələri.",
  ),
  range: { min: 1, max: 40, initial: 6, scale: "linear" },
  count: (n) => n * n,
  graph: single("quadratic", "O(n²)"),
  shape: bi("curve bending upward", "yuxarı əyilən əyri"),
  formula: {
    symbolic: [bi("memory = rows × columns", "yaddaş = sətirlər × sütunlar"), bi("= n × n = n²", "= n × n = n²")],
    numeric: (n, f) => [`n = ${f(n)}`, `${f(n)} × ${f(n)} = ${f(n * n)}`],
    short: (n, f) => `${f(n)} × ${f(n)}`,
  },
  code: {
    algorithm: bi("Allocate an n × n grid", "n × n şəbəkə ayırmaq"),
    text: `function makeGrid(n) {
  return Array.from({ length: n }, () =>
    new Array(n).fill(0)
  );
}`,
  },
  viz: "memory-grid",
  steps: (n) => n * n,
  activeLines: (step) => (step > 0 ? [2, 3] : []),
  vars: (n, f) => ({ n: f(n), count: f(n * n), added: f(2 * n + 1), next: f(n + 1) }),
  why: {
    what: bi(
      "makeGrid creates {n} rows, and every row is an array of {n} slots.",
      "makeGrid {n} sətir yaradır və hər sətir {n} xanalıq massivdir.",
    ),
    times: bi(
      "{n} rows × {n} slots per row = {count} slots.",
      "{n} sətir × sətirdə {n} xana = {count} xana.",
    ),
    why: bi(
      "Adding one more row ALSO means every row gets one more slot — the table grows in two directions at once.",
      "Bir əlavə sətir əlavə etmək eyni zamanda hər sətrə bir əlavə xana verməyi tələb edir — cədvəl eyni anda iki istiqamətdə böyüyür.",
    ),
    math: bi("memory = n × n = n². With n = {n}: {count} slots.", "yaddaş = n × n = n². n = {n} üçün: {count} xana."),
    graph: bi(
      "Going from n to n + 1 adds a row and a column: {added} new slots right now. Each step adds more than the last, so the curve bends upward.",
      "n-dən n + 1-ə keçid sətir və sütun əlavə edir: indi {added} yeni xana. Hər addım əvvəlkindən çox əlavə edir, ona görə əyri yuxarı əyilir.",
    ),
  },
  graphWhy: {
    lead: bi("A grid grows in two directions at once:", "Şəbəkə eyni anda iki istiqamətdə böyüyür:"),
    points: [
      bi("n = 5 → 25 slots", "n = 5 → 25 xana"),
      bi("n = 10 → 100 slots", "n = 10 → 100 xana"),
      bi("n = 20 → 400 slots", "n = 20 → 400 xana"),
    ],
    deltaCaption: bi(
      "The bars grow with n (2n + 1): each step adds more than the one before → the graph bends upward.",
      "Sütunlar n ilə böyüyür (2n + 1): hər addım əvvəlkindən çox əlavə edir → qrafik yuxarı əyilir.",
    ),
    sizes: [5, 10, 20, 40],
  },
  aha: {
    input: bi("n", "n"),
    work: bi("n rows × n slots", "n sətir × n xana"),
    growth: bi("n²", "n²"),
    complexity: "O(n²)",
    graph: bi("Each extra n adds a row and a column — more than the step before.", "Hər əlavə n sətir və sütun əlavə edir — əvvəlki addımdan çox."),
  },
};

export const SPACE_LESSONS: Record<string, Lesson> = {
  constant: spaceConstant,
  linear: spaceLinear,
  stack: spaceStack,
  quadratic: spaceQuadratic,
};

export const SPACE_ORDER = ["constant", "linear", "stack", "quadratic"] as const;
