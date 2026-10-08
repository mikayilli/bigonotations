import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import type { Lesson } from "../../data/types";

/** Compact "You discovered…" recap that restates the reasoning, not just the definition. */
export function AhaSummary({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  const rows: [string, string][] = [
    [t(S.lesson.ahaInput), t(lesson.aha.input)],
    [t(S.lesson.ahaWork), t(lesson.aha.work)],
    [t(S.lesson.ahaGrowth), t(lesson.aha.growth)],
    [t(S.lesson.ahaComplexity), lesson.aha.complexity],
    [t(S.lesson.ahaGraph), t(lesson.aha.graph)],
  ];
  return (
    <section aria-labelledby="aha-h" className="rounded-2xl border-2 border-accent bg-accent-soft p-5">
      <h2 id="aha-h" className="text-lg font-bold tracking-tight">
        💡 {t(S.lesson.ahaTitle)}
      </h2>
      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
        {rows.map(([k, v], i) => (
          <div key={k} className="contents">
            <dt className="text-sm font-semibold text-muted">{k}</dt>
            <dd className={i === 3 ? "font-mono text-xl font-bold" : i === 2 ? "font-mono" : ""}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
