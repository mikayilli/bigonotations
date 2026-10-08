import { useState } from "react";
import { useI18n } from "../../i18n";
import { S } from "../../i18n/strings";
import { href, PAGES, type Route } from "../../router";

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cl-theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  };
  return { dark, toggle };
}

function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t(S.language)} className="flex rounded-lg border border-line bg-surface p-0.5 text-xs font-semibold">
      {(["az", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-md px-2.5 py-1.5 uppercase transition-colors ${
            lang === code ? "bg-accent text-bg" : "text-muted hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

function ThemeSwitch() {
  const { t } = useI18n();
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t(dark ? S.theme.toLight : S.theme.toDark)}
      title={t(dark ? S.theme.toLight : S.theme.toDark)}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink hover:bg-surface-2"
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

export function Header({ route }: { route: Route }) {
  const { t } = useI18n();
  // The mobile menu is open only for the route it was opened on, so navigating closes it.
  const routeKey = `${route.page}/${route.param ?? ""}`;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const open = openKey === routeKey;

  const links = PAGES.map((page) => {
    const active = route.page === page;
    return (
      <a
        key={page}
        href={href(page)}
        aria-current={active ? "page" : undefined}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-ink"
        }`}
      >
        {t(S.nav[page])}
      </a>
    );
  });

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <a href={href("")} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-bg" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M3 20C10 19 15 14 21 4" />
            </svg>
          </span>
          <span className="hidden sm:inline">{t(S.brand)}</span>
        </a>

        <nav aria-label={t(S.nav.main)} className="ml-2 hidden flex-1 items-center gap-1 lg:flex">
          {links}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <LangSwitch />
          <ThemeSwitch />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t(S.nav.menu)}
            onClick={() => setOpenKey(open ? null : routeKey)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={open ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={t(S.nav.main)} className="flex flex-col gap-1 border-t border-line px-4 py-2 lg:hidden">
          {links}
        </nav>
      )}
    </header>
  );
}
