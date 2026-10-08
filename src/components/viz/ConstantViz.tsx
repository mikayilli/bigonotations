import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { ArrayStrip, Legend } from "./ArrayStrip";
import type { VizProps } from "./types";

const TXT = {
  array: bi("Array with n items", "n elementli massiv"),
  only: bi(
    "Only 1 access happened. The other {others} items were never touched.",
    "Yalnız 1 giriş baş verdi. Qalan {others} elementə heç toxunulmadı.",
  ),
  before: bi("Press Run: getFirst(arr) reads arr[0] and returns.", "İşə sal düyməsinə basın: getFirst(arr) arr[0]-ı oxuyub qaytarır."),
  tableTitle: bi("Bigger input, same work", "Daha böyük giriş, eyni iş"),
  op: bi("1 operation", "1 əməliyyat"),
  accessed: bi("accessed", "oxunub"),
  untouched: bi("never touched", "toxunulmayıb"),
  slot: bi("the only access", "yeganə giriş"),
};

const SIZES = [5, 10, 100, 1000];

export function ConstantViz({ n, step }: VizProps) {
  const { t, lang } = useI18n();
  const done = step >= 1;
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-sm font-medium text-muted">
          {t(TXT.array)} · n = {formatCount(n, lang)}
        </div>
        <ArrayStrip
          n={n}
          cap={32}
          ariaLabel={`${t(TXT.array)}: n = ${n}`}
          cellState={(i) => (i === 0 && done ? "active" : "idle")}
          cellMark={(i) => (i === 0 ? "arr[0]" : null)}
        />
        <p className="mt-2 text-sm" aria-live="polite">
          {done ? t(TXT.only, { others: formatCount(Math.max(0, n - 1), lang) }) : t(TXT.before)}
        </p>
        <div className="mt-2">
          <Legend
            items={[
              { state: "active", label: t(TXT.accessed) },
              { state: "idle", label: t(TXT.untouched) },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted">{t(TXT.tableTitle)}</h3>
        <ul className="space-y-1.5">
          {SIZES.map((size) => (
            <li key={size} className="flex items-center gap-3 text-sm">
              <span className="w-20 font-mono text-muted">n = {formatCount(size, lang)}</span>
              <span className="flex h-4 flex-1 gap-[2px]" aria-hidden="true">
                {Array.from({ length: 20 }, (_, i) => (
                  <span key={i} className="flex-1 rounded-sm" style={{ background: i === 0 ? "var(--cell-hot)" : "var(--cell-off)" }} />
                ))}
              </span>
              <span className="w-28 text-right font-mono font-semibold">→ {t(TXT.op)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
