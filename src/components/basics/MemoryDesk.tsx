import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import type { TraceEvent } from "../../data/basics";

const TXT = {
  given: bi("The list we were GIVEN (not our memory)", "Bizə VERİLƏN siyahı (bizim yaddaşımız deyil)"),
  desk: bi("Our desk — every box here is our memory", "Bizim masa — buradakı hər qutu bizim yaddaşımızdır"),
  empty: bi("The desk is empty. 0 boxes.", "Masa boşdur. 0 qutu."),
  shelf: bi("shelf", "rəf"),
  boxes: bi("boxes on the desk now", "masadakı qutu sayı"),
  peak: bi("most boxes at once", "eyni anda ən çox qutu"),
  isNew: bi("new", "yeni"),
};

const GIVEN_CAP = 12;

/** The desk where variables live. Each box is one unit of memory. */
export function MemoryDesk({ event, prev, n, givenInput, peak }: { event: TraceEvent | null; prev: TraceEvent | null; n: number; givenInput: boolean; peak: number }) {
  const { t } = useI18n();
  const vars = event?.vars ?? [];
  const items = event?.built?.items ?? [];
  const prevNames = new Set(prev?.vars.map((v) => v.name) ?? []);
  const prevCount = prev?.built?.items.length ?? 0;
  const boxes = vars.length + items.length;

  return (
    <div className="space-y-3">
      {givenInput && (
        <div>
          <div className="mb-1 text-xs font-semibold text-muted">{t(TXT.given)}</div>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {Array.from({ length: Math.min(n, GIVEN_CAP) }, (_, i) => (
              <span key={i} className="grid h-8 w-8 place-items-center rounded-md border-2 border-dashed border-line font-mono text-xs text-muted">
                {i + 1}
              </span>
            ))}
            {n > GIVEN_CAP && <span className="self-center text-xs text-muted">… {n}</span>}
          </div>
        </div>
      )}

      <div>
        <div className="mb-1 text-xs font-semibold text-muted">{t(TXT.desk)}</div>
        <div className="flex min-h-20 flex-wrap items-end gap-2 rounded-xl border-2 border-line bg-surface-2 p-3" role="img" aria-label={`${t(TXT.boxes)}: ${boxes}`}>
          {boxes === 0 && <span className="self-center text-sm text-muted">{t(TXT.empty)}</span>}
          {vars.map((v) => {
            const fresh = !prevNames.has(v.name);
            return (
              <div key={v.name} className={`rounded-lg border-2 bg-surface px-3 py-1.5 text-center ${fresh ? "pop-in" : ""}`} style={{ borderColor: fresh ? "var(--cell-hot)" : "var(--c-linear)" }}>
                <div className="font-mono text-[11px] text-muted">{v.name}</div>
                <div className="font-mono text-lg font-bold">{v.value}</div>
                {fresh && <div className="text-[10px] font-bold text-[var(--cell-hot)]">★ {t(TXT.isNew)}</div>}
              </div>
            );
          })}
          {event?.built && (
            <div className="flex flex-wrap items-end gap-1 rounded-lg border-2 border-dashed border-accent px-2 py-1.5">
              <span className="mr-1 font-mono text-[11px] text-muted">{event.built.name} ({t(TXT.shelf)}):</span>
              {items.map((it, i) => {
                const fresh = i >= prevCount && i === items.length - 1 && items.length > prevCount;
                return (
                  <span
                    key={i}
                    className={`grid h-9 w-9 place-items-center rounded-md border-2 bg-surface font-mono text-sm font-bold ${fresh ? "pop-in" : ""}`}
                    style={{ borderColor: fresh ? "var(--cell-hot)" : "var(--c-linear)" }}
                  >
                    {it}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <span>
          <strong className="font-mono text-xl">{boxes}</strong> <span className="text-muted">{t(TXT.boxes)}</span>
        </span>
        <span>
          <strong className="font-mono text-xl">{peak}</strong> <span className="text-muted">{t(TXT.peak)}</span>
        </span>
      </div>
    </div>
  );
}
