import { COMPLEXITY, COMPLEXITY_ORDER } from "../data/complexities";
import { Sparkline } from "../components/graph/Sparkline";
import { Card } from "../components/layout/ui";
import { useI18n } from "../i18n";
import { S } from "../i18n/strings";
import { href } from "../router";

function GrowthMeter({ rank, label }: { rank: number; label: string }) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${label} (${rank}/7)`}>
      <div className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="h-2.5 w-3 rounded-sm" style={{ background: i < rank ? "var(--text)" : "var(--cell-off)" }} />
        ))}
      </div>
      <span className="text-xs font-semibold text-muted">{label}</span>
    </div>
  );
}

export function Home() {
  const { t } = useI18n();
  const other = (["compare", "algorithms", "space", "challenge", "playground"] as const).map((page) => ({
    page,
    title: t(S.nav[page]),
    text: t(S.home.other[page]),
  }));

  return (
    <div className="space-y-12">
      <section className="max-w-4xl pt-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{t(S.home.title)}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{t(S.home.sub)}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={href("basics")}
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-semibold text-bg hover:opacity-90"
          >
            {t(S.nav.basics)}: {t(S.home.basicsCta)} →
          </a>
          <a
            href={href("explorer", "quadratic")}
            className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-5 font-semibold hover:bg-surface-2"
          >
            O(n²) →
          </a>
        </div>
        <div className="mt-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">{t(S.home.chainTitle)}</p>
          <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {S.home.chain.map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="rounded-lg border border-line bg-surface px-3 py-1.5">{t(step)}</span>
                {i < S.home.chain.length - 1 && (
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="classes-h">
        <h2 id="classes-h" className="mb-4 text-xl font-semibold tracking-tight">
          {t(S.home.classesTitle)}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {COMPLEXITY_ORDER.map((type) => {
            const c = COMPLEXITY[type];
            return (
              <li key={type}>
                <Card as="article" className="flex h-full flex-col gap-3 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-2xl font-bold" style={{ color: c.color }}>
                        {c.notation}
                      </div>
                      <div className="text-sm font-semibold">{t(c.name)}</div>
                    </div>
                    <div className="w-28 shrink-0">
                      <Sparkline fn={c.growth} color={c.color} />
                    </div>
                  </div>
                  <p className="flex-1 text-sm text-muted">“{t(c.tagline)}”</p>
                  <div className="flex items-center justify-between gap-3">
                    <GrowthMeter rank={c.rank} label={t(c.rankLabel)} />
                    <a
                      href={href("explorer", type)}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface-2"
                      aria-label={`${t(S.home.explore)} ${c.notation}`}
                    >
                      {t(S.home.explore)} →
                    </a>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="more-h">
        <h2 id="more-h" className="mb-4 text-xl font-semibold tracking-tight">
          {t(S.home.otherTitle)}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {other.map((o) => (
            <li key={o.page}>
              <a href={href(o.page)} className="block h-full rounded-2xl border border-line bg-surface p-4 hover:bg-surface-2">
                <div className="font-semibold">{o.title} →</div>
                <p className="mt-1 text-sm text-muted">{o.text}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
