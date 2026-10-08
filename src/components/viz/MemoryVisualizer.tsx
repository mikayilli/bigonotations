import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { factorial } from "../../lib/math";
import { ArrayStrip, Legend } from "./ArrayStrip";
import type { VizProps } from "./types";

// ------------------------------------------------------------- O(1) memory

const CONST_TXT = {
  input: bi("Input array (already exists — not extra memory)", "Giriş massivi (artıq mövcuddur — əlavə yaddaş deyil)"),
  extra: bi("Extra memory we create", "Yaratdığımız əlavə yaddaş"),
  always: bi("1 variable — no matter how long the array is.", "1 dəyişən — massiv nə qədər uzun olsa da."),
  idle: bi("Press Run: the loop adds each item into the same single variable.", "İşə sal düyməsinə basın: dövr hər elementi eyni tək dəyişənə əlavə edir."),
  processed: bi("processed", "emal olunub"),
  waiting: bi("waiting", "gözləyir"),
};

export function MemoryConstantViz({ n, step }: VizProps) {
  const { t, lang } = useI18n();
  const running = (step * (step + 1)) / 2; // arr = [1, 2, 3, …]
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-sm font-medium text-muted">
          {t(CONST_TXT.input)} · n = {formatCount(n, lang)}
        </div>
        <ArrayStrip
          n={n}
          cap={32}
          ariaLabel={t(CONST_TXT.input)}
          cellState={(i) => (step > 0 && i === step - 1 ? "active" : i < step - 1 ? "visited" : "idle")}
          cellLabel={(i) => String(i + 1)}
        />
        <div className="mt-2">
          <Legend
            items={[
              { state: "visited", label: t(CONST_TXT.processed) },
              { state: "idle", label: t(CONST_TXT.waiting) },
            ]}
          />
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-medium text-muted">{t(CONST_TXT.extra)}</div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border-2 border-accent bg-accent-soft px-5 py-3 font-mono text-lg font-bold" role="img" aria-label={`total = ${running}`}>
            total = {formatCount(running, lang)}
          </div>
          <p className="text-sm" aria-live="polite">
            {step === 0 ? t(CONST_TXT.idle) : t(CONST_TXT.always)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------- O(n) array memory

const ARR_TXT = {
  title: bi("Memory blocks: one per item", "Yaddaş blokları: hər element üçün bir"),
  alloc: bi("allocated & filled", "ayrılıb və doldurulub"),
  free: bi("not yet allocated", "hələ ayrılmayıb"),
  idle: bi("Press Run: the loop fills one memory slot per iteration.", "İşə sal düyməsinə basın: dövr hər iterasiyada bir yaddaş xanasını doldurur."),
  now: bi("{k} of {n} slots in use", "{n} xanadan {k}-i istifadədədir"),
  prop: bi("memory ∝ n → O(n)", "yaddaş ∝ n → O(n)"),
};

export function MemoryArrayViz({ n, step }: VizProps) {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted">
        {t(ARR_TXT.title)} · n = {formatCount(n, lang)}
      </div>
      <ArrayStrip
        n={n}
        cap={48}
        ariaLabel={`${t(ARR_TXT.title)}: n = ${n}`}
        cellState={(i) => (i < step ? "visited" : "idle")}
        cellLabel={(i) => String(i)}
      />
      <Legend
        items={[
          { state: "visited", label: t(ARR_TXT.alloc) },
          { state: "idle", label: t(ARR_TXT.free) },
        ]}
      />
      <p className="text-sm" aria-live="polite">
        {step === 0 ? t(ARR_TXT.idle) : t(ARR_TXT.now, { k: formatCount(step, lang), n: formatCount(n, lang) })}
      </p>
      <p className="rounded-lg bg-accent-soft px-3 py-2 font-mono text-sm">{t(ARR_TXT.prop)}</p>
    </div>
  );
}

// ------------------------------------------------------------ recursion stack

const STACK_TXT = {
  title: bi("Call stack (newest call on top)", "Çağırış yığını (ən yeni çağırış üstdə)"),
  idle: bi("Press Run: calls pile up, then return one by one.", "İşə sal düyməsinə basın: çağırışlar yığılır, sonra bir-bir qayıdır."),
  pushing: bi("Calling deeper… {d} frame(s) are alive at the same time.", "Daha dərinə çağırılır… eyni anda {d} çərçivə canlıdır."),
  popping: bi("Returning… {d} frame(s) left.", "Qayıdır… {d} çərçivə qalıb."),
  peak: bi("Peak: all {n} calls exist in memory at the same time → n frames = O(n).", "Pik: bütün {n} çağırış eyni anda yaddaşda mövcuddur → n çərçivə = O(n)."),
  returns: bi("returns {v}", "{v} qaytarır"),
  waiting: bi("waiting for the call below…", "aşağıdakı çağırışı gözləyir…"),
  hidden: bi("{h} more frames", "daha {h} çərçivə"),
  base: bi("base case", "baza hal"),
  empty: bi("(stack is empty)", "(yığın boşdur)"),
};

const STACK_VISIBLE = 10;

export function CallStackViz({ n, step, total }: VizProps) {
  const { t, lang } = useI18n();
  // Phase 1 (step 0..n): depth grows. Phase 2 (n..2n): depth shrinks.
  // A finished run is shown at its peak: that is the moment worth looking at.
  const finished = step >= total;
  const depth = finished ? n : step <= n ? step : 2 * n - step;
  const unwinding = !finished && step > n;
  const atPeak = finished || step === n;

  // Frame k (0 = bottom) calls factorial(n − k).
  const frames = Array.from({ length: depth }, (_, k) => k);
  const hidden = Math.max(0, depth - STACK_VISIBLE);
  // Keep the top frames and the bottom two; collapse the middle.
  const shown = hidden > 0 ? [...frames.slice(0, 2), -1, ...frames.slice(depth - (STACK_VISIBLE - 2))] : frames;
  const ordered = [...shown].reverse(); // newest on top

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted">{t(STACK_TXT.title)}</div>
      <div
        className="mx-auto flex min-h-24 max-w-sm flex-col justify-end gap-1 rounded-xl border-2 border-t-0 border-line bg-surface-2 p-2"
        role="img"
        aria-label={`${t(STACK_TXT.title)}: ${depth}`}
      >
        {ordered.length === 0 && <div className="py-4 text-center text-sm text-muted">{t(STACK_TXT.empty)}</div>}
        {ordered.map((k, i) => {
          if (k === -1) {
            return (
              <div key="gap" className="py-0.5 text-center font-mono text-sm text-muted">
                ⋮ {t(STACK_TXT.hidden, { h: hidden })}
              </div>
            );
          }
          const arg = n - k;
          const isTop = i === 0;
          const isBase = arg === 1;
          const retVal = unwinding && isTop ? factorial(arg) : null;
          return (
            <div
              key={k}
              className={`flex items-center justify-between rounded-lg border-2 bg-surface px-3 py-1.5 font-mono text-sm ${isTop ? "stack-in" : ""}`}
              style={{ borderColor: isTop ? "var(--cell-hot)" : "var(--c-linear)" }}
            >
              <span className="font-semibold">factorial({arg})</span>
              <span className="text-xs text-muted">
                {retVal !== null ? t(STACK_TXT.returns, { v: formatCount(retVal, lang) }) : isBase ? t(STACK_TXT.base) : t(STACK_TXT.waiting)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm" aria-live="polite">
        {step === 0
          ? t(STACK_TXT.idle)
          : finished
            ? t(STACK_TXT.pushing, { d: depth })
            : unwinding
            ? t(STACK_TXT.popping, { d: depth })
            : t(STACK_TXT.pushing, { d: depth })}
      </p>
      {atPeak && (
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm">{t(STACK_TXT.peak, { n })}</p>
      )}
    </div>
  );
}
