import type { Lang } from "../i18n/types";

/** Numbers at or above this are shown in scientific notation, e.g. 1.24e+15. */
const SCI_THRESHOLD = 1e12;

const LOCALES: Record<Lang, string> = { en: "en-US", az: "az-AZ" };

/** Format an operation count: grouped digits, decimals for fractions, e+ notation when huge. */
export function formatCount(value: number, lang: Lang = "en"): string {
  if (!Number.isFinite(value)) return "∞";
  if (Math.abs(value) >= SCI_THRESHOLD) return value.toExponential(2);
  const isInt = Number.isInteger(value);
  return new Intl.NumberFormat(LOCALES[lang], {
    maximumFractionDigits: isInt ? 0 : value < 10 ? 2 : 1,
  }).format(value);
}

/** Short axis tick label: 1.2k, 3.4M, 1e+15 … */
export function formatTick(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  const abs = Math.abs(value);
  if (abs >= 1e15) return value.toExponential(0);
  if (abs >= 1e12) return `${+(value / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${+(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${+(value / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${+(value / 1e3).toFixed(1)}k`;
  return `${+value.toFixed(abs < 10 ? 2 : 1)}`;
}

const DURATION_UNITS: Record<Lang, { tiny: string; ms: string; s: string; min: string; hours: string; years: string }> = {
  en: { tiny: "< 1 ms", ms: "ms", s: "s", min: "min", hours: "hours", years: "years" },
  az: { tiny: "< 1 ms", ms: "ms", s: "san", min: "dəq", hours: "saat", years: "il" },
};

/** Human duration for `seconds` of work, used to make large counts tangible. */
export function formatDuration(seconds: number, lang: Lang): string {
  const u = DURATION_UNITS[lang];
  if (!Number.isFinite(seconds)) return "∞";
  if (seconds < 1e-3) return u.tiny;
  if (seconds < 1) return `${Math.round(seconds * 1000)} ${u.ms}`;
  if (seconds < 60) return `${+seconds.toFixed(1)} ${u.s}`;
  if (seconds < 3600) return `${+(seconds / 60).toFixed(1)} ${u.min}`;
  if (seconds < 86400) return `${+(seconds / 3600).toFixed(1)} ${u.hours}`;
  const y = seconds / 31_557_600;
  if (y < 1000) return `${+y.toFixed(y < 10 ? 1 : 0)} ${u.years}`;
  return `${y.toExponential(1)} ${u.years}`;
}
