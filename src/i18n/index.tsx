import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { interpolate, type Bi, type Lang } from "./types";

const STORAGE_KEY = "cl-lang";

interface I18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Pick the current language of a bilingual string, optionally filling `{placeholders}`. */
  t: (text: Bi, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18n | null>(null);

function readInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "az") return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language.toLowerCase().startsWith("az") ? "az" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t: (text, vars) => (vars ? interpolate(text[lang], vars) : text[lang]),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
