import { useEffect, useState } from "react";

/** Minimal hash router: `#/explorer/quadratic` → { page: "explorer", param: "quadratic" }. */
export interface Route {
  page: string;
  param?: string;
}

export const PAGES = ["basics", "explorer", "compare", "algorithms", "space", "challenge", "playground"] as const;
export type Page = (typeof PAGES)[number];

function parse(hash: string): Route {
  const [page = "", param] = hash.replace(/^#\/?/, "").split("/");
  return { page, param: param || undefined };
}

export function href(page: string, param?: string): string {
  return `#/${page}${param ? `/${param}` : ""}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(location.hash));
      window.scrollTo({ top: 0 });
    };
    addEventListener("hashchange", onChange);
    return () => removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
