import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount } from "../../lib/format";
import type { Lesson } from "../../data/types";
import { COMPLEXITY } from "../../data/complexities";
import { Card, SectionTitle } from "../layout/ui";
import { GrowthDeltaChart } from "../graph/GrowthDeltaChart";

/** "Why does the graph have this shape?" — table of sizes + the increment chart. */
export function GraphShapeSection({ lesson, n }: { lesson: Lesson; n: number }) {
  const { t, lang } = useI18n();
  const marker = lesson.graph.find((s) => s.marker) ?? lesson.graph[0]!;
  const color = COMPLEXITY[lesson.type].color;

  const rows = lesson.graphWhy.sizes.map((size) => ({ size, ops: lesson.count(size) }));
  const maxLog = Math.max(...rows.map((r) => Math.log10(Math.max(1, r.ops))), 1e-9);

  return (
    <Card>
      <SectionTitle>{t(S.lesson.graphWhyTitle)}</SectionTitle>
      <p className="mb-4 leading-relaxed">{t(lesson.graphWhy.lead)}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted">{t(S.lesson.sizeTable)}</h3>
          <table className="w-full text-sm">
            <thead className="sr-only">
              <tr>
                <th>n</th>
                <th>{t(lesson.metric === "time" ? S.lesson.operations : S.lesson.memory)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ size, ops }) => (
                <tr key={size} className="border-b border-line last:border-0">
                  <td className="w-24 py-2 font-mono text-muted">n = {formatCount(size, lang)}</td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 flex-1 rounded bg-surface-2" aria-hidden="true">
                        <div
                          className="h-3 rounded"
                          style={{
                            width: `${Math.max(2, (Math.log10(Math.max(1, ops)) / maxLog) * 100)}%`,
                            background: color,
                          }}
                        />
                      </div>
                      <span className="w-28 text-right font-mono font-semibold tabular-nums">→ {formatCount(ops, lang)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-xs text-muted">log₁₀ bar length</p>
          <ul className="mt-3 space-y-1 text-sm">
            {lesson.graphWhy.points.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="text-accent">
                  ▸
                </span>
                {t(p)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted">{t(S.lesson.deltaTitle)}</h3>
          <GrowthDeltaChart fn={marker.fn} from={lesson.range.min} to={lesson.range.max} current={n} color={color} />
          <p className="mt-2 rounded-lg bg-accent-soft px-3 py-2 text-sm leading-relaxed">{t(lesson.graphWhy.deltaCaption)}</p>
        </div>
      </div>
      <p className="mt-4 border-t border-line pt-3 text-sm leading-relaxed">
        <strong>{t(S.lesson.stages.graph)}: </strong>
        {t(lesson.why.graph, lesson.vars(n, (x) => formatCount(x, lang)))}
      </p>
    </Card>
  );
}
