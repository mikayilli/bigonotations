import { useMemo, useState } from "react";
import { COMPLEXITY } from "../../data/complexities";
import type { Lesson } from "../../data/types";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { clamp } from "../../lib/math";
import { useStepper } from "../../lib/useStepper";
import { ComplexityGraph, type GraphSeries } from "../graph/ComplexityGraph";
import { Card, SectionTitle } from "../layout/ui";
import { LessonViz } from "../viz/LessonViz";
import { AhaSummary } from "./AhaSummary";
import { CodeBlock } from "./CodeBlock";
import { FlowStrip } from "./FlowStrip";
import { FormulaExplanation } from "./FormulaExplanation";
import { GraphShapeSection } from "./GraphShapeSection";
import { InputSlider } from "./InputSlider";
import { OperationCounter } from "./OperationCounter";
import { StepperControls } from "./StepperControls";
import { WhySection } from "./WhySection";

/**
 * One reusable lesson page. Everything on it — counter, formula, visualization, graph,
 * explanation — is driven by the same `n`, so they always move together.
 */
export function ComplexityLesson({ lesson }: { lesson: Lesson }) {
  const { t, lang } = useI18n();
  const [n, setN] = useState(lesson.range.initial);
  const [autoZoom, setAutoZoom] = useState(true);
  const { min, max, scale } = lesson.range;
  const info = COMPLEXITY[lesson.type];

  const total = lesson.steps(n);
  const stepper = useStepper(total);
  const count = lesson.count(n);

  const series: GraphSeries[] = useMemo(
    () =>
      lesson.graph.map((s) => ({
        id: s.id,
        label: t(s.label),
        fn: s.fn,
        color: s.marker ? info.color : "var(--muted)",
        dashed: s.dashed,
        marker: s.marker,
      })),
    [lesson.graph, info.color, t],
  );

  const active = lesson.activeLines?.(stepper.step, n) ?? [];
  const isTime = lesson.metric === "time";
  const setClamped = (v: number) => setN(clamp(Math.round(v), min, max));

  return (
    <article className="space-y-6">
      <header>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-mono text-4xl font-bold tracking-tight" style={{ color: info.color }}>
            {lesson.notation}
          </h2>
          <p className="text-xl font-semibold">{t(lesson.name)}</p>
        </div>
        <p className="mt-2 max-w-3xl text-muted">{t(lesson.tagline)}</p>
        <p className="mt-1 max-w-3xl text-sm font-medium text-accent">{t(S.lesson.growthWhy)}</p>
      </header>

      <FlowStrip lesson={lesson} n={n} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <InputSlider value={n} min={min} max={max} scale={scale} onChange={setN} />
          </Card>

          <Card>
            <SectionTitle>{t(S.lesson.visualization)}</SectionTitle>
            <div className="mb-4">
              <StepperControls stepper={stepper} />
            </div>
            <LessonViz viz={lesson.viz} n={n} step={stepper.step} total={total} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <OperationCounter
                label={t(isTime ? S.lesson.operations : S.lesson.memory)}
                value={count}
                caption={`n = ${n}`}
              />
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <div className="text-sm font-medium text-muted">{t(S.lesson.flowFormula)}</div>
                <div className="font-mono text-2xl font-bold">{lesson.formula.short(n, (x) => x.toLocaleString(lang === "az" ? "az-AZ" : "en-US"))}</div>
              </div>
            </div>
            <div className="mt-4">
              <FormulaExplanation lesson={lesson} n={n} />
            </div>
          </Card>

          <Card>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <SectionTitle>{t(S.graph.title)}</SectionTitle>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={autoZoom} onChange={(e) => setAutoZoom(e.target.checked)} />
                {t(S.graph.autoZoom)}
              </label>
            </div>
            <ComplexityGraph
              series={series}
              n={n}
              xMin={min}
              xMax={max}
              autoZoom={autoZoom}
              yLabel={t(isTime ? S.graph.yTime : S.graph.ySpace)}
              ariaLabel={`${lesson.notation} — ${t(lesson.name)}: ${t(lesson.shape)}`}
              onSelectN={setClamped}
              endLabels={lesson.graph.length > 1}
            />
          </Card>

          <Card>
            <SectionTitle sub={t(lesson.code.algorithm)}>{t(S.lesson.code)}</SectionTitle>
            <CodeBlock code={lesson.code.text} active={active} label={t(S.lesson.code)} />
            <p className="mt-3 text-sm text-muted">
              <strong className="text-ink">{t(S.lesson.inPractice)}:</strong> {t(lesson.inPractice)}
            </p>
          </Card>
        </div>
      </div>

      <WhySection lesson={lesson} n={n} />
      <GraphShapeSection lesson={lesson} n={n} />
      <AhaSummary lesson={lesson} />
    </article>
  );
}
