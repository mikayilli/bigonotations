import { ComplexityLesson } from "../components/lesson/ComplexityLesson";
import { PageHeading } from "../components/layout/ui";
import { COMPLEXITY, COMPLEXITY_ORDER } from "../data/complexities";
import { LESSONS } from "../data/lessons";
import type { ComplexityType } from "../data/types";
import { useI18n } from "../i18n";
import { bi } from "../i18n/types";
import { href } from "../router";

const TXT = {
  title: bi("Complexity Explorer", "Mürəkkəblik kəşfiyyatçısı"),
  sub: bi(
    "Pick a complexity class, then change n and watch the algorithm, the operation count, the formula and the graph move together.",
    "Mürəkkəblik sinfini seçin, sonra n-i dəyişin və alqoritmin, əməliyyat sayının, düsturun və qrafikin birlikdə hərəkət etməsinə baxın.",
  ),
  pick: bi("Complexity class", "Mürəkkəblik sinfi"),
};

const isType = (v: string | undefined): v is ComplexityType => !!v && v in LESSONS;

export function Explorer({ param }: { param?: string }) {
  const { t } = useI18n();
  const type: ComplexityType = isType(param) ? param : "quadratic";
  const lesson = LESSONS[type];

  return (
    <div>
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />
      <nav aria-label={t(TXT.pick)} className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
          {COMPLEXITY_ORDER.map((c) => {
            const active = c === type;
            return (
              <li key={c}>
                <a
                  href={href("explorer", c)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 font-mono text-sm font-semibold ${
                    active ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:text-ink"
                  }`}
                >
                  {COMPLEXITY[c].notation}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <ComplexityLesson key={type} lesson={lesson} />
    </div>
  );
}
