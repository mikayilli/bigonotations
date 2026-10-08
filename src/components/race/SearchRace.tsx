import { useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { bi } from "../../i18n/types";
import { binarySearchTrace, linearSearchTrace } from "../../lib/algorithms";
import { formatCount } from "../../lib/format";
import { useStepper } from "../../lib/useStepper";
import { InputSlider } from "../lesson/InputSlider";
import { StepperControls } from "../lesson/StepperControls";
import { Card } from "../layout/ui";
import { ArrayStrip, Legend, type CellState } from "../viz/ArrayStrip";

const TXT = {
  target: bi("Where is the target?", "Hədəf haradadır?"),
  first: bi("First item", "İlk element"),
  middle: bi("Middle", "Orta"),
  last: bi("Last item", "Sonuncu element"),
  missing: bi("Not in the array", "Massivdə yoxdur"),
  linear: bi("Linear Search", "Xətti axtarış"),
  binary: bi("Binary Search", "İkili axtarış"),
  ops: bi("operations", "əməliyyat"),
  finished: bi("finished", "bitdi"),
  running: bi("running…", "işləyir…"),
  same: bi("Both algorithms get the same sorted array and the same target.", "Hər iki alqoritm eyni sıralanmış massiv və eyni hədəf alır."),
  summary: bi(
    "Binary search needed {b} operations, linear search needed {a} — about {r}× fewer.",
    "İkili axtarış {b} əməliyyat, xətti axtarış isə {a} əməliyyat tələb etdi — təxminən {r}× az.",
  ),
  summarySame: bi("For this input both needed {a} operation(s).", "Bu giriş üçün hər ikisi {a} əməliyyat tələb etdi."),
  checked: bi("checked", "yoxlanılıb"),
  now: bi("now", "indi"),
  possible: bi("still possible", "hələ mümkün"),
  out: bi("thrown away", "atılıb"),
  want: bi("target", "hədəf"),
};

type Where = "first" | "middle" | "last" | "missing";
const WHERES: Where[] = ["first", "middle", "last", "missing"];

function targetIndex(where: Where, n: number): number {
  return where === "first" ? 0 : where === "middle" ? Math.floor(n / 2) : where === "last" ? n - 1 : -1;
}

export function SearchRace() {
  const { t, lang } = useI18n();
  const [n, setN] = useState(500);
  const [where, setWhere] = useState<Where>("last");
  const target = targetIndex(where, n);

  const lin = useMemo(() => linearSearchTrace(n, target), [n, target]);
  const bin = useMemo(() => binarySearchTrace(n, target), [n, target]);
  const total = Math.max(lin.length, bin.length);
  const stepper = useStepper(total);

  const linDone = Math.min(stepper.step, lin.length);
  const binDone = Math.min(stepper.step, bin.length);
  const binCur = binDone > 0 ? bin[binDone - 1] : undefined;
  const fmt = (x: number) => formatCount(x, lang);

  const linState = (i: number): CellState => {
    if (linDone > 0 && i === lin[linDone - 1]) return "active";
    if (i < (lin[linDone - 1] ?? -1)) return "visited";
    if (i === target) return "target";
    return "idle";
  };
  const binState = (i: number): CellState => {
    if (!binCur) return i === target ? "target" : "idle";
    if (i === binCur.mid) return "active";
    if (i < binCur.lo || i > binCur.hi) return "dropped";
    return i === target ? "target" : "range";
  };

  const lane = (name: string, notation: string, done: number, len: number, strip: React.ReactNode, color: string) => (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {notation}
          </span>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-bold tabular-nums">{fmt(done)}</div>
          <div className="text-xs text-muted">
            {t(TXT.ops)} · {done >= len ? "✓ " + t(TXT.finished) : t(TXT.running)}
          </div>
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${name}: ${done} / ${len}`}>
        <div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: color }} />
      </div>
      {strip}
    </Card>
  );

  const ratio = bin.length > 0 ? Math.round(lin.length / bin.length) : 1;

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <InputSlider value={n} min={8} max={1000} scale="log" onChange={setN} />
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-muted">{t(TXT.target)}</legend>
          <div className="flex flex-wrap gap-2">
            {WHERES.map((w) => (
              <label
                key={w}
                className={`flex min-h-10 cursor-pointer items-center rounded-lg border px-3.5 text-sm font-medium ${where === w ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface"}`}
              >
                <input type="radio" name="where" className="sr-only" checked={where === w} onChange={() => setWhere(w)} />
                {t(TXT[w])}
              </label>
            ))}
          </div>
        </fieldset>
        <StepperControls stepper={stepper} />
        <p className="text-xs text-muted">
          {t(TXT.same)} {t(S.common.educational)}
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {lane(
          t(TXT.linear),
          "O(n)",
          linDone,
          lin.length,
          <>
            <ArrayStrip n={n} cap={60} ariaLabel={t(TXT.linear)} cellState={linState} />
            <Legend items={[{ state: "visited", label: t(TXT.checked) }, { state: "active", label: t(TXT.now) }, { state: "target", label: t(TXT.want) }]} />
          </>,
          "var(--c-linear)",
        )}
        {lane(
          t(TXT.binary),
          "O(log n)",
          binDone,
          bin.length,
          <>
            <ArrayStrip n={n} cap={60} ariaLabel={t(TXT.binary)} cellState={binState} />
            <Legend items={[{ state: "range", label: t(TXT.possible) }, { state: "active", label: t(TXT.now) }, { state: "dropped", label: t(TXT.out) }]} />
          </>,
          "var(--c-logarithmic)",
        )}
      </div>

      <p className="rounded-xl bg-accent-soft px-4 py-3 font-medium">
        {ratio > 1 ? t(TXT.summary, { b: fmt(bin.length), a: fmt(lin.length), r: fmt(ratio) }) : t(TXT.summarySame, { a: fmt(lin.length) })}
      </p>
    </div>
  );
}
