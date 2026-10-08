import { Header } from "./components/layout/Header";
import { useI18n } from "./i18n";
import { S } from "./i18n/strings";
import { Algorithms } from "./pages/Algorithms";
import { Basics } from "./pages/Basics";
import { Challenge } from "./pages/Challenge";
import { Compare } from "./pages/Compare";
import { Explorer } from "./pages/Explorer";
import { Home } from "./pages/Home";
import { Playground } from "./pages/Playground";
import { Space } from "./pages/Space";
import { useSeo } from "./lib/useSeo";
import { useRoute } from "./router";

function PageSwitch({ page, param }: { page: string; param?: string }) {
  switch (page) {
    case "basics":
      return <Basics />;
    case "explorer":
      return <Explorer param={param} />;
    case "compare":
      return <Compare />;
    case "algorithms":
      return <Algorithms />;
    case "space":
      return <Space param={param} />;
    case "challenge":
      return <Challenge />;
    case "playground":
      return <Playground />;
    default:
      return <Home />;
  }
}

export default function App() {
  const route = useRoute();
  const { t } = useI18n();
  useSeo(route);
  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        {t(S.skip)}
      </a>
      <Header route={route} />
      <main id="main" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-8 outline-none sm:px-6">
        <PageSwitch page={route.page} param={route.param} />
      </main>
    </>
  );
}
