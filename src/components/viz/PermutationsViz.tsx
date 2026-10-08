import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { factorial } from "../../lib/math";
import type { VizProps } from "./types";

const LIST_CAP = 24;
const TABLE_MAX = 10;

const TXT = {
  people: bi("{n} people: {names}", "{n} nəfər: {names}"),
  list: bi("Every possible order", "Bütün mümkün düzülüşlər"),
  idle: bi("Press Run to write the orders down one by one.", "Düzülüşləri bir-bir yazmaq üçün İşə sal düyməsinə basın."),
  progress: bi("{k} of {total} orders written", "{total} düzülüşdən {k} yazılıb"),
  more: bi("… and {rest} more orders (only the first {cap} are listed)", "… və daha {rest} düzülüş (yalnız ilk {cap} sadalanıb)"),
  slots: bi("Choices for each place in line", "Növbədə hər yer üçün seçimlər"),
  place: bi("place", "yer"),
  tableTitle: bi("How fast n! explodes (bar length is logarithmic)", "n!-in nə qədər sürətlə partladığı (sütun uzunluğu loqarifmikdir)"),
  simplified: bi("Simplified: the full list is far too long to draw.", "Sadələşdirilib: tam siyahını çəkmək üçün çox uzundur."),
};

/** First `limit` permutations of `items` in lexicographic order. */
function firstPermutations(items: string[], limit: number): string[] {
  const out: string[] = [];
  const walk = (prefix: string, rest: string[]) => {
    if (out.length >= limit) return;
    if (rest.length === 0) {
      out.push(prefix);
      return;
    }
    for (let i = 0; i < rest.length && out.length < limit; i++) {
      walk(prefix + rest[i], [...rest.slice(0, i), ...rest.slice(i + 1)]);
    }
  };
  walk("", items);
  return out;
}

export function PermutationsViz({ n, step, total }: VizProps) {
  const { t, lang } = useI18n();
  const fmt = (x: number) => formatCount(x, lang);
  const letters = useMemo(() => Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)), [n]);
  const perms = useMemo(() => firstPermutations(letters, LIST_CAP), [letters]);
  const count = factorial(n);
  const visible = step >= total ? perms.length : Math.min(perms.length, Math.floor((step / total) * count));
  const written = step >= total ? count : Math.min(count, Math.floor(step));
  const truncated = count > perms.length;
  const tableMax = Math.log10(factorial(TABLE_MAX));

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted">{t(TXT.people, { n, names: letters.join(", ") })}</p>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-muted">{t(TXT.slots)}</h3>
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-sm">
          {letters.map((_, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="rounded-lg border-2 border-accent bg-accent-soft px-2.5 py-1 font-bold" title={`${t(TXT.place)} ${i + 1}`}>
                {n - i}
              </span>
              {i < n - 1 && <span aria-hidden="true">×</span>}
            </li>
          ))}
          <li aria-hidden="true">=</li>
          <li className="text-base font-bold">{fmt(count)}</li>
        </ol>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-muted">{t(TXT.list)}</h3>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.2rem,1fr))] gap-1.5" aria-label={t(TXT.list)}>
          {perms.map((p, i) => (
            <li
              key={p}
              className="rounded-md border px-2 py-1 text-center font-mono text-sm font-semibold"
              style={{
                borderColor: i < visible ? "var(--c-factorial)" : "var(--border)",
                background: i < visible ? "var(--accent-soft)" : "var(--surface-2)",
                opacity: i < visible ? 1 : 0.3,
              }}
            >
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm" aria-live="polite">
          {step === 0 ? t(TXT.idle) : t(TXT.progress, { k: fmt(written), total: fmt(count) })}
        </p>
        {truncated && (
          <p className="mt-1 text-xs text-muted">
            {t(TXT.more, { rest: fmt(count - perms.length), cap: LIST_CAP })} {t(TXT.simplified)}
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted">{t(TXT.tableTitle)}</h3>
        <ul className="space-y-1">
          {Array.from({ length: TABLE_MAX - 2 }, (_, i) => i + 3).map((k) => (
            <li key={k} className="flex items-center gap-2 text-sm" style={{ fontWeight: k === n ? 700 : 400 }}>
              <span className="w-10 font-mono text-muted">{k}!</span>
              <span className="h-3.5 flex-1 rounded bg-surface-2" aria-hidden="true">
                <span
                  className="block h-3.5 rounded"
                  style={{
                    width: `${(Math.log10(factorial(k)) / tableMax) * 100}%`,
                    background: k === n ? "var(--cell-hot)" : "var(--c-factorial)",
                  }}
                />
              </span>
              <span className="w-24 text-right font-mono">{fmt(factorial(k))}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
