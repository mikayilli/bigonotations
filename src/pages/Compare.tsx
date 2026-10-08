import { useState } from "react";
import { ComplexityGraph, type GraphSeries } from "../components/graph/ComplexityGraph";
import { Card, PageHeading, SectionTitle } from "../components/layout/ui";
import { InputSlider } from "../components/lesson/InputSlider";
import { COMPLEXITY, COMPLEXITY_ORDER } from "../data/complexities";
import { useI18n } from "../i18n";
import { S } from "../i18n/strings";
import { bi } from "../i18n/types";
import { formatCount, formatDuration } from "../lib/format";

const TXT = {
  title: bi("Compare Growth Rates", "Artım sürətlərinin müqayisəsi"),
  sub: bi(
    "All seven complexity classes on one graph. Move n and see why the differences matter more and more as input grows.",
    "Yeddi mürəkkəblik sinfi bir qrafikdə. n-i dəyişin və giriş böyüdükcə fərqlərin niyə getdikcə daha vacib olduğunu görün.",
  ),
  table: bi("Estimated operations for n = {n}", "n = {n} üçün təxmini əməliyyatlar"),
  timeCol: bi("at 1 billion ops/second", "saniyədə 1 milyard əməliyyatla"),
  timeNote: bi(
    "Illustration only: it assumes one operation takes one nanosecond.",
    "Yalnız illüstrasiya: bir əməliyyatın bir nanosaniyə çəkdiyi fərz olunur.",
  ),
  logHint: bi(
    "Each gridline is 10× more than the one below it. On a linear scale O(2ⁿ) and O(n!) would flatten everything else against the floor.",
    "Hər şəbəkə xətti altındakından 10 dəfə böyükdür. Xətti şkalada O(2ⁿ) və O(n!) qalan hər şeyi döşəməyə yapışdırardı.",
  ),
  insight: bi(
    "Doubling n from 10 to 20: O(n) does 2× the work, O(n²) 4×, O(2ⁿ) 1,024×.",
    "n-i 10-dan 20-yə ikiqat artırmaq: O(n) 2×, O(n²) 4×, O(2ⁿ) isə 1 024× çox iş görür.",
  ),
};

const MIN = 1;
const MAX = 30;

export function Compare() {
  const { t, lang } = useI18n();
  const [n, setN] = useState(10);
  const [logY, setLogY] = useState(true);

  const series: GraphSeries[] = COMPLEXITY_ORDER.map((type) => ({
    id: type,
    label: COMPLEXITY[type].notation,
    fn: COMPLEXITY[type].growth,
    color: COMPLEXITY[type].color,
    dashed: type === "logarithmic" || type === "linearithmic",
    marker: type === "linear",
  }));

  const rows = COMPLEXITY_ORDER.map((type) => ({ type, value: COMPLEXITY[type].growth(n) }));
  const maxLog = Math.max(...rows.map((r) => Math.log10(Math.max(1, r.value))), 1e-9);
  const approx = (v: number) => (Number.isInteger(v) || !Number.isFinite(v) ? "" : "~");

  return (
    <div className="space-y-6">
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />
      <Card>
        <InputSlider value={n} min={MIN} max={MAX} onChange={setN} />
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle>{t(S.graph.title)}</SectionTitle>
            <div role="group" aria-label={t(S.graph.yScale)} className="flex rounded-lg border border-line p-0.5 text-xs font-semibold">
              {[true, false].map((isLog) => (
                <button
                  key={String(isLog)}
                  type="button"
                  aria-pressed={logY === isLog}
                  onClick={() => setLogY(isLog)}
                  className={`min-h-8 rounded-md px-2.5 ${logY === isLog ? "bg-accent text-bg" : "text-muted hover:text-ink"}`}
                >
                  {t(isLog ? S.graph.logScale : S.graph.linScale)}
                </button>
              ))}
            </div>
          </div>
          <ComplexityGraph
            series={series}
            n={n}
            xMin={MIN}
            xMax={MAX}
            autoZoom={false}
            logY={logY}
            endLabels
            height={380}
            yLabel={t(S.graph.yTime)}
            ariaLabel={t(TXT.title)}
            onSelectN={setN}
          />
          {logY && <p className="mt-2 text-xs text-muted">{t(TXT.logHint)}</p>}
        </Card>

        <Card>
          <SectionTitle sub={t(TXT.timeNote)}>{t(TXT.table, { n })}</SectionTitle>
          <table className="w-full text-sm">
            <thead className="sr-only">
              <tr>
                <th>Big-O</th>
                <th>{t(S.lesson.operations)}</th>
                <th>{t(TXT.timeCol)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ type, value }) => (
                <tr key={type} className="border-t border-line first:border-0">
                  <th scope="row" className="w-28 py-2 text-left font-mono font-bold" style={{ color: COMPLEXITY[type].color }}>
                    {COMPLEXITY[type].notation}
                  </th>
                  <td className="py-2 pr-2">
                    <div className="h-3 rounded bg-surface-2" aria-hidden="true">
                      <div
                        className="h-3 rounded"
                        style={{ width: `${Math.max(2, (Math.log10(Math.max(1, value)) / maxLog) * 100)}%`, background: COMPLEXITY[type].color, transition: "width .3s" }}
                      />
                    </div>
                  </td>
                  <td className="w-28 py-2 text-right font-mono font-semibold tabular-nums">
                    {approx(value)}
                    {formatCount(value, lang)}
                  </td>
                  <td className="hidden w-24 py-2 pl-2 text-right text-xs text-muted sm:table-cell">{formatDuration(value / 1e9, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-right text-[11px] text-muted">log₁₀ bars · {t(TXT.timeCol)}</p>
          <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-sm">{t(TXT.insight)}</p>
        </Card>
      </div>
    </div>
  );
}
