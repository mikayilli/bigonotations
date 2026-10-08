import { useId, useMemo, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { formatCount, formatTick } from "../../lib/format";
import { useTween } from "../../lib/hooks";
import { clamp } from "../../lib/math";

export interface GraphSeries {
  id: string;
  label: string;
  fn: (n: number) => number;
  color: string;
  dashed?: boolean;
  /** The curve the current-n dot sits on. */
  marker?: boolean;
}

interface Props {
  series: GraphSeries[];
  n: number;
  xMin: number;
  xMax: number;
  /** Zoom the x-axis so the current n fills most of the plot. */
  autoZoom?: boolean;
  logY?: boolean;
  yLabel: string;
  ariaLabel: string;
  onSelectN?: (n: number) => void;
  /** Write each series' name at the right end of its curve (used when several are shown). */
  endLabels?: boolean;
  height?: number;
}

const W = 640;
const PAD = { top: 18, right: 16, bottom: 58, left: 58 };
/** Above this many integer points we sample evenly instead of at every n. */
const MAX_POINTS = 240;
const DOT_MARKERS_BELOW = 41;

function niceTicks(max: number, target = 5): number[] {
  if (!(max > 0)) return [0];
  const raw = max / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 1e-9; v += step) ticks.push(+v.toPrecision(12));
  return ticks;
}

function logTicks(maxExp: number): number[] {
  const step = Math.max(1, Math.ceil(maxExp / 6));
  const out: number[] = [];
  for (let e = 0; e <= maxExp; e += step) out.push(Math.pow(10, e));
  return out;
}

export function ComplexityGraph({
  series,
  n,
  xMin,
  xMax,
  autoZoom = true,
  logY = false,
  yLabel,
  ariaLabel,
  onSelectN,
  endLabels = false,
  height = 320,
}: Props) {
  const { t, lang } = useI18n();
  const uid = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const H = height;
  const right = endLabels ? 92 : PAD.right;
  const plotW = W - PAD.left - right;
  const plotH = H - PAD.top - PAD.bottom;

  const targetEnd = autoZoom ? clamp(Math.max(Math.ceil(n * 1.5), Math.min(xMax, 10)), xMin + 1, xMax) : xMax;
  const end = useTween(targetEnd, 350);

  const sampleFrom = Math.max(1, xMin <= 1 ? 1 : xMin);

  const curves = useMemo(() => {
    const span = Math.ceil(end) - sampleFrom;
    const integer = span <= MAX_POINTS;
    const count = integer ? Math.ceil(end) - sampleFrom + 1 : MAX_POINTS;
    return series.map((s) => {
      const pts: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const x = integer ? sampleFrom + i : sampleFrom + ((end - sampleFrom) * i) / (count - 1);
        if (x > end + 1e-9) break;
        const y = s.fn(integer ? x : Math.round(x));
        if (!Number.isFinite(y)) break;
        pts.push([x, y]);
      }
      return pts;
    });
  }, [series, end, sampleFrom]);

  let yMaxRaw = 1;
  for (const pts of curves) for (const [, y] of pts) yMaxRaw = Math.max(yMaxRaw, y);

  const yTicks = logY ? logTicks(Math.ceil(Math.log10(Math.max(10, yMaxRaw)))) : niceTicks(yMaxRaw * 1.08);
  const yTop = logY ? Math.max(...yTicks) : Math.max(...yTicks, yMaxRaw);
  const xTicks = niceTicks(end, 6);

  const sx = (x: number) => PAD.left + (x / end) * plotW;
  const sy = (y: number) => {
    if (logY) {
      const v = Math.log10(Math.max(1, y)) / Math.log10(yTop);
      return PAD.top + plotH - v * plotH;
    }
    return PAD.top + plotH - (y / yTop) * plotH;
  };

  const markerIdx = Math.max(0, series.findIndex((s) => s.marker));
  const markerSeries = series[markerIdx] ?? series[0];
  const markerValue = markerSeries ? markerSeries.fn(n) : 0;
  const markerFinite = Number.isFinite(markerValue);

  const pathFor = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`).join(" ");

  const toN = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const vx = ((clientX - rect.left) / rect.width) * W;
    const raw = ((vx - PAD.left) / plotW) * end;
    return clamp(Math.round(raw), xMin, xMax);
  };

  const showDots = end < DOT_MARKERS_BELOW && series.length === 1;
  const hoverN = hover;
  const hoverVals =
    hoverN !== null ? series.map((s) => ({ s, v: s.fn(hoverN) })).filter((o) => Number.isFinite(o.v)) : [];

  const tipLines = hoverN !== null ? [`n = ${hoverN}`, ...hoverVals.map(({ s, v }) => `${series.length > 1 ? s.label + ": " : ""}${formatCount(v, lang)}`)] : [];
  const tipW = 14 + Math.max(...tipLines.map((l) => l.length), 6) * 6.6;
  const tipH = 10 + tipLines.length * 15;

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={`w-full select-none ${onSelectN ? "cursor-crosshair" : ""}`}
        style={{ touchAction: "pan-y" }}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={(e) => setHover(toN(e.clientX))}
        onPointerLeave={() => setHover(null)}
        onPointerDown={(e) => {
          const v = toN(e.clientX);
          if (v !== null && onSelectN) onSelectN(v);
        }}
      >
        <defs>
          <clipPath id={`${uid}-clip`}>
            <rect x={PAD.left} y={PAD.top - 4} width={plotW} height={plotH + 8} />
          </clipPath>
        </defs>

        {/* grid + y axis */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={PAD.left + plotW} y1={sy(v)} y2={sy(v)} stroke="var(--border)" strokeWidth={1} />
            <text x={PAD.left - 8} y={sy(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted)">
              {formatTick(v)}
            </text>
          </g>
        ))}
        {xTicks.map((v) => (
          <g key={v}>
            <line x1={sx(v)} x2={sx(v)} y1={PAD.top + plotH} y2={PAD.top + plotH + 4} stroke="var(--muted)" />
            <text x={sx(v)} y={PAD.top + plotH + 17} textAnchor="middle" fontSize={11} fill="var(--muted)">
              {formatTick(v)}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--muted)" />
        <line x1={PAD.left} x2={PAD.left + plotW} y1={PAD.top + plotH} y2={PAD.top + plotH} stroke="var(--muted)" />
        <text x={PAD.left + plotW / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="var(--muted)">
          {t(S.graph.x)}
        </text>
        <text transform={`translate(14 ${PAD.top + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill="var(--muted)">
          {yLabel}
        </text>

        <g clipPath={`url(#${uid}-clip)`}>
          {curves.map((pts, i) => {
            const s = series[i]!;
            return (
              <g key={s.id}>
                <path
                  d={pathFor(pts)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.marker || series.length > 1 ? 2.5 : 2}
                  strokeDasharray={s.dashed ? "6 5" : undefined}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {showDots &&
                  s.marker &&
                  pts.map(([x, y]) => <circle key={x} cx={sx(x)} cy={sy(y)} r={2.6} fill={s.color} />)}
              </g>
            );
          })}
        </g>

        {endLabels &&
          curves.map((pts, i) => {
            const last = pts[pts.length - 1];
            if (!last) return null;
            const s = series[i]!;
            return (
              <text key={s.id} x={sx(last[0]) + 6} y={clamp(sy(last[1]) + 4, PAD.top + 8, PAD.top + plotH)} fontSize={11} fontWeight={600} fill={s.color}>
                {s.label}
              </text>
            );
          })}

        {/* current n marker */}
        {markerFinite && n <= end && (
          <g>
            <line x1={sx(n)} x2={sx(n)} y1={sy(markerValue)} y2={PAD.top + plotH} stroke="var(--accent)" strokeDasharray="3 4" opacity={0.8} />
            <line x1={PAD.left} x2={sx(n)} y1={sy(markerValue)} y2={sy(markerValue)} stroke="var(--accent)" strokeDasharray="3 4" opacity={0.8} />
            <circle cx={sx(n)} cy={sy(markerValue)} r={7} fill="var(--surface)" stroke="var(--accent)" strokeWidth={3} />
            <text
              x={clamp(sx(n), PAD.left + 28, PAD.left + plotW - 28)}
              y={PAD.top + plotH + 31}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill="var(--accent)"
            >
              n = {n}
            </text>
          </g>
        )}
        {!markerFinite && (
          <text x={PAD.left + plotW - 6} y={PAD.top + 14} textAnchor="end" fontSize={11} fill="var(--warn)">
            {t(S.graph.tooLarge)}
          </text>
        )}

        {/* hover read-out */}
        {hoverN !== null && hoverVals[0] && (
          <g pointerEvents="none">
            <line x1={sx(hoverN)} x2={sx(hoverN)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--muted)" opacity={0.55} />
            {hoverVals.map(({ s, v }) => (
              <circle key={s.id} cx={sx(hoverN)} cy={sy(v)} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={1.5} />
            ))}
            <g transform={`translate(${sx(hoverN) > PAD.left + plotW - tipW - 12 ? sx(hoverN) - tipW - 10 : sx(hoverN) + 10} ${PAD.top + 6})`}>
              <rect width={tipW} height={tipH} rx={6} fill="var(--surface)" stroke="var(--border)" />
              {tipLines.map((line, i) => (
                <text key={i} x={8} y={17 + i * 15} fontSize={11} fontFamily="var(--font-mono)" fill="var(--text)">
                  {line}
                </text>
              ))}
            </g>
          </g>
        )}
      </svg>
      {onSelectN && <p className="mt-1 text-center text-xs text-muted">{t(S.graph.clickHint)}</p>}
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th>n</th>
            {series.map((s) => (
              <th key={s.id}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[xMin, Math.round((xMin + xMax) / 2), xMax].map((x) => (
            <tr key={x}>
              <td>{x}</td>
              {series.map((s) => (
                <td key={s.id}>{formatCount(s.fn(x), lang)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
