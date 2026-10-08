import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount } from "../../lib/format";
import type { Lesson } from "../../data/types";

/** The symbolic formula, then the same formula with the current n plugged in. */
export function FormulaExplanation({ lesson, n }: { lesson: Lesson; n: number }) {
  const { t, lang } = useI18n();
  const f = (x: number) => formatCount(x, lang);
  const numeric = lesson.formula.numeric(n, f);
  const resultLine = numeric[numeric.length - 1];
  const inputLines = numeric.slice(0, -1);

  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm leading-7">
      <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-muted">{t(S.lesson.formula)}</div>
      <div className="space-y-0.5">
        {lesson.formula.symbolic.map((line, i) => (
          <div key={i} className={i === 0 ? "" : "pl-6 text-muted"}>
            {t(line)}
          </div>
        ))}
      </div>
      <hr className="my-2 border-line" />
      <div className="space-y-0.5 text-muted">
        {inputLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="mt-1 text-lg font-bold text-ink" aria-live="polite">
        {resultLine}
      </div>
    </div>
  );
}
