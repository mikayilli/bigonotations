import { useI18n } from "../../i18n";
import { formatCount } from "../../lib/format";
import { useTween } from "../../lib/hooks";

/** Big animated number. Counts up/down smoothly when the value changes. */
export function OperationCounter({ label, value, caption }: { label: string; value: number; caption?: string }) {
  const { lang } = useI18n();
  const shown = useTween(value, 500);
  const display = Number.isFinite(value) ? formatCount(Math.round(shown), lang) : "∞";
  return (
    <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className="font-mono text-4xl font-bold tabular-nums tracking-tight" aria-live="polite" aria-atomic="true">
        {/* announce the settled value, not every tween frame */}
        <span aria-hidden="true">{display}</span>
        <span className="sr-only">{formatCount(value, lang)}</span>
      </div>
      {caption && <div className="mt-0.5 text-xs text-muted">{caption}</div>}
    </div>
  );
}
