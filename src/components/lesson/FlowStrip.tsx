import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount } from "../../lib/format";
import type { Lesson } from "../../data/types";

/** CODE → OPERATIONS → FORMULA → GRAPH, with the live values for the current n. */
export function FlowStrip({ lesson, n }: { lesson: Lesson; n: number }) {
  const { t, lang } = useI18n();
  const f = (x: number) => formatCount(x, lang);
  const items = [
    { label: t(S.lesson.flowCode), value: t(lesson.code.algorithm) },
    { label: t(S.lesson.flowOps), value: f(lesson.count(n)) },
    { label: t(S.lesson.flowFormula), value: lesson.formula.short(n, f), mono: true },
    { label: t(S.lesson.flowGraph), value: t(lesson.shape) },
  ];
  return (
    <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:gap-0" aria-label="Code → Operations → Formula → Graph">
      {items.map((item, i) => (
        <li key={item.label} className="contents">
          <div className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">{item.label}</div>
            <div className={`truncate text-sm font-semibold ${item.mono ? "font-mono" : ""}`} title={item.value}>
              {item.value}
            </div>
          </div>
          {i < items.length - 1 && (
            <span className="self-center px-1.5 text-center text-muted" aria-hidden="true">
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
