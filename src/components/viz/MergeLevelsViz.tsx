import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { mergeLevels } from "../../lib/math";
import type { VizProps } from "./types";

const MAX_SEGMENTS = 64;

const TXT = {
  title: bi("Split in half, level by level — then merge back up", "Səviyyə-səviyyə yarıya böl — sonra yuxarıya birləşdir"),
  level: bi("level {k}", "səviyyə {k}"),
  pieces: bi("{p} piece(s)", "{p} parça"),
  touched: bi("{n} items", "{n} element"),
  idle: bi(
    "Press Run: merging starts at the bottom and every level touches all n items.",
    "İşə sal düyməsinə basın: birləşdirmə aşağıdan başlayır və hər səviyyə bütün n elementə toxunur.",
  ),
  progress: bi(
    "{done} of {levels} levels merged → {done} × {n} = {ops} items processed so far.",
    "{levels} səviyyədən {done} birləşdirilib → {done} × {n} = {ops} element indiyə qədər emal olunub.",
  ),
  all: bi(
    "{levels} levels × {n} items per level = {ops} operations.",
    "{levels} səviyyə × səviyyədə {n} element = {ops} əməliyyat.",
  ),
  whyLog: bi("Why log n? The size is halved every level: ", "Niyə log n? Ölçü hər səviyyədə yarıya bölünür: "),
  whyN: bi("Why n? Every level still holds all {n} items.", "Niyə n? Hər səviyyə yenə bütün {n} elementi saxlayır."),
  simplified: bi("Rows with many pieces are drawn with at most {cap} blocks.", "Çox parçalı sətirlər ən çox {cap} blokla çəkilir."),
};

/** Sizes of the pieces at each recursion level of merge sort. */
function levelSizes(n: number, levels: number): number[][] {
  const out: number[][] = [[n]];
  for (let k = 1; k <= levels; k++) {
    const next: number[] = [];
    for (const s of out[k - 1]!) {
      if (s > 1) next.push(Math.ceil(s / 2), Math.floor(s / 2));
      else next.push(s);
    }
    out.push(next);
  }
  return out;
}

export function MergeLevelsViz({ n, step, total }: VizProps) {
  const { t, lang } = useI18n();
  const fmt = (x: number) => formatCount(x, lang);
  const levels = total; // mergeLevels(n)
  const rows = useMemo(() => levelSizes(n, mergeLevels(n)), [n]);
  const sizeChain = Array.from({ length: Math.min(levels + 1, 6) }, (_, k) => Math.max(1, Math.round(n / Math.pow(2, k)))).join(" → ");
  const simplified = rows.some((r) => r.length > MAX_SEGMENTS);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted">{t(TXT.title)}</h3>
      <ol className="space-y-1.5">
        {rows.map((sizes, k) => {
          const merged = k >= levels - step + 1 && k >= 1; // bottom-up merging
          const drawn = sizes.length > MAX_SEGMENTS ? Array.from({ length: MAX_SEGMENTS }, () => 1) : sizes;
          return (
            <li key={k} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs text-muted">{t(TXT.level, { k })}</span>
              <div
                className="flex h-7 min-w-0 flex-1 gap-[2px]"
                role="img"
                aria-label={`${t(TXT.level, { k })}: ${t(TXT.pieces, { p: sizes.length })}`}
              >
                {drawn.map((s, i) => (
                  <div
                    key={i}
                    className="cell rounded-[4px]"
                    style={{
                      flexGrow: s,
                      flexBasis: 0,
                      background: merged ? "var(--c-linearithmic)" : "var(--cell-off)",
                      border: merged ? "none" : "1px solid var(--border)",
                    }}
                  />
                ))}
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-[11px] text-muted">
                {t(TXT.pieces, { p: fmt(sizes.length) })}
              </span>
              <span className="w-20 shrink-0 text-right font-mono text-[11px] font-semibold" style={{ opacity: merged ? 1 : 0.35 }}>
                {merged ? "✓ " : ""}
                {t(TXT.touched, { n: fmt(n) })}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="min-h-10 text-sm" aria-live="polite">
        {step === 0
          ? t(TXT.idle)
          : step >= levels
            ? t(TXT.all, { levels, n: fmt(n), ops: fmt(levels * n) })
            : t(TXT.progress, { done: step, levels, n: fmt(n), ops: fmt(step * n) })}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm">
          {t(TXT.whyLog)}
          <span className="font-mono">{sizeChain}</span>
        </p>
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm">{t(TXT.whyN, { n: fmt(n) })}</p>
      </div>
      {simplified && <p className="text-xs text-muted">{t(TXT.simplified, { cap: MAX_SEGMENTS })}</p>}
    </div>
  );
}
