import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { fibCalls, pow2 } from "../../lib/math";
import type { VizProps } from "./types";

/** Never draw more than this many calls, however large n gets. */
export const TREE_NODE_CAP = 127;
const X_GAP = 26;
const Y_GAP = 46;
const R = 11;

interface TreeNode {
  k: number;
  depth: number;
  /** BFS order — nodes appear in this order during the replay. */
  order: number;
  children: TreeNode[];
  x: number;
}

/** Breadth-first expansion so the cap cuts off the deepest calls, keeping a balanced picture. */
function buildTree(n: number): { root: TreeNode; nodes: TreeNode[]; leaves: number; depth: number } {
  const root: TreeNode = { k: n, depth: 0, order: 0, children: [], x: 0 };
  const nodes = [root];
  const queue = [root];
  while (queue.length && nodes.length + 2 <= TREE_NODE_CAP) {
    const node = queue.shift()!;
    if (node.k <= 1) continue;
    for (const k of [node.k - 1, node.k - 2]) {
      const child: TreeNode = { k, depth: node.depth + 1, order: nodes.length, children: [], x: 0 };
      node.children.push(child);
      nodes.push(child);
      queue.push(child);
    }
  }
  let leaf = 0;
  const place = (node: TreeNode) => {
    if (node.children.length === 0) node.x = leaf++;
    else {
      node.children.forEach(place);
      node.x = (node.children[0]!.x + node.children[node.children.length - 1]!.x) / 2;
    }
  };
  place(root);
  return { root, nodes, leaves: leaf, depth: Math.max(...nodes.map((x) => x.depth)) };
}

const TXT = {
  aria: bi("Recursion tree of fibonacci(n)", "fibonacci(n) rekursiya ağacı"),
  idle: bi("Press Run: every call creates two more calls.", "İşə sal düyməsinə basın: hər çağırış 2 yeni çağırış yaradır."),
  shown: bi("Calls made so far: {k} of {total}", "İndiyə qədər çağırışlar: {k} / {total}"),
  simplified: bi(
    "Simplified: only the first {shown} of {total} calls are drawn so the page stays fast. The counts are exact.",
    "Sadələşdirilib: səhifə sürətli qalsın deyə {total} çağırışdan yalnız ilk {shown}-i çəkilir. Say dəqiqdir.",
  ),
  base: bi("base case (n ≤ 1)", "baza hal (n ≤ 1)"),
  more: bi("more calls hidden", "daha çox çağırış gizlədilib"),
  level: bi(
    "Each level has about twice as many calls as the one above.",
    "Hər səviyyədə üstdəkindən təxminən 2 dəfə çox çağırış var.",
  ),
  chips: bi("depth", "dərinlik"),
  bound: bi("2ⁿ bound", "2ⁿ sərhəd"),
  calls: bi("calls", "çağırış"),
};

export function RecursionTree({ n, step, total }: VizProps) {
  const { t, lang } = useI18n();
  const tree = useMemo(() => buildTree(n), [n]);
  const drawn = tree.nodes.length;
  const visibleCount = step >= total ? drawn : Math.min(drawn, Math.ceil((step / total) * drawn));
  const fmt = (x: number) => formatCount(x, lang);
  const calls = fibCalls(n);
  const simplified = calls > drawn;

  const width = Math.max(1, tree.leaves) * X_GAP + 20;
  const height = tree.depth * Y_GAP + 2 * R + 14;
  const px = (x: number) => 10 + R + x * X_GAP;
  const py = (d: number) => 7 + R + d * Y_GAP;

  const shownCalls = step >= total ? calls : Math.round((step / total) * calls);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono">
          {fmt(calls)} {t(TXT.calls)}
        </span>
        <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono">
          {t(TXT.chips)} = {n}
        </span>
        <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono">
          {t(TXT.bound)} = {fmt(pow2(n))}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface-2 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: Math.min(width, 900), width: "100%", maxHeight: 460 }} role="img" aria-label={`${t(TXT.aria)}, n = ${n}`}>
          {tree.nodes.map((node) =>
            node.children.map((child) => (
              <line
                key={`${node.order}-${child.order}`}
                x1={px(node.x)}
                y1={py(node.depth)}
                x2={px(child.x)}
                y2={py(child.depth)}
                stroke="var(--muted)"
                strokeWidth={1.4}
                opacity={child.order < visibleCount ? 0.7 : 0}
                className="cell"
              />
            )),
          )}
          {tree.nodes.map((node) => {
            const visible = node.order < visibleCount;
            const base = node.k <= 1;
            const cut = node.k > 1 && node.children.length === 0;
            return (
              <g key={node.order} opacity={visible ? 1 : 0} className="cell">
                <circle
                  cx={px(node.x)}
                  cy={py(node.depth)}
                  r={R}
                  fill={base ? "var(--cell-off)" : "var(--surface)"}
                  stroke={cut ? "var(--cell-hot)" : "var(--c-exponential)"}
                  strokeWidth={2}
                  strokeDasharray={cut ? "3 2" : undefined}
                />
                <text x={px(node.x)} y={py(node.depth) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--text)" fontFamily="var(--font-mono)">
                  {node.k}
                </text>
                {cut && (
                  <text x={px(node.x)} y={py(node.depth) + R + 11} textAnchor="middle" fontSize={11} fill="var(--cell-hot)" fontWeight={700}>
                    …
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-sm" aria-live="polite">
        {step === 0 ? t(TXT.idle) : t(TXT.shown, { k: fmt(shownCalls), total: fmt(calls) })} — {t(TXT.level)}
      </p>
      <p className="text-xs text-muted">
        <span className="font-mono">f(k)</span> = fibonacci(k) · <span className="font-mono">…</span> = {t(TXT.more)} · {t(TXT.base)}
      </p>
      {simplified && (
        <p className="rounded-lg border border-warn/50 bg-warn/10 px-3 py-2 text-sm">
          {t(TXT.simplified, { shown: drawn, total: fmt(calls) })}
        </p>
      )}
    </div>
  );
}
