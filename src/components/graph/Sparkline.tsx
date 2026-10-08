import { sampleRange } from "../../lib/math";

/** Tiny decorative growth preview for the home page (n = 1…12, normalised to its own height). */
export function Sparkline({ fn, color }: { fn: (n: number) => number; color: string }) {
  const xs = sampleRange(1, 12, 12);
  const ys = xs.map(fn);
  const max = Math.max(...ys, 1e-9);
  const W = 120;
  const H = 48;
  const pts = xs.map((x, i) => `${((x - 1) / 11) * (W - 8) + 4},${H - 4 - (ys[i]! / max) * (H - 8)}`);
  const lastPt = pts[pts.length - 1]!.split(",");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-12 w-full" aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={3.5} fill={color} />
    </svg>
  );
}
