import { useState } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { Card, SectionTitle } from "../layout/ui";
import { InputSlider } from "../lesson/InputSlider";

const TXT = {
  title: bi("2. What are “time” and “memory” here?", "2. Burada “zaman” və “yaddaş” nə deməkdir?"),
  intro: bi(
    "Think of the computer as a child who does a job at a small desk.",
    "Kompüteri kiçik masa arxasında iş görən uşaq kimi təsəvvür edin.",
  ),
  stepTitle: bi("A STEP", "ADDIM"),
  stepText: bi(
    "One tiny thing the child does: point at one toy, add two numbers, compare two things. Each is 1 step. A step is like one tick of a clock that only counts actions, never seconds.",
    "Uşağın gördüyü bir kiçik iş: bir oyuncağı göstərmək, iki ədədi toplamaq, iki şeyi müqayisə etmək. Hər biri 1 addımdır. Addım yalnız hərəkətləri sayan, saniyələri heç vaxt saymayan saatın bir tıqqıltısı kimidir.",
  ),
  timeTitle: bi("TIME complexity", "ZAMAN mürəkkəbliyi"),
  timeText: bi(
    "“How many steps does the child need when the job gets bigger?” Find the red car among n toys, and it is hiding at the very end: the child must look at every toy. 1 more toy = 1 more look.",
    "“İş böyüyəndə uşağa neçə addım lazım olur?” n oyuncaq arasından qırmızı maşını tap, o da ən sonda gizlənib: uşaq hər oyuncağa baxmalıdır. 1 oyuncaq çox = 1 baxış çox.",
  ),
  memTitle: bi("MEMORY complexity", "YADDAŞ mürəkkəbliyi"),
  memText: bi(
    "“How many boxes does the child need on the desk while working?” Boxes are places to remember things. If the child writes down every number it sees, it needs n boxes. If it only keeps a running total, it needs just 1 box.",
    "“İş görərkən uşağa masada neçə qutu lazımdır?” Qutular şeyləri yadda saxlamaq üçün yerlərdir. Uşaq gördüyü hər ədədi yazırsa, ona n qutu lazımdır. Yalnız cari cəmi saxlayırsa, cəmi 1 qutu kifayətdir.",
  ),
  toys: bi("number of toys (n)", "oyuncaq sayı (n)"),
  looks: bi("looks (steps)", "baxış (addım)"),
  keepAll: bi("Keep every number → n boxes", "Hər ədədi saxla → n qutu"),
  keepSum: bi("Keep only the total → 1 box", "Yalnız cəmi saxla → 1 qutu"),
  grow: bi("Both questions are about GROWTH: what happens to steps and boxes when n gets bigger?", "Hər iki sual ARTIM haqqındadır: n böyüyəndə addımlara və qutulara nə olur?"),
  different: bi(
    "Time and memory are separate. A job can use many steps but few boxes, or the other way round.",
    "Zaman və yaddaş ayrı şeylərdir. Bir iş çox addım, amma az qutu işlədə bilər və ya əksinə.",
  ),
};

const TOYS = ["🧸", "🚗", "🎲", "🪀", "🧩", "🪁"];

export function Concepts() {
  const { t } = useI18n();
  const [n, setN] = useState(6);
  return (
    <Card className="space-y-5">
      <SectionTitle sub={t(TXT.intro)}>{t(TXT.title)}</SectionTitle>
      <InputSlider label={t(TXT.toys)} value={n} min={1} max={12} onChange={setN} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-xl border border-line bg-surface-2 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">{t(TXT.stepTitle)}</div>
          <p className="text-sm leading-relaxed">{t(TXT.stepText)}</p>
        </div>

        <div className="space-y-2 rounded-xl border border-line bg-surface-2 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">{t(TXT.timeTitle)}</div>
          <p className="text-sm leading-relaxed">{t(TXT.timeText)}</p>
          <div className="flex flex-wrap gap-1.5 pt-1" role="img" aria-label={`${n} ${t(TXT.looks)}`}>
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className="relative grid h-9 w-9 place-items-center rounded-lg bg-surface text-xl">
                {i === n - 1 ? "🚗" : TOYS[i % TOYS.length]}
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-bg">{i + 1}</span>
              </span>
            ))}
          </div>
          <p className="font-mono text-sm font-bold">
            n = {n} → {n} {t(TXT.looks)}
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-line bg-surface-2 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">{t(TXT.memTitle)}</div>
          <p className="text-sm leading-relaxed">{t(TXT.memText)}</p>
          <div className="space-y-2 pt-1">
            <div>
              <div className="flex flex-wrap gap-1" aria-hidden="true">
                {Array.from({ length: n }, (_, i) => (
                  <span key={i} className="h-6 w-6 rounded border-2 border-[var(--c-linear)] bg-surface" />
                ))}
              </div>
              <div className="mt-1 text-xs font-semibold">{t(TXT.keepAll)}</div>
            </div>
            <div>
              <span className="inline-block h-6 w-6 rounded border-2 border-[var(--c-constant)] bg-surface" aria-hidden="true" />
              <div className="mt-1 text-xs font-semibold">{t(TXT.keepSum)}</div>
            </div>
          </div>
        </div>
      </div>

      <p className="rounded-lg bg-accent-soft px-4 py-3 text-sm font-medium">{t(TXT.grow)}</p>
      <p className="text-sm text-muted">{t(TXT.different)}</p>
    </Card>
  );
}
