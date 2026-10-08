import { useState } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount, formatDuration } from "../../lib/format";
import { Card, SectionTitle } from "../layout/ui";
import { InputSlider } from "../lesson/InputSlider";

const TXT = {
  title: bi("4. Why doesn't the computer's power change the answer?", "4. Kompüterin gücü niyə cavabı dəyişmir?"),
  intro: bi(
    "Two robots run the SAME program: “add up n numbers” (about 2n + 3 steps).",
    "İki robot EYNİ proqramı icra edir: “n ədədi topla” (təxminən 2n + 3 addım).",
  ),
  n: bi("how many numbers (n)", "neçə ədəd (n)"),
  slow: bi("Slow robot: 10 steps per second", "Yavaş robot: saniyədə 10 addım"),
  fast: bi("Fast robot: 1,000 steps per second", "Sürətli robot: saniyədə 1 000 addım"),
  steps: bi("steps", "addım"),
  time: bi("time", "vaxt"),
  sameSteps: bi(
    "Look: the number of STEPS is identical. Only the seconds differ, and always by the same factor (100×). A faster computer is just a faster hand; it does not change how the work grows with n.",
    "Baxın: ADDIMLARIN sayı eynidir. Yalnız saniyələr fərqlənir və həmişə eyni vuruqla (100×). Sürətli kompüter sadəcə daha cəld əldir; işin n ilə necə artdığını dəyişmir.",
  ),
  partB: bi("Now a harder question: what if the fast robot uses a slow recipe?", "İndi daha çətin sual: sürətli robot yavaş resept işlədirsə?"),
  recipeFast: bi("Fast robot, slow recipe (n × n steps)", "Sürətli robot, yavaş resept (n × n addım)"),
  recipeSlow: bi("Slow robot, smart recipe (n steps)", "Yavaş robot, ağıllı resept (n addım)"),
  ratio: bi("The fast robot is {r}× faster", "Sürətli robot {r}× daha cəldir"),
  wins: bi("Winner: {who}", "Qalib: {who}"),
  fastWho: bi("the fast robot", "sürətli robot"),
  slowWho: bi("the slow robot with the smart recipe", "ağıllı reseptli yavaş robot"),
  cross: bi(
    "The crossover is at n = {r}. Below it, raw speed wins. Above it, the recipe wins — and the gap keeps growing forever. No hardware upgrade can rescue a recipe whose work grows faster.",
    "Kəsişmə n = {r}-dədir. Ondan aşağıda xam sürət qalib gəlir. Ondan yuxarıda resept qalib gəlir — və fərq sonsuza qədər böyüyür. Heç bir texnika yeniləməsi işi daha sürətlə artan reseptı xilas edə bilməz.",
  ),
  hardware: bi(
    "So complexity answers a question hardware cannot: “how does the work GROW when the problem grows?”",
    "Deməli, mürəkkəblik texnikanın cavab verə bilmədiyi suala cavab verir: “məsələ böyüyəndə iş necə ARTIR?”",
  ),
  ratioLabel: bi("how much faster is the fast robot?", "sürətli robot nə qədər cəld?"),
};

const SLOW = 10;
const FAST = 1000;

export function SpeedPanel() {
  const { t, lang } = useI18n();
  const [n, setN] = useState(1000);
  const [ratio, setRatio] = useState(100);
  const fmt = (x: number) => formatCount(x, lang);

  const stepsA = 2 * n + 3;
  const slowTime = stepsA / SLOW;
  const fastTime = stepsA / FAST;

  // Part B: fast robot runs n² steps at `ratio` × the speed of the slow robot running n steps.
  const slowRobotSpeed = 1000;
  const fastRobotSpeed = slowRobotSpeed * ratio;
  const bFast = (n * n) / fastRobotSpeed;
  const bSlow = n / slowRobotSpeed;
  const fastWins = bFast < bSlow;

  const bar = (label: string, seconds: number, max: number, color: string) => (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono font-bold">{formatDuration(seconds, lang)}</span>
      </div>
      <div className="mt-1 h-4 rounded bg-surface-2" aria-hidden="true">
        <div className="h-4 rounded" style={{ width: `${Math.max(1, (seconds / max) * 100)}%`, background: color, transition: "width .3s" }} />
      </div>
    </div>
  );

  return (
    <Card className="space-y-6">
      <SectionTitle sub={t(TXT.intro)}>{t(TXT.title)}</SectionTitle>
      <InputSlider label={t(TXT.n)} value={n} min={10} max={1000000} scale="log" onChange={setN} />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: t(TXT.slow), time: slowTime, color: "var(--c-quadratic)" },
          { name: t(TXT.fast), time: fastTime, color: "var(--c-constant)" },
        ].map((r) => (
          <div key={r.name} className="space-y-2 rounded-xl border border-line bg-surface-2 p-4">
            <div className="font-semibold">{r.name}</div>
            <div className="rounded-lg bg-surface px-3 py-2 font-mono">
              <span className="text-2xl font-bold">{fmt(stepsA)}</span> <span className="text-sm text-muted">{t(TXT.steps)}</span>
            </div>
            {bar(t(TXT.time), r.time, slowTime, r.color)}
          </div>
        ))}
      </div>
      <p className="rounded-lg bg-accent-soft px-4 py-3 text-sm leading-relaxed">{t(TXT.sameSteps)}</p>

      <hr className="border-line" />
      <h3 className="text-base font-semibold">{t(TXT.partB)}</h3>
      <InputSlider label={t(TXT.ratioLabel)} value={ratio} min={1} max={1000000} scale="log" onChange={setRatio} />
      <div className="space-y-3 rounded-xl border border-line bg-surface-2 p-4">
        {bar(t(TXT.recipeFast), bFast, Math.max(bFast, bSlow), "var(--c-quadratic)")}
        {bar(t(TXT.recipeSlow), bSlow, Math.max(bFast, bSlow), "var(--c-linear)")}
        <p className="pt-1 text-sm font-semibold">
          {t(TXT.ratio, { r: fmt(ratio) })} · {t(TXT.wins, { who: t(fastWins ? TXT.fastWho : TXT.slowWho) })}
        </p>
      </div>
      <p className="text-sm leading-relaxed">{t(TXT.cross, { r: fmt(ratio) })}</p>
      <p className="rounded-lg bg-accent-soft px-4 py-3 font-medium">{t(TXT.hardware)}</p>
    </Card>
  );
}
