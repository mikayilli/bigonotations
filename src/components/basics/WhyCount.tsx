import { useState } from "react";
import { useI18n } from "../../i18n";
import { bi } from "../../i18n/types";
import { formatCount } from "../../lib/format";
import { Card, SectionTitle } from "../layout/ui";
import { InputSlider } from "../lesson/InputSlider";

const TXT = {
  title: bi("1. Why do we count at all?", "1. Niyə ümumiyyətlə sayırıq?"),
  story: bi(
    "Imagine a big dictionary with n pages and you want one word. Two kids try. Ali flips page by page from the start. Aysel opens it in the middle, sees the word is later, throws away the first half, opens the middle of what is left… Who is faster?",
    "Təsəvvür edin: n səhifəlik böyük lüğət var və bir söz axtarırsınız. İki uşaq cəhd edir. Əli əvvəldən səhifə-səhifə vərəqləyir. Aysel lüğəti ortadan açır, sözün sonrada olduğunu görür, ilk yarını atır, qalanın ortasını açır… Kim daha sürətlidir?",
  ),
  pages: bi("pages in the dictionary", "lüğətdəki səhifə sayı"),
  ali: bi("Ali (page by page)", "Əli (səhifə-səhifə)"),
  aysel: bi("Aysel (open the middle)", "Aysel (ortanı aç)"),
  looks: bi("pages looked at", "baxılan səhifə"),
  trap: bi(
    "“Who is faster” sounds like a question about seconds. But seconds depend on who holds the dictionary: a quick hand, a tired hand, a robot, a supercomputer. The number of pages looked at does NOT change with the hand. So we count pages (steps), not seconds.",
    "“Kim daha sürətlidir” sualı saniyələr haqqında səslənir. Amma saniyələr lüğəti kimin tutduğundan asılıdır: cəld əl, yorğun əl, robot, super kompüter. Baxılan səhifələrin sayı isə əldən asılı DEYİL. Ona görə saniyələri yox, səhifələri (addımları) sayırıq.",
  ),
  idea: bi(
    "That is the whole reason complexity exists: to compare METHODS fairly, without caring who runs them.",
    "Mürəkkəblik məhz bunun üçün mövcuddur: METODLARI onları kimin icra etdiyindən asılı olmadan ədalətli müqayisə etmək.",
  ),
};

export function WhyCount() {
  const { t, lang } = useI18n();
  const [n, setN] = useState(1000);
  const aliLooks = n;
  const ayselLooks = Math.floor(Math.log2(n)) + 1;
  const fmt = (x: number) => formatCount(x, lang);

  const kid = (name: string, looks: number, color: string) => (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold">{name}</span>
        <span className="font-mono text-2xl font-bold tabular-nums">
          {fmt(looks)} <span className="font-sans text-xs font-normal text-muted">{t(TXT.looks)}</span>
        </span>
      </div>
      <div className="mt-1 h-4 rounded bg-surface-2" aria-hidden="true">
        <div className="h-4 rounded" style={{ width: `${Math.max(0.6, (looks / n) * 100)}%`, background: color, transition: "width .3s" }} />
      </div>
    </div>
  );

  return (
    <Card className="space-y-5">
      <SectionTitle>{t(TXT.title)}</SectionTitle>
      <p className="leading-relaxed">{t(TXT.story)}</p>
      <InputSlider label={t(TXT.pages)} value={n} min={2} max={1000000} scale="log" onChange={setN} />
      <div className="space-y-4">
        {kid(t(TXT.ali), aliLooks, "var(--c-linear)")}
        {kid(t(TXT.aysel), ayselLooks, "var(--c-logarithmic)")}
      </div>
      <p className="rounded-lg bg-surface-2 px-4 py-3 text-sm leading-relaxed">{t(TXT.trap)}</p>
      <p className="rounded-lg bg-accent-soft px-4 py-3 font-medium">{t(TXT.idea)}</p>
    </Card>
  );
}
