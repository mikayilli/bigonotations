import { bi } from "../i18n/types";
import { binarySearchTrace } from "../lib/algorithms";
import { factorial, fibCalls, halvingSequence, mergeLevels, pow2 } from "../lib/math";
import { COMPLEXITY } from "./complexities";
import type { ComplexityType, Lesson, SeriesDef } from "./types";

const single = (type: ComplexityType): SeriesDef[] => [
  {
    id: type,
    label: bi(COMPLEXITY[type].notation, COMPLEXITY[type].notation),
    fn: COMPLEXITY[type].growth,
    marker: true,
  },
];

const constant: Lesson = {
  id: "constant",
  type: "constant",
  metric: "time",
  notation: "O(1)",
  name: bi("Constant Time", "Sabit zaman"),
  tagline: COMPLEXITY.constant.tagline,
  inPractice: bi(
    "Reading an array item by index, looking up a key in a hash map, pushing onto a stack.",
    "Massiv elementini indeksə görə oxumaq, hash xəritəsində açar axtarmaq, yığına element əlavə etmək.",
  ),
  range: { min: 1, max: 1000, initial: 8, scale: "log" },
  count: () => 1,
  graph: single("constant"),
  shape: bi("flat line", "düz üfüqi xətt"),
  formula: {
    symbolic: [bi("operations = 1", "əməliyyatlar = 1"), bi("(there is no n in the formula)", "(düsturda n yoxdur)")],
    numeric: (n) => [`n = ${n}`, "operations = 1"],
    short: () => "1",
  },
  code: {
    algorithm: bi("Read the first item", "İlk elementi oxumaq"),
    text: `function getFirst(arr) {
  return arr[0];
}`,
  },
  viz: "array-access",
  steps: () => 1,
  activeLines: (step) => (step > 0 ? [2] : []),
  vars: (n, f) => ({ n: f(n), others: f(Math.max(0, n - 1)), count: 1 }),
  why: {
    what: bi(
      "getFirst goes straight to slot 0 and hands it back. The other {others} items are never looked at.",
      "getFirst birbaşa 0-cı xanaya gedib onu qaytarır. Qalan {others} elementə heç baxılmır.",
    ),
    times: bi(
      "That one read happens exactly 1 time — for n = 5, n = 100 or n = 1,000.",
      "Bu bir oxuma dəqiq 1 dəfə baş verir — n = 5, n = 100 və ya n = 1 000 olsun.",
    ),
    why: bi(
      "A computer can jump to any array slot by its address. A bigger array only means more slots we never touch, so it adds no work.",
      "Kompüter massivin istənilən xanasına ünvanı ilə birbaşa keçə bilər. Daha böyük massiv yalnız toxunmadığımız daha çox xana deməkdir — yəni əlavə iş yoxdur.",
    ),
    math: bi(
      "operations = 1. There is no n in the formula, so changing n cannot change the answer.",
      "əməliyyatlar = 1. Düsturda n yoxdur, ona görə n-i dəyişmək nəticəni dəyişə bilməz.",
    ),
    graph: bi(
      "A value that does not change when n grows is a flat horizontal line.",
      "n artanda dəyişməyən qiymət düz üfüqi xətt verir.",
    ),
  },
  graphWhy: {
    lead: bi(
      "The amount of work is 1 no matter how big n gets. Look at the table:",
      "n nə qədər böyük olsa da, iş həcmi 1-dir. Cədvələ baxın:",
    ),
    points: [
      bi("n grows from 5 to 1,000.", "n 5-dən 1 000-ə qədər artır."),
      bi("The work stays at 1.", "İş 1-də qalır."),
      bi("Constant work → a flat line.", "Sabit iş → düz xətt."),
    ],
    deltaCaption: bi(
      "Every bar is zero: one more input adds no work at all. Nothing is added, so the line never rises.",
      "Bütün sütunlar sıfırdır: bir əlavə giriş heç bir iş əlavə etmir. Heç nə əlavə olunmur, ona görə xətt qalxmır.",
    ),
    sizes: [5, 10, 100, 1000],
  },
  aha: {
    input: bi("n", "n"),
    work: bi("1 (one array access)", "1 (bir massiv girişi)"),
    growth: bi("does not depend on n", "n-dən asılı deyil"),
    complexity: "O(1)",
    graph: bi(
      "Nothing is added when n grows, so the line stays flat.",
      "n artanda heç nə əlavə olunmur, ona görə xətt düz qalır.",
    ),
  },
};

const logarithmic: Lesson = {
  id: "logarithmic",
  type: "logarithmic",
  metric: "time",
  notation: "O(log n)",
  name: bi("Logarithmic Time", "Loqarifmik zaman"),
  tagline: COMPLEXITY.logarithmic.tagline,
  inPractice: bi(
    "Binary search in a sorted list, looking up a value in a balanced search tree, finding a word in a dictionary.",
    "Sıralanmış siyahıda ikili axtarış, balanslı axtarış ağacında dəyər tapmaq, lüğətdə söz tapmaq.",
  ),
  range: { min: 2, max: 1024, initial: 16, scale: "log" },
  count: (n) => Math.floor(Math.log2(n)) + 1,
  graph: single("logarithmic"),
  shape: bi("flattening curve", "yastılaşan əyri"),
  formula: {
    symbolic: [
      bi("steps = how many times can n be halved until 1 is left?", "addımlar = n neçə dəfə yarıya bölünə bilər ki, 1 qalsın?"),
      bi("2ᵏ = n", "2ᵏ = n"),
      bi("k = log₂(n)", "k = log₂(n)"),
    ],
    numeric: (n, f) => [
      `n = ${f(n)}`,
      `log₂(${f(n)}) ≈ ${+Math.log2(n).toFixed(2)}`,
      `⌊log₂ ${f(n)}⌋ + 1 = ${Math.floor(Math.log2(n)) + 1}`,
    ],
    short: (n) => `log₂(${n}) ≈ ${+Math.log2(n).toFixed(1)}`,
  },
  code: {
    algorithm: bi("Binary search (worst case: target is missing)", "İkili axtarış (ən pis hal: hədəf yoxdur)"),
    text: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  },
  viz: "binary-search",
  steps: (n) => binarySearchTrace(n, -1).length,
  activeLines: (step) => (step > 0 ? [4, 5, 6, 7] : []),
  vars: (n, f) => {
    const seq = halvingSequence(n);
    const shown = seq.length > 7 ? [...seq.slice(0, 4), "…", ...seq.slice(-2)] : seq;
    return {
      n: f(n),
      halving: shown.join(" → "),
      halvings: seq.length - 1,
      count: Math.floor(Math.log2(n)) + 1,
      log: +Math.log2(n).toFixed(2),
      doubled: f(n * 2),
    };
  },
  why: {
    what: bi(
      "Binary search looks at the middle item. If it is not the target, half of the array is thrown away without being looked at, and the search repeats on the other half.",
      "İkili axtarış ortadakı elementə baxır. O, hədəf deyilsə, massivin yarısı baxılmadan atılır və axtarış digər yarıda təkrarlanır.",
    ),
    times: bi(
      "Remaining items: {halving}. That is {halvings} halvings to reach 1 item, plus a final check → {count} comparisons for n = {n}.",
      "Qalan elementlər: {halving}. 1 elementə çatmaq üçün {halvings} yarıya bölmə, üstəgəl son yoxlama → n = {n} üçün {count} müqayisə.",
    ),
    why: bi(
      "Because half of the problem disappears every step, doubling n adds only ONE extra step: {n} items need {count} comparisons, but {doubled} items need just {count} + 1.",
      "Hər addımda məsələnin yarısı yoxa çıxdığı üçün n-i ikiqat artırmaq yalnız BİR əlavə addım gətirir: {n} element üçün {count} müqayisə lazımdır, {doubled} element üçün isə cəmi {count} + 1.",
    ),
    math: bi(
      "How many times can n be divided by 2 before only 1 is left? 2ᵏ = n, so k = log₂(n). Here log₂({n}) ≈ {log}.",
      "n 1 qalana qədər neçə dəfə 2-yə bölünə bilər? 2ᵏ = n, deməli k = log₂(n). Burada log₂({n}) ≈ {log}.",
    ),
    graph: bi(
      "Each doubling of n raises the curve by only 1 step. Rising by a small fixed amount per doubling means the curve grows ever more slowly — it flattens out.",
      "n-in hər ikiqatlanması əyrini yalnız 1 addım qaldırır. Hər ikiqatlanmada kiçik sabit artım əyrinin getdikcə yavaş böyüməsi, yəni yastılaşması deməkdir.",
    ),
  },
  graphWhy: {
    lead: bi(
      "The remaining problem is divided again and again: 16 → 8 → 4 → 2 → 1. The question is “how many halvings?”",
      "Qalan məsələ dönə-dönə bölünür: 16 → 8 → 4 → 2 → 1. Sual belədir: “neçə bölmə?”",
    ),
    points: [
      bi("n = 4 → 2 halvings", "n = 4 → 2 bölmə"),
      bi("n = 16 → 4 halvings", "n = 16 → 4 bölmə"),
      bi("n = 256 → 8 halvings", "n = 256 → 8 bölmə"),
      bi("n = 1,024 → 10 halvings", "n = 1 024 → 10 bölmə"),
    ],
    deltaCaption: bi(
      "The bars shrink: going from n to n+1 adds less and less work. Shrinking increments → the curve flattens.",
      "Sütunlar kiçilir: n-dən n+1-ə keçid getdikcə daha az iş əlavə edir. Azalan artımlar → əyri yastılaşır.",
    ),
    sizes: [4, 16, 256, 1024],
  },
  aha: {
    input: bi("n sorted items", "n sıralanmış element"),
    work: bi("one comparison per halving", "hər bölmə üçün bir müqayisə"),
    growth: bi("halvings until 1 remains = log₂ n", "1 qalana qədər bölmələr = log₂ n"),
    complexity: "O(log n)",
    graph: bi(
      "Doubling n adds only one step, so the curve rises ever more slowly.",
      "n-in ikiqatlanması yalnız bir addım əlavə edir, ona görə əyri getdikcə yavaş qalxır.",
    ),
  },
};

const linear: Lesson = {
  id: "linear",
  type: "linear",
  metric: "time",
  notation: "O(n)",
  name: bi("Linear Time", "Xətti zaman"),
  tagline: COMPLEXITY.linear.tagline,
  inPractice: bi(
    "Linear search, summing a list, copying an array, finding the maximum value.",
    "Xətti axtarış, siyahının cəmi, massivin kopyalanması, maksimum dəyərin tapılması.",
  ),
  range: { min: 1, max: 200, initial: 12, scale: "linear" },
  count: (n) => n,
  graph: single("linear"),
  shape: bi("straight line", "düz xətt"),
  formula: {
    symbolic: [bi("operations = n × 1", "əməliyyatlar = n × 1"), bi("= n", "= n")],
    numeric: (n, f) => [`n = ${f(n)}`, `${f(n)} × 1 = ${f(n)}`],
    short: (n, f) => `${f(n)} × 1`,
  },
  code: {
    algorithm: bi("Linear search (worst case: target is last)", "Xətti axtarış (ən pis hal: hədəf sonuncudur)"),
    text: `function find(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
}`,
  },
  viz: "array-scan",
  steps: (n) => n,
  activeLines: (step) => (step > 0 ? [2, 3] : []),
  vars: (n, f) => ({ n: f(n), count: f(n) }),
  why: {
    what: bi(
      "The loop walks through the array from the left and checks one item per step until it finds the target. In the worst case the target is last, so all {n} items are checked.",
      "Dövr massivdə soldan gedərək hədəfi tapana qədər hər addımda bir elementi yoxlayır. Ən pis halda hədəf sonuncudur, ona görə bütün {n} element yoxlanılır.",
    ),
    times: bi(
      "One check per item → {count} checks for {n} items. 1 item ≈ 1 check, 10 items ≈ 10 checks, 100 items ≈ 100 checks.",
      "Hər element üçün bir yoxlama → {n} element üçün {count} yoxlama. 1 element ≈ 1 yoxlama, 10 element ≈ 10 yoxlama, 100 element ≈ 100 yoxlama.",
    ),
    why: bi(
      "Each extra item is one more place the target might hide, and the loop has to visit it. So every new item adds the same amount of work: exactly one more check.",
      "Hər əlavə element hədəfin gizlənə biləcəyi bir yerdir və dövr ora baxmalıdır. Deməli, hər yeni element eyni miqdar iş əlavə edir: dəqiq bir yoxlama.",
    ),
    math: bi(
      "operations = n × 1 = n, so the work is proportional to n (work ∝ n). With n = {n}: {count}.",
      "əməliyyatlar = n × 1 = n, yəni iş n ilə mütənasibdir (iş ∝ n). n = {n} üçün: {count}.",
    ),
    graph: bi(
      "Adding one item always adds one operation. Steady growth → a straight line.",
      "Bir element əlavə etmək həmişə bir əməliyyat əlavə edir. Sabit artım → düz xətt.",
    ),
  },
  graphWhy: {
    lead: bi(
      "Work is proportional to the input size: twice the items, twice the work.",
      "İş giriş ölçüsü ilə mütənasibdir: element iki dəfə çoxdursa, iş də iki dəfə çoxdur.",
    ),
    points: [
      bi("1 item → ~1 operation", "1 element → ~1 əməliyyat"),
      bi("10 items → ~10 operations", "10 element → ~10 əməliyyat"),
      bi("100 items → ~100 operations", "100 element → ~100 əməliyyat"),
    ],
    deltaCaption: bi(
      "All bars are equal: every new item adds exactly the same extra work. Steady growth → a straight line.",
      "Bütün sütunlar bərabərdir: hər yeni element dəqiq eyni əlavə işi gətirir. Sabit artım → düz xətt.",
    ),
    sizes: [1, 10, 100, 200],
  },
  aha: {
    input: bi("n items", "n element"),
    work: bi("1 check per item", "hər element üçün 1 yoxlama"),
    growth: bi("n × 1 = n", "n × 1 = n"),
    complexity: "O(n)",
    graph: bi(
      "Every extra item adds the same one unit of work, so the graph is straight.",
      "Hər əlavə element eyni bir vahid iş əlavə edir, ona görə qrafik düzdür.",
    ),
  },
};

const linearithmic: Lesson = {
  id: "linearithmic",
  type: "linearithmic",
  metric: "time",
  notation: "O(n log n)",
  name: bi("Linearithmic Time", "Xətti-loqarifmik zaman"),
  tagline: COMPLEXITY.linearithmic.tagline,
  inPractice: bi(
    "Merge sort, heap sort, and the average case of quick sort — the best general-purpose sorting speed.",
    "Merge sort, heap sort və quick sort-un orta halı — ümumi təyinatlı sıralamanın ən yaxşı sürəti.",
  ),
  range: { min: 2, max: 256, initial: 8, scale: "log" },
  count: (n) => n * mergeLevels(n),
  graph: single("linearithmic"),
  shape: bi("line that bends up slightly", "azca yuxarı əyilən xətt"),
  formula: {
    symbolic: [
      bi("operations = levels × work per level", "əməliyyatlar = səviyyələr × hər səviyyənin işi"),
      bi("= log₂ n × n", "= log₂ n × n"),
    ],
    numeric: (n, f) => [`n = ${f(n)}`, `${mergeLevels(n)} × ${f(n)} = ${f(n * mergeLevels(n))}`],
    short: (n, f) => `${mergeLevels(n)} × ${f(n)}`,
  },
  code: {
    algorithm: bi("Merge sort", "Merge sort (birləşdirməklə sıralama)"),
    text: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right); // touches every item once
}`,
  },
  viz: "merge-levels",
  steps: (n) => mergeLevels(n),
  activeLines: (step) => (step > 0 ? [3, 4, 5, 6] : []),
  vars: (n, f) => ({ n: f(n), levels: mergeLevels(n), count: f(n * mergeLevels(n)) }),
  why: {
    what: bi(
      "Merge sort splits the array in half again and again until single items remain, then merges the halves back together. Splitting takes {levels} levels, and every level merges all {n} items.",
      "Merge sort massivi tək elementlər qalana qədər dönə-dönə yarıya bölür, sonra yarıları geri birləşdirir. Bölmə {levels} səviyyə çəkir və hər səviyyə bütün {n} elementi birləşdirir.",
    ),
    times: bi(
      "{levels} levels × {n} items per level = {count} operations.",
      "{levels} səviyyə × səviyyədə {n} element = {count} əməliyyat.",
    ),
    why: bi(
      "Why log n? Halving n → n/2 → n/4 … ends after about log₂ n steps. Why n? On every level the pieces together still hold all n items, and merging touches each of them once.",
      "Niyə log n? n → n/2 → n/4 … bölməsi təxminən log₂ n addımdan sonra bitir. Niyə n? Hər səviyyədə parçalar birlikdə yenə bütün n elementi saxlayır və birləşdirmə hər birinə bir dəfə toxunur.",
    ),
    math: bi(
      "operations = n × log₂ n. With n = {n}: {n} × {levels} = {count}.",
      "əməliyyatlar = n × log₂ n. n = {n} üçün: {n} × {levels} = {count}.",
    ),
    graph: bi(
      "It is the O(n) line multiplied by a slowly growing factor (the number of levels). So it starts like a straight line but bends slightly upward — steeper than O(n), far flatter than O(n²).",
      "Bu, O(n) xəttinin yavaş böyüyən vuruğa (səviyyələrin sayına) vurulmasıdır. Düz xətt kimi başlayır, amma azca yuxarı əyilir — O(n)-dən dik, O(n²)-dən xeyli düzdür.",
    ),
  },
  graphWhy: {
    lead: bi(
      "Two ingredients combine: levels grow like log n, and each level costs n.",
      "İki komponent birləşir: səviyyələr log n kimi böyüyür, hər səviyyənin qiyməti n-dir.",
    ),
    points: [
      bi("n = 8 → 3 levels × 8 = 24", "n = 8 → 3 səviyyə × 8 = 24"),
      bi("n = 16 → 4 levels × 16 = 64", "n = 16 → 4 səviyyə × 16 = 64"),
      bi("n = 64 → 6 levels × 64 = 384", "n = 64 → 6 səviyyə × 64 = 384"),
    ],
    deltaCaption: bi(
      "The bars grow slowly: each new item adds about log n operations, and log n itself creeps up. A slightly rising increment → a slight upward bend.",
      "Sütunlar yavaş böyüyür: hər yeni element təxminən log n əməliyyat əlavə edir və log n özü yavaşca artır. Azca artan əlavə → azca yuxarı əyilmə.",
    ),
    sizes: [4, 8, 16, 64],
  },
  aha: {
    input: bi("n items", "n element"),
    work: bi("log₂ n levels × n items per level", "log₂ n səviyyə × səviyyədə n element"),
    growth: bi("n × log₂ n", "n × log₂ n"),
    complexity: "O(n log n)",
    graph: bi(
      "A line (n) multiplied by a slowly growing factor (log n) bends gently upward.",
      "Düz xətt (n) yavaş böyüyən vuruğa (log n) vurulduqda yüngülcə yuxarı əyilir.",
    ),
  },
};

const quadratic: Lesson = {
  id: "quadratic",
  type: "quadratic",
  metric: "time",
  notation: "O(n²)",
  name: bi("Quadratic Time", "Kvadratik zaman"),
  tagline: COMPLEXITY.quadratic.tagline,
  inPractice: bi(
    "Comparing every pair of items: bubble sort, insertion sort, naive duplicate detection, building a distance matrix.",
    "Hər element cütünü müqayisə etmək: bubble sort, insertion sort, sadəlövh təkrar axtarışı, məsafə matrisi qurmaq.",
  ),
  range: { min: 1, max: 60, initial: 8, scale: "linear" },
  count: (n) => n * n,
  graph: single("quadratic"),
  shape: bi("curve bending upward", "yuxarı əyilən əyri"),
  formula: {
    symbolic: [bi("operations = n × n", "əməliyyatlar = n × n"), bi("= n²", "= n²")],
    numeric: (n, f) => [`n = ${f(n)}`, `${f(n)} × ${f(n)} = ${f(n * n)}`],
    short: (n, f) => `${f(n)} × ${f(n)}`,
  },
  code: {
    algorithm: bi("Nested loops", "İç-içə dövrlər"),
    text: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    doSomething();
  }
}`,
  },
  viz: "grid",
  steps: (n) => n * n,
  activeLines: (step) => (step > 0 ? [1, 2, 3] : []),
  vars: (n, f) => ({ n: f(n), count: f(n * n), next: f(n + 1), added: f(2 * n + 1) }),
  why: {
    what: bi(
      "The outer loop picks each of the {n} items. For every one of them, the inner loop walks over all {n} items again.",
      "Xarici dövr {n} elementin hər birini seçir. Onların hər biri üçün daxili dövr yenidən bütün {n} elementi gəzir.",
    ),
    times: bi(
      "Outer loop: {n} times. Inner loop: {n} times for each outer iteration. Total: {n} × {n} = {count}.",
      "Xarici dövr: {n} dəfə. Daxili dövr: hər xarici iterasiya üçün {n} dəfə. Cəmi: {n} × {n} = {count}.",
    ),
    why: bi(
      "The inner loop is not run once — it restarts from scratch on every outer pass. {n} passes of {n} steps each fill an {n}-by-{n} grid.",
      "Daxili dövr bir dəfə işləmir — hər xarici keçiddə sıfırdan yenidən başlayır. Hər biri {n} addımlıq {n} keçid {n}×{n} şəbəkəni doldurur.",
    ),
    math: bi(
      "operations = n × n = n². With n = {n}: {n} × {n} = {count}.",
      "əməliyyatlar = n × n = n². n = {n} üçün: {n} × {n} = {count}.",
    ),
    graph: bi(
      "Going from n to n + 1 adds a whole new row and column — {added} new operations right now. The bigger n is, the more each step adds, so the curve bends upward.",
      "n-dən n + 1-ə keçid tam yeni sətir və sütun əlavə edir — indi {added} yeni əməliyyat. n nə qədər böyükdürsə, hər addım bir o qədər çox iş əlavə edir, ona görə əyri yuxarı əyilir.",
    ),
  },
  graphWhy: {
    lead: bi(
      "In O(n), increasing n creates roughly one more unit of work. In O(n²), increasing n makes an entire extra row and column of work appear — and the new work grows with n.",
      "O(n)-də n-i artırmaq təxminən bir vahid əlavə iş yaradır. O(n²)-də isə n-i artırmaq tam əlavə sətir və sütun işinin yaranmasına səbəb olur — yeni iş n ilə birlikdə böyüyür.",
    ),
    points: [
      bi("n = 5 → 25", "n = 5 → 25"),
      bi("n = 10 → 100", "n = 10 → 100"),
      bi("n = 20 → 400", "n = 20 → 400"),
    ],
    deltaCaption: bi(
      "The bars grow with n (the increment is 2n + 1): each step adds more than the one before. Growing increments → the graph bends upward.",
      "Sütunlar n ilə böyüyür (artım 2n + 1-dir): hər addım əvvəlkindən çox iş əlavə edir. Artan əlavələr → qrafik yuxarı əyilir.",
    ),
    sizes: [5, 10, 20, 40],
  },
  aha: {
    input: bi("n items", "n element"),
    work: bi("n × n", "n × n"),
    growth: bi("n²", "n²"),
    complexity: "O(n²)",
    graph: bi(
      "Each increase in n creates more work than the previous increase.",
      "n-in hər artımı əvvəlki artımdan daha çox iş yaradır.",
    ),
  },
};

const exponential: Lesson = {
  id: "exponential",
  type: "exponential",
  metric: "time",
  notation: "O(2ⁿ)",
  name: bi("Exponential Time", "Eksponensial zaman"),
  tagline: COMPLEXITY.exponential.tagline,
  inPractice: bi(
    "Naive recursive Fibonacci, trying every subset of items, brute-forcing a password of n bits.",
    "Sadəlövh rekursiv Fibonacci, elementlərin bütün alt çoxluqlarını yoxlamaq, n bitlik parolu kobud qüvvə ilə sındırmaq.",
  ),
  range: { min: 1, max: 30, initial: 5, scale: "linear" },
  count: fibCalls,
  graph: [
    { id: "bound", label: bi("2ⁿ bound", "2ⁿ sərhəd"), fn: pow2, dashed: true },
    { id: "calls", label: bi("calls", "çağırış"), fn: fibCalls, marker: true },
  ],
  shape: bi("curve shooting upward", "dik yuxarı qalxan əyri"),
  formula: {
    symbolic: [
      bi("calls(n) = calls(n−1) + calls(n−2) + 1", "çağırışlar(n) = çağırışlar(n−1) + çağırışlar(n−2) + 1"),
      bi("each call makes 2 more → about 2ⁿ", "hər çağırış 2 yenisini yaradır → təxminən 2ⁿ"),
    ],
    numeric: (n, f) => [`n = ${n}`, `calls = ${f(fibCalls(n))}`, `2^${n} = ${f(pow2(n))}  (upper bound)`],
    short: (n, f) => `2^${n} = ${f(pow2(n))}`,
  },
  code: {
    algorithm: bi("Naive recursive Fibonacci", "Sadəlövh rekursiv Fibonacci"),
    text: `function fibonacci(n) {
  if (n <= 1) return n;

  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  viz: "recursion-tree",
  steps: (n) => fibCalls(n),
  activeLines: (step) => (step > 0 ? [2, 4] : []),
  vars: (n, f) => ({ n, count: f(fibCalls(n)), bound: f(pow2(n)) }),
  why: {
    what: bi(
      "fibonacci({n}) calls itself twice: fibonacci(n−1) and fibonacci(n−2). Each of those calls twice again, and so on until n ≤ 1.",
      "fibonacci({n}) özünü iki dəfə çağırır: fibonacci(n−1) və fibonacci(n−2). Onların hər biri yenə iki dəfə çağırır və bu, n ≤ 1 olana qədər davam edir.",
    ),
    times: bi(
      "n = {n} makes {count} calls in total. Every +1 on n multiplies the number of calls by about 1.6.",
      "n = {n} cəmi {count} çağırış edir. n-ə hər +1 çağırışların sayını təxminən 1,6 dəfə artırır.",
    ),
    why: bi(
      "Every call spawns two more, so each level of the tree has about twice as many calls as the one above: 1, 2, 4, 8, … The tree doubles in width as it gets deeper.",
      "Hər çağırış 2 yenisini yaradır, ona görə ağacın hər səviyyəsində üstdəkindən təxminən 2 dəfə çox çağırış olur: 1, 2, 4, 8, … Ağac dərinləşdikcə eni ikiqat artır.",
    ),
    math: bi(
      "Level k has at most 2ᵏ calls, so the total is at most about 2ⁿ → O(2ⁿ). Here the bound is {bound}. (The exact count grows like 1.618ⁿ — still exponential.)",
      "k-cı səviyyədə ən çox 2ᵏ çağırış var, deməli cəmi təxminən 2ⁿ-i keçməz → O(2ⁿ). Burada sərhəd {bound}-dir. (Dəqiq say 1,618ⁿ kimi artır — yenə eksponensialdır.)",
    ),
    graph: bi(
      "Doubling is the opposite of steady growth: each +1 on n adds as much work as everything before it. The curve shoots almost straight up.",
      "İkiqatlanma sabit artımın əksidir: n-ə hər +1 özündən əvvəlki bütün işin qədər iş əlavə edir. Əyri demək olar ki, dik yuxarı qalxır.",
    ),
  },
  graphWhy: {
    lead: bi(
      "Each call creates two more, so the work doubles (roughly) with every step of n.",
      "Hər çağırış 2 yenisini yaradır, ona görə iş n-in hər addımında (təxminən) ikiqat artır.",
    ),
    points: [
      bi("n = 5 → 15 calls", "n = 5 → 15 çağırış"),
      bi("n = 10 → 177 calls", "n = 10 → 177 çağırış"),
      bi("n = 20 → 21,891 calls", "n = 20 → 21 891 çağırış"),
      bi("n = 30 → 2,692,537 calls", "n = 30 → 2 692 537 çağırış"),
    ],
    deltaCaption: bi(
      "Each bar is about as tall as everything before it combined. Increments that keep multiplying → the curve explodes.",
      "Hər sütun özündən əvvəlkilərin cəmi qədər hündürdür. Daim vurulan artımlar → əyri partlayır.",
    ),
    sizes: [5, 10, 20, 30],
  },
  aha: {
    input: bi("n (which Fibonacci number)", "n (neçənci Fibonacci ədədi)"),
    work: bi("every call makes 2 more calls", "hər çağırış 2 yeni çağırış edir"),
    growth: bi("2 × 2 × 2 … (n times) = 2ⁿ", "2 × 2 × 2 … (n dəfə) = 2ⁿ"),
    complexity: "O(2ⁿ)",
    graph: bi(
      "Every +1 on n adds as much new work as all the work so far, so the curve shoots up.",
      "n-ə hər +1 indiyə qədərki bütün iş qədər yeni iş əlavə edir, ona görə əyri dik qalxır.",
    ),
  },
};

const factorialLesson: Lesson = {
  id: "factorial",
  type: "factorial",
  metric: "time",
  notation: "O(n!)",
  name: bi("Factorial Time", "Faktorial zaman"),
  tagline: COMPLEXITY.factorial.tagline,
  inPractice: bi(
    "Generating every ordering (permutation), brute-forcing the travelling salesman problem, trying every seating plan.",
    "Bütün düzülüşləri (permutasiyaları) yaratmaq, kommivoyajer məsələsini kobud qüvvə ilə həll etmək, bütün oturuş planlarını yoxlamaq.",
  ),
  range: { min: 1, max: 10, initial: 4, scale: "linear" },
  count: factorial,
  graph: single("factorial"),
  shape: bi("curve climbing even faster than 2ⁿ", "2ⁿ-dən də sürətlə qalxan əyri"),
  formula: {
    symbolic: [
      bi("operations = n × (n−1) × (n−2) × … × 1", "əməliyyatlar = n × (n−1) × (n−2) × … × 1"),
      bi("= n!", "= n!"),
    ],
    numeric: (n, f) => [
      `n = ${n}`,
      Array.from({ length: n }, (_, i) => n - i).join(" × ") + ` = ${f(factorial(n))}`,
    ],
    short: (n, f) => `${n}! = ${f(factorial(n))}`,
  },
  code: {
    algorithm: bi("Generate all permutations", "Bütün permutasiyaları yaratmaq"),
    text: `function permutations(items) {
  if (items.length <= 1) return [items];
  const result = [];
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) result.push([items[i], ...p]);
  }
  return result;
}`,
  },
  viz: "permutations",
  steps: (n) => factorial(n),
  activeLines: (step) => (step > 0 ? [4, 6] : []),
  vars: (n, f) => ({ n, nm1: Math.max(1, n - 1), count: f(factorial(n)) }),
  why: {
    what: bi(
      "To list every order of {n} items: pick any of the {n} for the first place, any of the remaining {nm1} for the second, and so on.",
      "{n} elementin bütün düzülüşlərini sadalamaq üçün: birinci yerə {n} elementdən istənilənini, ikinci yerə qalan {nm1} elementdən istənilənini seçirik və s.",
    ),
    times: bi(
      "{n} × {nm1} × … × 1 = {n}! = {count} different orders.",
      "{n} × {nm1} × … × 1 = {n}! = {count} fərqli düzülüş.",
    ),
    why: bi(
      "Each extra item multiplies the number of orderings by the new item count: adding a 4th person turns 6 orders into 6 × 4 = 24. And the multiplier itself keeps growing.",
      "Hər əlavə element düzülüşlərin sayını yeni elementlərin sayına vurur: 4-cü şəxsi əlavə etmək 6 düzülüşü 6 × 4 = 24-ə çevirir. Vuruğun özü isə artmaqda davam edir.",
    ),
    math: bi(
      "operations = n! = n × (n−1) × (n−2) × … × 1. With n = {n}: {count}.",
      "əməliyyatlar = n! = n × (n−1) × (n−2) × … × 1. n = {n} üçün: {count}.",
    ),
    graph: bi(
      "Exponential growth multiplies by a fixed number (2) each step; factorial multiplies by a growing number (n). That is why the curve climbs even faster than 2ⁿ.",
      "Eksponensial artım hər addımda sabit ədədə (2) vurur; faktorial isə artan ədədə (n) vurur. Ona görə əyri 2ⁿ-dən də sürətlə qalxır.",
    ),
  },
  graphWhy: {
    lead: bi(
      "Look at how the number of orderings explodes as people are added to the line:",
      "Növbəyə adam əlavə etdikcə düzülüşlərin sayının necə partladığına baxın:",
    ),
    points: [
      bi("3 people → 6 orders", "3 nəfər → 6 düzülüş"),
      bi("4 people → 24 orders", "4 nəfər → 24 düzülüş"),
      bi("5 people → 120 orders", "5 nəfər → 120 düzülüş"),
      bi("7 people → 5,040 orders", "7 nəfər → 5 040 düzülüş"),
    ],
    deltaCaption: bi(
      "The bars explode: each +1 on n multiplies the work by n + 1. Increments that grow faster than the total → an almost vertical curve.",
      "Sütunlar partlayır: n-ə hər +1 işi n + 1 dəfə artırır. Cəmdən sürətli böyüyən artımlar → demək olar ki, şaquli əyri.",
    ),
    sizes: [4, 5, 6, 7, 10],
  },
  aha: {
    input: bi("n distinct items", "n fərqli element"),
    work: bi("one arrangement per ordering", "hər düzülüş üçün bir variant"),
    growth: bi("n × (n−1) × … × 1 = n!", "n × (n−1) × … × 1 = n!"),
    complexity: "O(n!)",
    graph: bi(
      "Each +1 on n multiplies the work by a bigger number than last time.",
      "n-ə hər +1 işi əvvəlkindən daha böyük ədədə vurur.",
    ),
  },
};

export const LESSONS: Record<ComplexityType, Lesson> = {
  constant,
  logarithmic,
  linear,
  linearithmic,
  quadratic,
  exponential,
  factorial: factorialLesson,
};
