import { useState } from "react";
import { PageHeading } from "../components/layout/ui";
import { SearchRace } from "../components/race/SearchRace";
import { SortRace } from "../components/race/SortRace";
import { useI18n } from "../i18n";
import { bi } from "../i18n/types";

const TXT = {
  title: bi("Algorithm Race", "Alqoritm yarışı"),
  sub: bi(
    "Two algorithms, the same data. Change n and watch the gap between them grow — that gap is the whole point of Big-O.",
    "İki alqoritm, eyni data. n-i dəyişin və aralarındakı fərqin böyüməsinə baxın — Big-O-nun bütün mahiyyəti bu fərqdədir.",
  ),
  search: bi("Searching", "Axtarış"),
  sort: bi("Sorting", "Sıralama"),
};

export function Algorithms() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"search" | "sort">("search");
  return (
    <div>
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />
      <div role="tablist" className="mb-6 inline-flex rounded-xl border border-line bg-surface p-1">
        {(["search", "sort"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`min-h-10 rounded-lg px-5 text-sm font-semibold ${tab === key ? "bg-accent text-bg" : "text-muted hover:text-ink"}`}
          >
            {t(TXT[key])}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tab === "search" ? <SearchRace /> : <SortRace />}</div>
    </div>
  );
}
