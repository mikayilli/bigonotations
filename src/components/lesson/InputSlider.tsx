import { useId, useMemo } from "react";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { Button } from "../layout/ui";
import { formatCount } from "../../lib/format";
import { clamp } from "../../lib/math";

/** Geometric growth between slider stops on a log scale. */
const LOG_STEP = 1.06;

/** The values the slider can land on. Log scale keeps every keypress meaningful. */
export function sliderValues(min: number, max: number, scale: "linear" | "log"): number[] {
  if (scale === "linear") return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const out = [min];
  let v = min;
  while (v < max) {
    v = Math.min(max, Math.max(v + 1, Math.round(v * LOG_STEP)));
    out.push(v);
  }
  return out;
}

function nearestIndex(values: number[], v: number): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) {
    if (Math.abs(values[i]! - v) < Math.abs(values[best]! - v)) best = i;
  }
  return best;
}

interface Props {
  value: number;
  min: number;
  max: number;
  scale?: "linear" | "log";
  onChange: (n: number) => void;
  label?: string;
}

export function InputSlider({ value, min, max, scale = "linear", onChange, label }: Props) {
  const { t, lang } = useI18n();
  const id = useId();
  const values = useMemo(() => sliderValues(min, max, scale), [min, max, scale]);
  const index = nearestIndex(values, value);
  const fill = values.length > 1 ? (index / (values.length - 1)) * 100 : 0;
  const text = label ?? t(S.lesson.inputSize);

  return (
    <div>
      <div className="mb-1 flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-muted">
          {text}
        </label>
        <output htmlFor={id} className="font-mono text-2xl font-bold tabular-nums">
          n = {formatCount(value, lang)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="lab-range"
        min={0}
        max={values.length - 1}
        step={1}
        value={index}
        style={{ ["--fill" as string]: `${fill}%` }}
        aria-valuetext={`n = ${value}`}
        onChange={(e) => onChange(values[Number(e.target.value)] ?? min)}
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted">{min}</span>
        <div className="flex flex-wrap justify-center gap-1.5">
          <Button variant="secondary" aria-label={t(S.common.decrease)} disabled={value <= min} onClick={() => onChange(clamp(value - 1, min, max))}>
            −1
          </Button>
          <Button variant="secondary" aria-label={t(S.common.increase)} disabled={value >= max} onClick={() => onChange(clamp(value + 1, min, max))}>
            +1
          </Button>
          {scale === "log" && (
            <>
              <Button variant="secondary" aria-label={t(S.common.halve)} disabled={value <= min} onClick={() => onChange(clamp(Math.floor(value / 2), min, max))}>
                ÷2
              </Button>
              <Button variant="secondary" aria-label={t(S.common.double)} disabled={value >= max} onClick={() => onChange(clamp(value * 2, min, max))}>
                ×2
              </Button>
            </>
          )}
        </div>
        <span className="font-mono text-xs text-muted">{formatCount(max, lang)}</span>
      </div>
    </div>
  );
}
