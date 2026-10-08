import { bi, type Bi } from "../i18n/types";
import { factorial, pow2 } from "../lib/math";
import type { ComplexityType } from "./types";

export interface ComplexityInfo {
  type: ComplexityType;
  notation: string;
  name: Bi;
  tagline: Bi;
  /** Continuous growth function used by previews and the comparison graph. */
  growth: (n: number) => number;
  /** CSS custom property holding the colour (also differentiated by dash/label, never colour alone). */
  color: string;
  /** 1 (best) … 7 (worst). */
  rank: number;
  rankLabel: Bi;
}

export const COMPLEXITY_ORDER: ComplexityType[] = [
  "constant",
  "logarithmic",
  "linear",
  "linearithmic",
  "quadratic",
  "exponential",
  "factorial",
];

export const COMPLEXITY: Record<ComplexityType, ComplexityInfo> = {
  constant: {
    type: "constant",
    notation: "O(1)",
    name: bi("Constant", "Sabit"),
    tagline: bi(
      "Input can grow, but the amount of work stays roughly the same.",
      "Giriş böyüyə bilər, amma işin həcmi təxminən eyni qalır.",
    ),
    growth: () => 1,
    color: "var(--c-constant)",
    rank: 1,
    rankLabel: bi("Excellent", "Əla"),
  },
  logarithmic: {
    type: "logarithmic",
    notation: "O(log n)",
    name: bi("Logarithmic", "Loqarifmik"),
    tagline: bi(
      "Each step removes a large portion of the remaining problem.",
      "Hər addım qalan məsələnin böyük hissəsini aradan qaldırır.",
    ),
    growth: (n) => Math.log2(Math.max(1, n)),
    color: "var(--c-logarithmic)",
    rank: 2,
    rankLabel: bi("Great", "Çox yaxşı"),
  },
  linear: {
    type: "linear",
    notation: "O(n)",
    name: bi("Linear", "Xətti"),
    tagline: bi(
      "Every additional input adds roughly one more unit of work.",
      "Hər əlavə giriş təxminən bir vahid əlavə iş gətirir.",
    ),
    growth: (n) => n,
    color: "var(--c-linear)",
    rank: 3,
    rankLabel: bi("Good", "Yaxşı"),
  },
  linearithmic: {
    type: "linearithmic",
    notation: "O(n log n)",
    name: bi("Linearithmic", "Xətti-loqarifmik"),
    tagline: bi(
      "Split the problem log n times — every level still touches all n items.",
      "Məsələni log n dəfə böl — hər səviyyə yenə də bütün n elementə toxunur.",
    ),
    growth: (n) => n * Math.log2(Math.max(1, n)),
    color: "var(--c-linearithmic)",
    rank: 4,
    rankLabel: bi("Fair", "Orta"),
  },
  quadratic: {
    type: "quadratic",
    notation: "O(n²)",
    name: bi("Quadratic", "Kvadratik"),
    tagline: bi(
      "Each input causes another full pass over the input.",
      "Hər giriş elementi girişin bir tam keçidini yaradır.",
    ),
    growth: (n) => n * n,
    color: "var(--c-quadratic)",
    rank: 5,
    rankLabel: bi("Slow", "Yavaş"),
  },
  exponential: {
    type: "exponential",
    notation: "O(2ⁿ)",
    name: bi("Exponential", "Eksponensial"),
    tagline: bi(
      "Every extra input doubles the work.",
      "Hər əlavə giriş işi iki dəfə artırır.",
    ),
    growth: pow2,
    color: "var(--c-exponential)",
    rank: 6,
    rankLabel: bi("Very slow", "Çox yavaş"),
  },
  factorial: {
    type: "factorial",
    notation: "O(n!)",
    name: bi("Factorial", "Faktorial"),
    tagline: bi(
      "Every extra input multiplies the work by a growing number.",
      "Hər əlavə giriş işi artan bir ədədə vurur.",
    ),
    growth: factorial,
    color: "var(--c-factorial)",
    rank: 7,
    rankLabel: bi("Explosive", "Partlayıcı"),
  },
};
