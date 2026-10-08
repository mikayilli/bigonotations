import { Concepts } from "../components/basics/Concepts";
import { LineTracer } from "../components/basics/LineTracer";
import { SpeedPanel } from "../components/basics/SpeedPanel";
import { WhyCount } from "../components/basics/WhyCount";
import { Card, PageHeading, SectionTitle } from "../components/layout/ui";
import { useI18n } from "../i18n";
import { bi } from "../i18n/types";
import { href } from "../router";

const TXT = {
  title: bi("Start here: why does complexity exist?", "Buradan başla: mürəkkəblik niyə mövcuddur?"),
  sub: bi(
    "No formulas yet. We start from a child at a desk, then watch a real program from its first line to its last, and see exactly where every step and every box of memory comes from.",
    "Hələ düstur yoxdur. Masa arxasındakı uşaqdan başlayırıq, sonra real proqramı ilk sətirdən sonuncuya qədər izləyirik və hər addımın, hər yaddaş qutusunun dəqiq haradan gəldiyini görürük.",
  ),
  recapTitle: bi("5. Remember these five things", "5. Bu beş şeyi yadda saxlayın"),
  recap: [
    bi("A STEP is one tiny action. We count steps, never seconds.", "ADDIM bir kiçik hərəkətdir. Biz addımları sayırıq, saniyələri yox."),
    bi("TIME complexity: how the number of steps GROWS when the problem grows.", "ZAMAN mürəkkəbliyi: məsələ böyüyəndə addımların sayı necə ARTIR."),
    bi("MEMORY complexity: how the number of boxes on the desk GROWS when the problem grows.", "YADDAŞ mürəkkəbliyi: məsələ böyüyəndə masadakı qutuların sayı necə ARTIR."),
    bi("Add up every line × how many times it runs. Keep only the part that grows fastest. That is Big-O.", "Hər sətri × neçə dəfə işlədiyini topla. Yalnız ən sürətlə böyüyən hissəni saxla. Bu Big-O-dur."),
    bi("A faster computer changes the seconds by a fixed factor, but never how the work grows. So we compare recipes, not hardware.", "Sürətli kompüter saniyələri sabit vuruqla dəyişir, amma işin necə artmasını dəyişmir. Ona görə texnikanı yox, reseptləri müqayisə edirik."),
  ],
  next: bi("Now see each growth shape with its own graph:", "İndi hər artım formasını öz qrafiki ilə görün:"),
  explorer: bi("Complexity Explorer", "Mürəkkəblik kəşfiyyatçısı"),
  space: bi("Space (memory) lessons", "Yaddaş dərsləri"),
};

export function Basics() {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />
      <WhyCount />
      <Concepts />
      <LineTracer />
      <SpeedPanel />
      <Card className="space-y-3">
        <SectionTitle>{t(TXT.recapTitle)}</SectionTitle>
        <ol className="space-y-2">
          {TXT.recap.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-accent text-xs font-bold text-accent">{i + 1}</span>
              <p className="leading-relaxed">{t(r)}</p>
            </li>
          ))}
        </ol>
        <p className="pt-2 text-sm text-muted">{t(TXT.next)}</p>
        <div className="flex flex-wrap gap-2">
          <a href={href("explorer", "linear")} className="inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-bg hover:opacity-90">
            {t(TXT.explorer)} →
          </a>
          <a href={href("space", "linear")} className="inline-flex min-h-10 items-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-2">
            {t(TXT.space)} →
          </a>
        </div>
      </Card>
    </div>
  );
}
