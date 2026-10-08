import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount } from "../../lib/format";
import { SPEEDS, type Stepper } from "../../lib/useStepper";
import { Button } from "../layout/ui";

const Icon = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PLAY = "M8 5v14l11-7z";
const PAUSE = "M6 5h4v14H6zM14 5h4v14h-4z";
const BACK = "M6 6h2v12H6zM9.5 12L18 6v12z";
const FWD = "M16 6h2v12h-2zM6 6l8.5 6L6 18z";
const RESET = "M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z";
const END = "M5 6l8 6-8 6zM14 6l8 6-8 6z";

export function StepperControls({ stepper, unitLabel }: { stepper: Stepper; unitLabel?: string }) {
  const { t, lang } = useI18n();
  const { step, total, playing } = stepper;
  const done = step >= total;
  const pct = total > 0 ? (step / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={stepper.toggle} aria-label={playing ? t(S.lesson.pause) : done ? t(S.lesson.replay) : t(S.lesson.run)}>
          <Icon d={playing ? PAUSE : PLAY} />
          {playing ? t(S.lesson.pause) : done ? t(S.lesson.replay) : t(S.lesson.run)}
        </Button>
        <Button aria-label={t(S.lesson.stepBack)} title={t(S.lesson.stepBack)} onClick={stepper.prev} disabled={step <= 0}>
          <Icon d={BACK} />
        </Button>
        <Button aria-label={t(S.lesson.stepForward)} title={t(S.lesson.stepForward)} onClick={stepper.next} disabled={done}>
          <Icon d={FWD} />
        </Button>
        <Button aria-label={t(S.lesson.reset)} title={t(S.lesson.reset)} onClick={stepper.reset} disabled={step === 0 && !playing}>
          <Icon d={RESET} />
        </Button>
        <Button aria-label={t(S.lesson.finish)} title={t(S.lesson.finish)} onClick={stepper.finish} disabled={done}>
          <Icon d={END} />
        </Button>
        <div role="group" aria-label={t(S.lesson.speed)} className="ml-auto flex rounded-lg border border-line p-0.5 text-xs font-semibold">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={stepper.speed === s}
              onClick={() => stepper.setSpeed(s)}
              className={`min-h-8 rounded-md px-2 ${stepper.speed === s ? "bg-accent text-bg" : "text-muted hover:text-ink"}`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label={t(S.lesson.executed, { k: formatCount(step, lang), total: formatCount(total, lang) })}
          className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
        >
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%`, transition: playing ? "none" : "width .2s" }} />
        </div>
        <span className="whitespace-nowrap font-mono text-xs text-muted">
          {t(S.lesson.executed, { k: formatCount(step, lang), total: formatCount(total, lang) })}
          {unitLabel ? ` ${unitLabel}` : ""}
        </span>
      </div>
    </div>
  );
}
