import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { ArrayStrip, Legend, type CellState } from "./ArrayStrip";
import type { VizProps } from "./types";

const TXT = {
  array: bi("Array with n items — the target is the last one", "n elementli massiv — hədəf sonuncudur"),
  idle: bi("Press Run and watch the loop check items one by one.", "İşə sal düyməsinə basın və dövrün elementləri bir-bir yoxlamasına baxın."),
  checking: bi("Step {k}: is arr[{i}] the target?", "Addım {k}: arr[{i}] hədəfdir?"),
  found: bi("Found it at index {i} after {k} checks.", "{i} indeksində {k} yoxlamadan sonra tapıldı."),
  checked: bi("already checked", "yoxlanılıb"),
  current: bi("checking now", "indi yoxlanılır"),
  target: bi("target", "hədəf"),
  waiting: bi("not reached yet", "hələ çatılmayıb"),
  ratioTitle: bi("Input size → work", "Giriş ölçüsü → iş"),
  item: bi("item", "element"),
  items: bi("items", "element"),
  checksWord: bi("checks", "yoxlama"),
};

const RATIO = [1, 10, 100];

export function LinearScanViz({ n, step }: VizProps) {
  const { t, lang } = useI18n();
  const state = (i: number): CellState => {
    if (step > 0 && i === step - 1) return "active";
    if (i < step - 1) return "visited";
    if (i === n - 1) return "target";
    return "idle";
  };
  const found = step >= n;
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-sm font-medium text-muted">
          {t(TXT.array)} · n = {formatCount(n, lang)}
        </div>
        <ArrayStrip
          n={n}
          cap={40}
          ariaLabel={`${t(TXT.array)}: n = ${n}`}
          cellState={state}
          cellMark={(i) => (i === n - 1 && step < n ? t(TXT.target) : null)}
        />
        <p className="mt-2 min-h-6 text-sm" aria-live="polite">
          {step === 0
            ? t(TXT.idle)
            : found
              ? t(TXT.found, { i: n - 1, k: formatCount(step, lang) })
              : t(TXT.checking, { k: formatCount(step, lang), i: step - 1 })}
        </p>
        <div className="mt-2">
          <Legend
            items={[
              { state: "visited", label: t(TXT.checked) },
              { state: "active", label: t(TXT.current) },
              { state: "target", label: t(TXT.target) },
              { state: "idle", label: t(TXT.waiting) },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted">{t(TXT.ratioTitle)}</h3>
        <ul className="space-y-1.5">
          {[...RATIO, ...(RATIO.includes(n) ? [] : [n])].map((size) => (
            <li key={size} className="flex items-center gap-3 text-sm">
              <span className="w-28 font-mono text-muted">
                {size} {t(size === 1 ? TXT.item : TXT.items)}
              </span>
              <span className="h-3 flex-1 rounded bg-surface-2" aria-hidden="true">
                <span
                  className="block h-3 rounded"
                  style={{ width: `${Math.max(1.5, (size / Math.max(n, 100)) * 100)}%`, background: "var(--c-linear)" }}
                />
              </span>
              <span className="w-28 text-right font-mono font-semibold">
                → ~{size} {t(TXT.checksWord)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
