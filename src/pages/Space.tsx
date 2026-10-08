import { ComplexityLesson } from "../components/lesson/ComplexityLesson";
import { Callout, PageHeading } from "../components/layout/ui";
import { SPACE_LESSONS, SPACE_ORDER } from "../data/spaceLessons";
import { useI18n } from "../i18n";
import { bi } from "../i18n/types";
import { href } from "../router";

const TXT = {
  title: bi("Space Complexity", "Yaddaş mürəkkəbliyi"),
  sub: bi(
    "Time is not the only thing that grows. Memory grows with n too — and recursion hides memory on the call stack.",
    "Yalnız zaman artmır. Yaddaş da n ilə artır — rekursiya isə yaddaşı çağırış yığınında gizlədir.",
  ),
  rule: bi(
    "Space complexity counts the EXTRA memory an algorithm needs while it runs, as a function of the input size n.",
    "Yaddaş mürəkkəbliyi alqoritmin işləyərkən tələb etdiyi ƏLAVƏ yaddaşı giriş ölçüsü n-in funksiyası kimi sayır.",
  ),
  pick: bi("Memory scenario", "Yaddaş ssenarisi"),
  tabs: {
    constant: bi("O(1) · one variable", "O(1) · bir dəyişən"),
    linear: bi("O(n) · array", "O(n) · massiv"),
    stack: bi("O(n) · recursion stack", "O(n) · rekursiya yığını"),
    quadratic: bi("O(n²) · matrix", "O(n²) · matris"),
  },
};

export function Space({ param }: { param?: string }) {
  const { t } = useI18n();
  const id = SPACE_ORDER.find((x) => x === param) ?? "linear";
  const lesson = SPACE_LESSONS[id]!;

  return (
    <div>
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />
      <div className="mb-6 max-w-3xl">
        <Callout>{t(TXT.rule)}</Callout>
      </div>
      <nav aria-label={t(TXT.pick)} className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
          {SPACE_ORDER.map((key) => (
            <li key={key}>
              <a
                href={href("space", key)}
                aria-current={key === id ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 text-sm font-semibold ${
                  key === id ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                {t(TXT.tabs[key])}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ComplexityLesson key={id} lesson={lesson} />
    </div>
  );
}
