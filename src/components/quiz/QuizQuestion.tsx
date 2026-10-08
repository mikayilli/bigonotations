import { useMemo, useState } from "react";
import { COMPLEXITY } from "../../data/complexities";
import type { QuizQuestion as Question } from "../../data/quiz";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { useStepper } from "../../lib/useStepper";
import { CodeBlock } from "../lesson/CodeBlock";
import { InputSlider } from "../lesson/InputSlider";
import { StepperControls } from "../lesson/StepperControls";
import { Card, SectionTitle } from "../layout/ui";

const TXT = {
  ask: bi("What is the time complexity?", "Zaman mürəkkəbliyi nədir?"),
  correct: bi("Correct!", "Düzgündür!"),
  wrong: bi("Not quite — the answer is {answer}.", "Tam deyil — cavab {answer}-dir."),
  yours: bi("your answer", "sizin cavabınız"),
  right: bi("correct answer", "düzgün cavab"),
  reasoningTitle: bi("Why? Follow the reasoning", "Niyə? Mühakiməni izləyin"),
  runTitle: bi("Watch the code run", "Kodun işləməsinə baxın"),
  runHint: bi(
    "Every highlighted step below is one main operation — count them yourself.",
    "Aşağıdakı hər işıqlandırılmış addım bir əsas əməliyyatdır — özünüz sayın.",
  ),
  tableTitle: bi("Measured operations (the code really ran)", "Ölçülmüş əməliyyatlar (kod həqiqətən işlədi)"),
  nCol: bi("n", "n"),
  opsCol: bi("operations", "əməliyyatlar"),
  ratioCol: bi("× previous row", "× əvvəlki sətir"),
  capped: bi("Showing the first {cap} of {total} operations.", "{total} əməliyyatdan ilk {cap}-i göstərilir."),
  count: bi("operations counted", "sayılan əməliyyat"),
};

const REPLAY_CAP = 2000;

function record(run: Question["run"], n: number, cap: number) {
  const lines: number[] = [];
  let total = 0;
  run(n, (line) => {
    total++;
    if (lines.length < cap) lines.push(line);
  });
  return { lines, total };
}

export function QuizQuestion({ question, index, count, onAnswer, onNext, isLast }: {
  question: Question;
  index: number;
  count: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const { t, lang } = useI18n();
  const [picked, setPicked] = useState<string | null>(null);
  const [n, setN] = useState(Math.min(6, question.demoMax));

  const answered = picked !== null;
  const correct = picked === question.answer;

  const run = useMemo(() => record(question.run, n, REPLAY_CAP), [question, n]);
  const stepper = useStepper(run.lines.length);
  const activeLine = stepper.step > 0 ? run.lines[stepper.step - 1] : undefined;

  const table = useMemo(() => question.tableNs.map((size) => ({ size, ops: record(question.run, size, 0).total })), [question]);

  const choose = (type: string) => {
    if (answered) return;
    setPicked(type);
    onAnswer(type === question.answer);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {index + 1} / {count}
        </div>
        <CodeBlock code={question.code} active={activeLine ? [activeLine] : []} label="code" />
        <h2 className="mt-5 text-lg font-semibold">{t(TXT.ask)}</h2>
        <div role="group" aria-label={t(TXT.ask)} className="mt-3 grid gap-2 sm:grid-cols-2">
          {question.options.map((opt) => {
            const isAnswer = opt === question.answer;
            const isPicked = picked === opt;
            const state = !answered ? "" : isAnswer ? "border-ok bg-ok/10" : isPicked ? "border-bad bg-bad/10" : "opacity-60";
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => choose(opt)}
                className={`flex min-h-12 items-center justify-between rounded-xl border-2 px-4 py-2 text-left font-mono text-base font-semibold transition-colors ${
                  answered ? state : "border-line bg-surface hover:border-accent hover:bg-accent-soft"
                }`}
              >
                <span>{COMPLEXITY[opt].notation}</span>
                {answered && isAnswer && <span className="font-sans text-xs text-ok">✓ {t(TXT.right)}</span>}
                {answered && isPicked && !isAnswer && <span className="font-sans text-xs text-bad">✗ {t(TXT.yours)}</span>}
              </button>
            );
          })}
        </div>
        {answered && (
          <p className={`mt-4 font-semibold ${correct ? "text-ok" : "text-bad"}`} role="status">
            {correct ? "✓ " + t(TXT.correct) : "✗ " + t(TXT.wrong, { answer: COMPLEXITY[question.answer].notation })}
          </p>
        )}
      </Card>

      {answered && (
        <>
          <Card>
            <SectionTitle>{t(TXT.reasoningTitle)}</SectionTitle>
            <ol className="flex flex-col items-stretch gap-1">
              {question.chain.map((step, i) => (
                <li key={i} className="contents">
                  <div
                    className={`pop-in rounded-xl border px-4 py-2.5 ${i === 3 ? "border-accent bg-accent-soft font-mono text-lg font-bold" : "border-line bg-surface-2"}`}
                    style={{ animationDelay: `${i * 350}ms` }}
                  >
                    {t(step)}
                  </div>
                  {i < 3 && (
                    <span className="pop-in text-center text-muted" aria-hidden="true" style={{ animationDelay: `${i * 350 + 150}ms` }}>
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {question.note && <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-sm leading-relaxed">{t(question.note)}</p>}
          </Card>

          <Card>
            <SectionTitle sub={t(TXT.runHint)}>{t(TXT.runTitle)}</SectionTitle>
            <div className="space-y-4">
              <InputSlider value={n} min={2} max={question.demoMax} onChange={setN} />
              <StepperControls stepper={stepper} />
              <p className="font-mono text-sm">
                {formatCount(run.total, lang)} {t(TXT.count)} · n = {n}
              </p>
              {run.total > REPLAY_CAP && <p className="text-xs text-muted">{t(TXT.capped, { cap: REPLAY_CAP, total: formatCount(run.total, lang) })}</p>}
            </div>
            <h3 className="mb-2 mt-6 text-sm font-semibold text-muted">{t(TXT.tableTitle)}</h3>
            <table className="w-full max-w-md text-sm">
              <thead className="text-left text-xs text-muted">
                <tr>
                  <th className="py-1">{t(TXT.nCol)}</th>
                  <th>{t(TXT.opsCol)}</th>
                  <th>{t(TXT.ratioCol)}</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {table.map((row, i) => {
                  const prev = table[i - 1];
                  return (
                    <tr key={row.size} className="border-t border-line">
                      <td className="py-1.5">{formatCount(row.size, lang)}</td>
                      <td className="font-semibold">{formatCount(row.ops, lang)}</td>
                      <td className="text-muted">{prev ? `× ${+(row.ops / prev.ops).toFixed(2)}` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-semibold text-bg hover:opacity-90"
          >
            {isLast ? "✓" : "→"} {t(isLast ? RESULT_LABEL : NEXT_LABEL)}
          </button>
        </>
      )}
    </div>
  );
}

const NEXT_LABEL = bi("Next question", "Növbəti sual");
const RESULT_LABEL = bi("See my score", "Nəticəmə bax");
