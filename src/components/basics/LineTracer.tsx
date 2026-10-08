import { useMemo, useState } from "react";
import { PROGRAMS } from "../../data/basics";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { useStepper } from "../../lib/useStepper";
import { Card, SectionTitle } from "../layout/ui";
import { CodeBlock } from "../lesson/CodeBlock";
import { InputSlider } from "../lesson/InputSlider";
import { StepperControls } from "../lesson/StepperControls";
import { MemoryDesk } from "./MemoryDesk";

const TXT = {
  title: bi("3. Watch a program from line 1 to the last line", "3. Proqrama 1-ci sətirdən sonuncuya qədər baxın"),
  sub: bi(
    "Press Run (or the step-forward button). Each time the computer runs a line, we pay 1 step. Each new box on the desk is 1 unit of memory.",
    "İşə sal (və ya irəli addım) düyməsinə basın. Kompüter hər dəfə bir sətri icra edəndə 1 addım ödəyirik. Masadakı hər yeni qutu 1 yaddaş vahididir.",
  ),
  program: bi("Pick a program", "Proqram seçin"),
  size: bi("How many items?", "Neçə element?"),
  now: bi("What just happened", "İndicə nə baş verdi"),
  before: bi("Nothing has run yet. Press ▶ Run, or the step button, to run line 1.", "Hələ heç nə işləməyib. 1-ci sətri icra etmək üçün ▶ İşə sal və ya addım düyməsinə basın."),
  steps: bi("steps so far (TIME)", "indiyə qədər addımlar (ZAMAN)"),
  tableTitle: bi("Bill for every line", "Hər sətrin hesabı"),
  colLine: bi("line", "sətir"),
  colRuns: bi("runs so far", "indiyə qədər icra"),
  colTotal: bi("runs in total", "cəmi icra"),
  free: bi("0 steps — just a bracket", "0 addım — sadəcə mötərizə"),
  ruleTime: bi("TIME rule: every line, every time it runs = 1 step.", "ZAMAN qaydası: hər sətir, hər icra olunanda = 1 addım."),
  ruleMem: bi("MEMORY rule: every box on the desk = 1 unit.", "YADDAŞ qaydası: masadakı hər qutu = 1 vahid."),
  resultTitle: bi("The total bill", "Yekun hesab"),
  timeHead: bi("Time (steps)", "Zaman (addımlar)"),
  memHead: bi("Memory (boxes)", "Yaddaş (qutular)"),
  addUp: bi("Add up all lines:", "Bütün sətirləri topla:"),
  withN: bi("With n = {n}:", "n = {n} üçün:"),
  matches: bi("= {total} steps. The trace counted exactly {count}. ✓", "= {total} addım. İzləmə dəqiq {count} saydı. ✓"),
  bigO: bi("Big-O keeps only the part that grows", "Big-O yalnız böyüyən hissəni saxlayır"),
  waitFinish: bi("Run the program to the end to see the total bill.", "Yekun hesabı görmək üçün proqramı sona qədər icra edin."),
  maxBoxes: bi("Most boxes at once: {k}", "Eyni anda ən çox qutu: {k}"),
};

export function LineTracer() {
  const { t, lang } = useI18n();
  const [pid, setPid] = useState(PROGRAMS[0]!.id);
  const program = PROGRAMS.find((p) => p.id === pid)!;
  const [sizes, setSizes] = useState<Record<string, number>>(() => Object.fromEntries(PROGRAMS.map((p) => [p.id, p.range.initial])));
  const n = sizes[pid]!;

  const events = useMemo(() => program.trace(n), [program, n]);
  // Restart from line 1 whenever the program or n changes.
  const stepper = useStepper(events.length, "start");
  const step = stepper.step;
  const event = step > 0 ? events[step - 1]! : null;
  const prev = step > 1 ? events[step - 2]! : null;
  const done = step >= events.length;

  const runsSoFar = (lineNo: number) => events.slice(0, step).filter((e) => e.line === lineNo).length;
  const peak = events.slice(0, step).reduce((m, e) => Math.max(m, e.vars.length + (e.built?.items.length ?? 0)), 0);
  const fmt = (x: number) => formatCount(x, lang);
  const codeLines = program.code.split("\n");
  const totalSteps = program.timeTotal(n);

  return (
    <Card className="space-y-6">
      <SectionTitle sub={t(TXT.sub)}>{t(TXT.title)}</SectionTitle>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t(TXT.program)}>
        {PROGRAMS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === pid}
            onClick={() => setPid(p.id)}
            className={`min-h-10 rounded-lg border px-3.5 text-sm font-semibold ${p.id === pid ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:text-ink"}`}
          >
            {t(p.name)}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <InputSlider label={t(TXT.size)} value={n} min={program.range.min} max={program.range.max} onChange={(v) => setSizes((s) => ({ ...s, [pid]: v }))} />
          <CodeBlock code={program.code} active={event ? [event.line] : []} label={t(program.name)} />
          <StepperControls stepper={stepper} />
          <p className="text-xs text-muted">
            {t(TXT.ruleTime)} {t(TXT.ruleMem)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border-2 border-accent bg-accent-soft px-4 py-3" aria-live="polite">
            <div className="text-xs font-bold uppercase tracking-widest text-accent">{t(TXT.now)}</div>
            <p className="mt-1 min-h-12 leading-relaxed">
              {event ? (
                <>
                  <span className="mr-2 rounded bg-accent px-1.5 py-0.5 font-mono text-xs text-bg">#{event.line}</span>
                  {t(event.note)}
                </>
              ) : (
                t(TXT.before)
              )}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold tabular-nums">{fmt(step)}</span>
            <span className="text-sm text-muted">{t(TXT.steps)}</span>
          </div>

          <MemoryDesk event={event} prev={prev} n={n} givenInput={program.givenInput} peak={peak} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted">{t(TXT.tableTitle)}</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="py-1">{t(TXT.colLine)}</th>
                <th>{t(TXT.colRuns)}</th>
                <th>{t(TXT.colTotal)}</th>
              </tr>
            </thead>
            <tbody>
              {codeLines.map((text, i) => {
                const info = program.lines[i]!;
                const active = event?.line === i + 1;
                return (
                  <tr key={i} className={`border-t border-line ${active ? "bg-accent-soft" : ""}`}>
                    <td className="py-1.5 pr-3 font-mono text-xs">
                      <span className="mr-2 text-muted">{i + 1}</span>
                      {text.trim()}
                    </td>
                    {info.worker ? (
                      <>
                        <td className="font-mono font-semibold tabular-nums">{runsSoFar(i + 1)}</td>
                        <td className="font-mono text-muted">
                          {info.runs} = {fmt(info.runsFor(n))}
                        </td>
                      </>
                    ) : (
                      <td colSpan={2} className="text-xs text-muted">
                        {t(TXT.free)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {done ? (
        <div className="space-y-4 rounded-2xl border-2 border-accent p-4">
          <h3 className="text-lg font-bold">🧾 {t(TXT.resultTitle)}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl bg-surface-2 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">{t(TXT.timeHead)}</div>
              <p className="text-sm text-muted">{t(TXT.addUp)}</p>
              <p className="font-mono text-sm">{program.timeFormula}</p>
              <p className="text-sm text-muted">{t(TXT.withN, { n })}</p>
              <p className="font-mono text-sm font-semibold">{t(TXT.matches, { total: fmt(totalSteps), count: fmt(events.length) })}</p>
              <p className="pt-1 font-mono text-2xl font-bold text-accent">{program.timeBigO}</p>
              <p className="text-sm leading-relaxed">{t(program.timeWhy)}</p>
            </div>
            <div className="space-y-2 rounded-xl bg-surface-2 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">{t(TXT.memHead)}</div>
              <p className="font-mono text-sm">{program.memoryFormula}</p>
              <p className="font-mono text-sm font-semibold">{t(TXT.maxBoxes, { k: peak })}</p>
              <p className="pt-1 font-mono text-2xl font-bold text-accent">{program.memoryBigO}</p>
              <p className="text-sm leading-relaxed">{t(program.memoryWhy)}</p>
            </div>
          </div>
          <p className="text-sm font-medium">{t(TXT.bigO)}</p>
        </div>
      ) : (
        <p className="text-sm text-muted">{t(TXT.waitFinish)}</p>
      )}
    </Card>
  );
}
