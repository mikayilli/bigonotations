import { useId, useState } from "react";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount } from "../../lib/format";
import type { Lesson, WhyStages } from "../../data/types";
import { Card } from "../layout/ui";

const ORDER: (keyof WhyStages)[] = ["what", "times", "why", "math", "graph"];

/** The reasoning chain: What happens ↓ How many times ↓ Why ↓ Math ↓ Graph. Expandable. */
export function WhySection({ lesson, n }: { lesson: Lesson; n: number }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const vars = lesson.vars(n, (x) => formatCount(x, lang));

  return (
    <Card aria-labelledby={`${panelId}-h`}>
      <h2 id={`${panelId}-h`} className="text-lg font-semibold tracking-tight">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="mr-2 rounded-md bg-accent px-2 py-0.5 text-sm text-bg">?</span>
            {t(S.lesson.whyTitle)}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h2>
      {open && (
        <ol id={panelId} className="mt-4 space-y-0">
          {ORDER.map((key, i) => (
            <li key={key} className="relative pb-1">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-accent bg-surface text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  {i < ORDER.length - 1 && (
                    <span className="my-1 flex-1 border-l-2 border-dashed border-line" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent">{t(S.lesson.stages[key])}</div>
                  <p className={`mt-1 leading-relaxed ${key === "math" ? "rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm" : ""}`}>
                    {t(lesson.why[key], vars)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
