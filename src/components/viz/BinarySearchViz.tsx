import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { binarySearchTrace } from "../../lib/algorithms";
import { formatCount } from "../../lib/format";
import { halvingSequence } from "../../lib/math";
import { ArrayStrip, Legend, type CellState } from "./ArrayStrip";
import type { VizProps } from "./types";

const TXT = {
  array: bi("Sorted array — the target is not in it (worst case)", "Sıralanmış massiv — hədəf onda yoxdur (ən pis hal)"),
  idle: bi("Press Run: each step looks at the middle and throws half away.", "İşə sal düyməsinə basın: hər addım ortaya baxır və yarısını atır."),
  step: bi(
    "Step {k}: look at the middle (index {mid}). {left} items still in play; {gone} already thrown away.",
    "Addım {k}: ortaya (indeks {mid}) bax. {left} element hələ oyundadır; {gone} artıq atılıb.",
  ),
  ended: bi("The range is empty: the target is not here. {k} comparisons in total.", "Aralıq boşdur: hədəf burada yoxdur. Cəmi {k} müqayisə."),
  active: bi("middle (compared)", "orta (müqayisə olunan)"),
  range: bi("still possible", "hələ mümkün"),
  dropped: bi("thrown away", "atılıb"),
  ladderTitle: bi("Halving ladder", "Yarılama nərdivanı"),
  ladderCols: bi("remaining · removed so far", "qalan · indiyə qədər atılan"),
  stepWord: bi("step", "addım"),
  ask: bi(
    "How many times can {n} be halved before 1 is left? That count is log₂({n}) ≈ {log}.",
    "{n} 1 qalana qədər neçə dəfə yarıya bölünə bilər? Bu say log₂({n}) ≈ {log}-dir.",
  ),
};

export function BinarySearchViz({ n, step }: VizProps) {
  const { t, lang } = useI18n();
  const trace = useMemo(() => binarySearchTrace(n, -1), [n]);
  const seq = useMemo(() => halvingSequence(n), [n]);
  const cur = step > 0 ? trace[Math.min(step, trace.length) - 1] : undefined;
  const fmt = (x: number) => formatCount(x, lang);

  const state = (i: number): CellState => {
    if (!cur) return "idle";
    if (i === cur.mid) return "active";
    if (i < cur.lo || i > cur.hi) return "dropped";
    return "range";
  };

  const ladderDone = Math.min(seq.length - 1, step);
  const maxRows = 12;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-sm font-medium text-muted">
          {t(TXT.array)} · n = {fmt(n)}
        </div>
        <ArrayStrip
          n={n}
          cap={64}
          ariaLabel={`${t(TXT.array)}: n = ${n}`}
          cellState={state}
          cellMark={(i) => (cur && i === cur.lo && i !== cur.mid ? "lo" : cur && i === cur.hi && i !== cur.mid ? "hi" : null)}
        />
        <p className="mt-2 min-h-12 text-sm" aria-live="polite">
          {!cur
            ? t(TXT.idle)
            : step >= trace.length && cur.lo === cur.hi
              ? t(TXT.ended, { k: trace.length })
              : t(TXT.step, { k: step, mid: cur.mid, left: fmt(cur.hi - cur.lo + 1), gone: fmt(n - (cur.hi - cur.lo + 1)) })}
        </p>
        <div className="mt-1">
          <Legend
            items={[
              { state: "active", label: t(TXT.active) },
              { state: "range", label: t(TXT.range) },
              { state: "dropped", label: t(TXT.dropped) },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-muted">
          {t(TXT.ladderTitle)} <span className="font-normal">({t(TXT.ladderCols)})</span>
        </h3>
        <ol className="space-y-1">
          {seq.slice(0, maxRows).map((size, k) => {
            const reached = k <= ladderDone;
            return (
              <li key={k} className="flex items-center gap-2 text-sm" style={{ opacity: reached ? 1 : 0.35 }}>
                <span className="w-14 shrink-0 font-mono text-xs text-muted">
                  {t(TXT.stepWord)} {k}
                </span>
                <span className="h-4 flex-1" aria-hidden="true">
                  <span
                    className="cell block h-4 rounded"
                    style={{
                      width: `${Math.max(1.5, (size / n) * 100)}%`,
                      background: k === ladderDone ? "var(--cell-hot)" : "var(--c-logarithmic)",
                      transition: "width .35s",
                    }}
                  />
                </span>
                <span className="w-32 shrink-0 text-right font-mono text-xs">
                  {fmt(size)} · −{fmt(n - size)}
                </span>
              </li>
            );
          })}
        </ol>
        {seq.length > maxRows && <p className="mt-1 text-xs text-muted">… {seq.length - maxRows}</p>}
        <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-sm">{t(TXT.ask, { n: fmt(n), log: +Math.log2(n).toFixed(2) })}</p>
      </div>
    </div>
  );
}
