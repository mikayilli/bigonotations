import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount } from "../../lib/format";
import { sampleRange } from "../../lib/math";

const MAX_BARS = 36;

/**
 * Bars of f(k+1) − f(k): how much NEW work one more input adds.
 * Equal bars → straight line, growing bars → curve bends up, shrinking bars → curve flattens.
 */
export function GrowthDeltaChart({
  fn,
  from,
  to,
  current,
  color,
}: {
  fn: (n: number) => number;
  from: number;
  to: number;
  current: number;
  color: string;
}) {
  const { t, lang } = useI18n();
  const last = Math.max(from + 1, Math.min(to, Math.max(current, from + 8)));
  const ks = sampleRange(from, last, MAX_BARS);
  const deltas = ks.map((k) => ({ k, d: fn(k + 1) - fn(k) }));
  const finite = deltas.filter((x) => Number.isFinite(x.d));
  const maxD = Math.max(1e-9, ...finite.map((x) => x.d));

  const H = 110;
  const barW = 100 / ks.length;

  return (
    <figure>
      <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="h-32 w-full" role="img" aria-label={t(S.lesson.deltaAxis)}>
        <line x1={0} x2={100} y1={H - 0.5} y2={H - 0.5} stroke="var(--muted)" strokeWidth={0.4} vectorEffect="non-scaling-stroke" />
        {finite.map(({ k, d }, i) => {
          const h = Math.max(d <= 0 ? 0 : 1.5, (Math.max(0, d) / maxD) * (H - 6));
          const isCurrent = k === current;
          return (
            <rect
              key={k}
              className="cell"
              x={i * barW + barW * 0.12}
              y={H - h}
              width={barW * 0.76}
              height={h}
              rx={0.6}
              fill={isCurrent ? "var(--accent)" : color}
              opacity={isCurrent ? 1 : 0.75}
            />
          );
        })}
      </svg>
      <figcaption className="mt-1 flex items-start justify-between gap-3 text-xs text-muted">
        <span>
          k = {ks[0]} … {ks[ks.length - 1]}
        </span>
        <span className="text-right font-mono">
          max Δ ≈ {formatCount(finite.reduce((m, x) => Math.max(m, x.d), 0), lang)}
        </span>
      </figcaption>
    </figure>
  );
}
