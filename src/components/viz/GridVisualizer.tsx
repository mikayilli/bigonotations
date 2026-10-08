import { useId, useState } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import type { VizProps } from "./types";
import { Legend } from "./ArrayStrip";

/** Past this many rows/columns every operation can't be drawn, so blocks are aggregated. */
export const GRID_CAP = 30;
const VIEW = 420;

const TXT = {
  timeAria: bi("Grid of operations: n rows by n columns", "Əməliyyat şəbəkəsi: n sətir, n sütun"),
  memAria: bi("Grid of memory slots: n rows by n columns", "Yaddaş xanaları şəbəkəsi: n sətir, n sütun"),
  outer: bi("outer loop i → rows", "xarici dövr i → sətirlər"),
  inner: bi("inner loop j → columns", "daxili dövr j → sütunlar"),
  row: bi("rows", "sətirlər"),
  col: bi("columns", "sütunlar"),
  now: bi("Now running: i = {i}, j = {j}", "İndi icra olunur: i = {i}, j = {j}"),
  idle: bi("Press Run to fill the grid one operation at a time.", "Şəbəkəni əməliyyat-əməliyyat doldurmaq üçün İşə sal düyməsinə basın."),
  memIdle: bi("Press Run to allocate the slots row by row.", "Xanaları sətir-sətir ayırmaq üçün İşə sal düyməsinə basın."),
  memNow: bi("Allocated {k} of {total} slots", "{total} xanadan {k} ayrılıb"),
  done: bi("Each cell is one operation (1 cell = 1 run of doSomething()).", "Hər xana bir əməliyyatdır (1 xana = doSomething()-in 1 icrası)."),
  memDone: bi("Each cell is one memory slot.", "Hər xana bir yaddaş xanasıdır."),
  showNext: bi("Show what n + 1 adds", "n + 1-in nə əlavə etdiyini göstər"),
  nextInfo: bi(
    "Going from n = {n} to {next} adds a new row and column: {added} new cells (the hatched L-shape).",
    "n = {n}-dən {next}-ə keçid yeni sətir və sütun əlavə edir: {added} yeni xana (ştrixli L-forma).",
  ),
  nextDisabled: bi("(available for n < {cap})", "(n < {cap} üçün mövcuddur)"),
  done_: bi("done", "icra olunub"),
  active: bi("running now", "indi icra olunur"),
  todo: bi("not yet", "hələ yox"),
  added: bi("added by n + 1", "n + 1 ilə əlavə olunan"),
  block: bi("Each drawn block stands for about {k} × {k} cells.", "Hər çəkilmiş blok təxminən {k} × {k} xananı təmsil edir."),
};

type Mode = "time" | "memory";

export function GridVisualizer({ n, step, mode }: VizProps & { mode: Mode }) {
  const { t, lang } = useI18n();
  const patternId = useId();
  const [showNext, setShowNext] = useState(false);
  const canShowNext = n < GRID_CAP;
  const withNext = showNext && canShowNext;

  const side = Math.min(n, GRID_CAP);
  const bucketed = n > GRID_CAP;
  const drawSide = withNext ? side + 1 : side;
  const cell = VIEW / drawSide;
  const gap = cell > 14 ? 2 : cell > 7 ? 1 : 0.5;
  const labelRoom = n <= 12 && !withNext ? 22 : 0;

  const lastIdx = step - 1;
  const curI = Math.floor(lastIdx / n);
  const curJ = lastIdx % n;

  const rangeOf = (k: number) => {
    const from = bucketed ? Math.floor((k * n) / side) : k;
    const to = bucketed ? Math.max(from, Math.floor(((k + 1) * n) / side) - 1) : k;
    return [from, to] as const;
  };

  const rects = [];
  for (let r = 0; r < drawSide; r++) {
    for (let c = 0; c < drawSide; c++) {
      const isNew = withNext && (r === side || c === side);
      let fill = "var(--cell-off)";
      let stroke = "none";
      if (isNew) {
        fill = `url(#${patternId})`;
        stroke = "var(--cell-hot)";
      } else {
        const [r0, r1] = rangeOf(r);
        const [c0, c1] = rangeOf(c);
        const first = r0 * n + c0;
        const last = r1 * n + c1;
        const isActive = step > 0 && curI >= r0 && curI <= r1 && curJ >= c0 && curJ <= c1;
        if (isActive) {
          fill = "var(--cell-hot)";
          stroke = "var(--text)";
        } else if (last < step) fill = "var(--cell-on)";
        else if (first < step) fill = "color-mix(in srgb, var(--cell-on) 45%, var(--cell-off))";
      }
      rects.push(
        <rect
          key={`${r}-${c}`}
          className="cell"
          x={labelRoom + c * cell + gap / 2}
          y={labelRoom + r * cell + gap / 2}
          width={Math.max(0.5, cell - gap)}
          height={Math.max(0.5, cell - gap)}
          rx={cell > 10 ? 3 : 1}
          fill={fill}
          stroke={stroke}
          strokeWidth={stroke === "none" ? 0 : cell > 10 ? 2 : 1}
        />,
      );
    }
  }

  const total = n * n;
  const added = 2 * n + 1;

  return (
    <div className="space-y-3">
      <div className="mx-auto w-full max-w-[440px]">
        <svg
          viewBox={`0 0 ${VIEW + labelRoom} ${VIEW + labelRoom}`}
          className="w-full"
          role="img"
          aria-label={`${t(mode === "time" ? TXT.timeAria : TXT.memAria)} — n = ${n}`}
        >
          <defs>
            <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--surface)" />
              <rect width="3" height="6" fill="var(--cell-hot)" />
            </pattern>
          </defs>
          {labelRoom > 0 &&
            Array.from({ length: n }, (_, k) => (
              <g key={k} fontSize={Math.min(11, cell * 0.5)} fill="var(--muted)" textAnchor="middle" fontFamily="var(--font-mono)">
                <text x={labelRoom + k * cell + cell / 2} y={labelRoom - 7}>
                  {k}
                </text>
                <text x={labelRoom - 8} y={labelRoom + k * cell + cell / 2 + 4} textAnchor="end">
                  {k}
                </text>
              </g>
            ))}
          {rects}
        </svg>
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>↓ {t(mode === "time" ? TXT.outer : TXT.row)}</span>
          <span>→ {t(mode === "time" ? TXT.inner : TXT.col)}</span>
        </div>
      </div>

      <p className="min-h-6 text-center text-sm" aria-live="polite">
        {step === 0
          ? t(mode === "time" ? TXT.idle : TXT.memIdle)
          : step >= total
            ? t(mode === "time" ? TXT.done : TXT.memDone)
            : mode === "time"
              ? t(TXT.now, { i: curI, j: curJ })
              : t(TXT.memNow, { k: formatCount(step, lang), total: formatCount(total, lang) })}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legend
          items={[
            { state: "visited", label: t(TXT.done_) },
            { state: "active", label: t(TXT.active) },
            { state: "idle", label: t(TXT.todo) },
            ...(withNext ? [{ state: "target" as const, label: t(TXT.added) }] : []),
          ]}
        />
        <label className={`flex items-center gap-2 text-sm ${canShowNext ? "" : "opacity-60"}`}>
          <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={withNext} disabled={!canShowNext} onChange={(e) => setShowNext(e.target.checked)} />
          {t(TXT.showNext)} {!canShowNext && t(TXT.nextDisabled, { cap: GRID_CAP })}
        </label>
      </div>
      {withNext && (
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm">
          {t(TXT.nextInfo, { n: formatCount(n, lang), next: formatCount(n + 1, lang), added: formatCount(added, lang) })}
        </p>
      )}
      {bucketed && <p className="text-xs text-muted">{t(TXT.block, { k: Math.round(n / side) })}</p>}
    </div>
  );
}

const BUILD = {
  title: bi("Build n² step by step", "n²-ni addım-addım qur"),
  outer: bi("Outer loop: i runs n times", "Xarici dövr: i n dəfə işləyir"),
  inner: bi("Inner loop: j runs n times (for ONE value of i)", "Daxili dövr: j n dəfə işləyir (i-nin BİR qiyməti üçün)"),
  both: bi("Together: n passes × n steps each", "Birlikdə: n keçid × hər birində n addım"),
  capped: bi("(drawn for n ≤ {cap})", "(n ≤ {cap} üçün çəkilib)"),
  eq: bi("n × n = n²", "n × n = n²"),
};
const BUILD_CAP = 12;

/** Three mini panels: the outer loop alone, one inner loop alone, then both combined. */
export function LoopBuildup({ n }: { n: number }) {
  const { t } = useI18n();
  const m = Math.min(n, BUILD_CAP);
  const cells = (rows: number, cols: number, label: string) => (
    <div
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${cols}, 14px)` }}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} className="h-3.5 w-3.5 rounded-[3px]" style={{ background: "var(--cell-on)" }} />
      ))}
    </div>
  );
  const panel = (title: string, body: React.ReactNode, caption: string) => (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl border border-line bg-surface p-3 text-center">
      <div className="text-xs font-semibold">{title}</div>
      <div className="flex min-h-12 items-center">{body}</div>
      <div className="font-mono text-sm font-bold">{caption}</div>
    </div>
  );
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-muted">
        {t(BUILD.title)} {n > BUILD_CAP && <span className="font-normal">{t(BUILD.capped, { cap: BUILD_CAP })}</span>}
      </h3>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-stretch">
        {panel(t(BUILD.outer), cells(m, 1, `i: ${n}`), `n = ${n}`)}
        <span className="self-center text-lg font-bold text-muted" aria-hidden="true">
          ×
        </span>
        {panel(t(BUILD.inner), cells(1, m, `j: ${n}`), `n = ${n}`)}
        <span className="self-center text-lg font-bold text-muted" aria-hidden="true">
          =
        </span>
        {panel(t(BUILD.both), cells(m, m, `${n} × ${n}`), `${n} × ${n} = ${n * n}`)}
      </div>
    </div>
  );
}
