import { useEffect } from "react";
import { useI18n } from "../i18n";
import { S } from "../i18n/strings";
import type { Route } from "../router";

const SITE = "Complexity Lab";

/** Keeps `<title>` and the meta description in sync with the current route and language. */
export function useSeo(route: Route) {
  const { t } = useI18n();
  const nav = S.nav as Record<string, { en: string; az: string } | undefined>;
  const label = nav[route.page];
  const section = label ? t(label as Parameters<typeof t>[0]) : "";
  const param = route.param ? route.param.replace(/-/g, " ") : "";
  const description = t(S.home.sub);

  useEffect(() => {
    const parts = [param, section].filter(Boolean);
    document.title = parts.length ? `${parts.join(" · ")} — ${SITE}` : `${SITE} — ${t(S.home.title)}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [section, param, description, t]);
}
