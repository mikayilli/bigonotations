import type { CSSProperties } from "react";

export type CellState = "idle" | "visited" | "active" | "target" | "dropped" | "range";

/** Highest priority first: an aggregated block shows its most important member. */
const PRIORITY: CellState[] = ["active", "target", "visited", "range", "idle", "dropped"];

const STYLE: Record<CellState, CSSProperties> = {
  idle: { background: "var(--cell-off)", border: "2px solid transparent" },
  visited: { background: "color-mix(in srgb, var(--cell-on) 38%, var(--cell-off))", border: "2px solid transparent" },
  active: { background: "var(--cell-hot)", border: "2px solid var(--text)" },
  target: { background: "var(--cell-off)", border: "2px dashed var(--cell-hot)" },
  dropped: {
    background: "repeating-linear-gradient(135deg, transparent 0 4px, var(--border) 4px 6px)",
    border: "2px solid var(--border)",
    opacity: 0.55,
  },
  range: { background: "color-mix(in srgb, var(--cell-on) 22%, var(--surface))", border: "2px solid var(--cell-on)" },
};

interface Props {
  n: number;
  /** Maximum number of blocks drawn; larger arrays are bucketed. */
  cap: number;
  cellState: (index: number) => CellState;
  /** Text inside a cell (only when every item is drawn). */
  cellLabel?: (index: number) => string;
  /** Small caption above a cell, e.g. "lo", "mid". */
  cellMark?: (index: number) => string | null;
  ariaLabel: string;
}

export function ArrayStrip({ n, cap, cellState, cellLabel, cellMark, ariaLabel }: Props) {
  const count = Math.min(n, cap);
  const bucketed = n > cap;
  const cells = Array.from({ length: count }, (_, b) => {
    const from = bucketed ? Math.floor((b * n) / count) : b;
    const to = bucketed ? Math.max(from, Math.floor(((b + 1) * n) / count) - 1) : b;
    let best: CellState = "dropped";
    let mark: string | null = null;
    for (let i = from; i <= to; i++) {
      const s = cellState(i);
      if (PRIORITY.indexOf(s) < PRIORITY.indexOf(best)) best = s;
      mark = mark ?? cellMark?.(i) ?? null;
    }
    return { from, to, state: best, mark };
  });

  const roomy = count <= 24;
  return (
    <div role="img" aria-label={ariaLabel} className="w-full overflow-hidden">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {cells.map((c, i) => (
          <div key={i} className="flex min-w-0 flex-col items-center">
            <div className="h-5 text-[10px] font-bold leading-5 text-ink" aria-hidden="true">
              {c.state === "active" ? "▼" : (c.mark ?? "")}
            </div>
            <div
              className="cell flex h-9 w-full items-center justify-center rounded-md font-mono text-[11px] font-semibold"
              style={STYLE[c.state]}
            >
              {roomy && !bucketed ? (cellLabel ? cellLabel(c.from) : c.from) : ""}
            </div>
          </div>
        ))}
      </div>
      {bucketed && (
        <p className="mt-1 text-center text-[11px] text-muted" aria-hidden="true">
          1 block ≈ {Math.round(n / count)} items
        </p>
      )}
    </div>
  );
}

export function Legend({ items }: { items: { state: CellState; label: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-3.5 rounded-sm" style={STYLE[it.state]} aria-hidden="true" />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
