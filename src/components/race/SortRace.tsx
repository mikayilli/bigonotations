import { useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { bi, type Bi } from "../../i18n/types";
import { countSort, frameIndexAt, recordSort, shuffledData, SORT_NAMES, type SortName } from "../../lib/algorithms";
import { formatCount } from "../../lib/format";
import { useStepper } from "../../lib/useStepper";
import { Button, Card } from "../layout/ui";
import { InputSlider } from "../lesson/InputSlider";
import { StepperControls } from "../lesson/StepperControls";

const INFO: Record<SortName, { name: Bi; notation: string; color: string }> = {
  bubble: { name: bi("Bubble Sort", "Qabarcıqlı sıralama"), notation: "O(n²)", color: "var(--c-quadratic)" },
  insertion: { name: bi("Insertion Sort", "Daxiletmə ilə sıralama"), notation: "O(n²)", color: "var(--c-exponential)" },
  merge: { name: bi("Merge Sort", "Birləşdirmə ilə sıralama"), notation: "O(n log n)", color: "var(--c-linearithmic)" },
  quick: { name: bi("Quick Sort", "Sürətli sıralama"), notation: "O(n log n) avg", color: "var(--c-logarithmic)" },
};

const TXT = {
  shuffle: bi("New random data", "Yeni təsadüfi data"),
  same: bi("All four sort the same shuffled data.", "Dördü də eyni qarışdırılmış datanı sıralayır."),
  ops: bi("comparisons", "müqayisə"),
  done: bi("sorted", "sıralandı"),
  running: bi("sorting…", "sıralayır…"),
  doubleTitle: bi("What happens when n doubles?", "n ikiqat artanda nə baş verir?"),
  doubleHint: bi(
    "≈ 4× means quadratic growth; slightly more than 2× means n log n.",
    "≈ 4× kvadratik artım deməkdir; 2×-dən bir az çox n log n deməkdir.",
  ),
  algo: bi("Algorithm", "Alqoritm"),
  factor: bi("grows by", "artım"),
  quickNote: bi(
    "Quick sort is O(n²) in its worst case, but on random data it behaves like n log n.",
    "Quick sort ən pis halda O(n²)-dir, lakin təsadüfi datada n log n kimi davranır.",
  ),
};

function Bars({ values, color, label }: { values: number[]; color: string; label: string }) {
  const n = values.length;
  const max = Math.max(...values, 1);
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-28 w-full rounded-lg bg-surface-2" role="img" aria-label={label}>
      {values.map((v, i) => (
        <rect key={i} x={(i / n) * 100 + 0.1} y={40 - (v / max) * 38} width={100 / n - 0.2} height={(v / max) * 38} fill={color} />
      ))}
    </svg>
  );
}

export function SortRace() {
  const { t, lang } = useI18n();
  const [n, setN] = useState(40);
  const [seed, setSeed] = useState(7);
  const fmt = (x: number) => formatCount(x, lang);

  const data = useMemo(() => shuffledData(n, seed), [n, seed]);
  const runs = useMemo(() => Object.fromEntries(SORT_NAMES.map((name) => [name, recordSort(name, data)])) as Record<SortName, ReturnType<typeof recordSort>>, [data]);
  const total = Math.max(...SORT_NAMES.map((s) => runs[s].ops));
  const stepper = useStepper(total);

  const doubling = useMemo(() => {
    const bigger = shuffledData(n * 2, seed);
    return SORT_NAMES.map((name) => {
      const a = runs[name].ops;
      const b = countSort(name, bigger);
      return { name, a, b, factor: a > 0 ? b / a : 1 };
    });
  }, [n, seed, runs]);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <InputSlider value={n} min={8} max={120} onChange={setN} />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setSeed((s) => s + 1)}>🔀 {t(TXT.shuffle)}</Button>
          <span className="text-sm text-muted">{t(TXT.same)}</span>
        </div>
        <StepperControls stepper={stepper} />
        <p className="text-xs text-muted">{t(S.common.educational)}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {SORT_NAMES.map((name) => {
          const run = runs[name];
          const ops = Math.min(stepper.step, run.ops);
          const frame = run.frames[frameIndexAt(run, stepper.step)] ?? data;
          const info = INFO[name];
          return (
            <Card key={name} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{t(info.name)}</h3>
                  <span className="font-mono text-xs font-bold" style={{ color: info.color }}>
                    {info.notation}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold tabular-nums">{fmt(ops)}</div>
                  <div className="text-xs text-muted">
                    {t(TXT.ops)} · {ops >= run.ops ? "✓ " + t(TXT.done) : t(TXT.running)}
                  </div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                <div className="h-full rounded-full" style={{ width: `${(ops / total) * 100}%`, background: info.color }} />
              </div>
              <Bars values={frame} color={info.color} label={`${t(info.name)}: ${fmt(ops)} ${t(TXT.ops)}`} />
            </Card>
          );
        })}
      </div>
      <p className="text-sm text-muted">{t(TXT.quickNote)}</p>

      <Card>
        <h3 className="text-lg font-semibold">{t(TXT.doubleTitle)}</h3>
        <p className="mb-3 text-sm text-muted">{t(TXT.doubleHint)}</p>
        <table className="w-full max-w-xl text-sm">
          <thead className="text-left text-xs text-muted">
            <tr>
              <th className="py-1">{t(TXT.algo)}</th>
              <th>n = {n}</th>
              <th>n = {n * 2}</th>
              <th>{t(TXT.factor)}</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {doubling.map((row) => (
              <tr key={row.name} className="border-t border-line">
                <td className="py-1.5 font-sans font-medium">{t(INFO[row.name].name)}</td>
                <td>{fmt(row.a)}</td>
                <td>{fmt(row.b)}</td>
                <td className="font-bold">× {+row.factor.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
