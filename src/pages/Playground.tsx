import { useState } from "react";
import { ComplexityGraph, type GraphSeries } from "../components/graph/ComplexityGraph";
import { Button, Callout, Card, PageHeading, SectionTitle } from "../components/layout/ui";
import { InputSlider } from "../components/lesson/InputSlider";
import { useI18n } from "../i18n";
import { S } from "../i18n/strings";
import { bi } from "../i18n/types";
import { formatCount } from "../lib/format";
import { clamp } from "../lib/math";

const TXT = {
  title: bi("Exact Operations vs Big-O", "Dəqiq əməliyyatlar və Big-O"),
  sub: bi(
    "Real code does 3n + 7 operations, not just “n”. Build your own formula and see why Big-O keeps only the part that wins when n gets large.",
    "Real kod sadəcə “n” deyil, 3n + 7 əməliyyat edir. Öz düsturunuzu qurun və Big-O-nun niyə yalnız n böyüyəndə qalib gələn hissəni saxladığını görün.",
  ),
  presets: bi("Try an example", "Nümunə seçin"),
  formula: bi("Your formula", "Sizin düsturunuz"),
  terms: bi("Where the work comes from at n = {n}", "n = {n} olduqda iş haradan gəlir"),
  quad: bi("n² part", "n² hissəsi"),
  lin: bi("n part", "n hissəsi"),
  con: bi("constant part", "sabit hissə"),
  exact: bi("exact operations", "dəqiq əməliyyatlar"),
  dominant: bi("dominant term", "üstünlük təşkil edən hədd"),
  ratio: bi("exact ÷ dominant term", "dəqiq ÷ üstün hədd"),
  verdict: bi("Big-O: {o}", "Big-O: {o}"),
  graphTitle: bi("Exact function vs. its dominant term", "Dəqiq funksiya və onun üstün həddi"),
  exactSeries: bi("exact f(n)", "dəqiq f(n)"),
  domSeries: bi("dominant term only", "yalnız üstün hədd"),
  lessons: [
    bi(
      "Constants don't change the shape: 3n and 5n are both straight lines — they just have different slopes. Both are O(n).",
      "Sabitlər formanı dəyişmir: 3n və 5n hər ikisi düz xəttdir — sadəcə fərqli maillik. Hər ikisi O(n)-dir.",
    ),
    bi(
      "Lower-order terms fade away: as n grows, the “+ 7” or “+ 999999” becomes a smaller and smaller share of the total. Watch the stacked bar.",
      "Aşağı tərtibli hədlər solur: n artdıqca “+ 7” və ya “+ 999999” cəmin getdikcə kiçik payına çevrilir. Yığma sütuna baxın.",
    ),
    bi(
      "Asymptotic growth means “what happens as n becomes very large”. The ratio exact ÷ dominant settles toward a constant, so the dominant term tells the whole story.",
      "Asimptotik artım “n çox böyüdükdə nə baş verir” deməkdir. Dəqiq ÷ üstün hədd nisbəti sabitə yaxınlaşır, ona görə hekayəni üstün hədd danışır.",
    ),
  ],
  lessonTitle: bi("Three ideas", "Üç ideya"),
  crossTitle: bi("Constants still matter for small n", "Kiçik n üçün sabitlər hələ də vacibdir"),
  crossText: bi(
    "100n is O(n) and n² is O(n²). For small n the quadratic is actually cheaper — but after n = 100 it loses, and the gap only grows.",
    "100n O(n)-dir, n² isə O(n²). Kiçik n üçün kvadratik həqiqətən daha ucuzdur — amma n = 100-dən sonra uduzur və fərq yalnız artır.",
  ),
  cross: bi("cheaper", "daha ucuz"),
  equal: bi("equal", "bərabər"),
};

interface Poly {
  a: number;
  b: number;
  c: number;
}

const PRESETS: { label: string; poly: Poly }[] = [
  { label: "3n + 7", poly: { a: 0, b: 3, c: 7 } },
  { label: "5n + 100", poly: { a: 0, b: 5, c: 100 } },
  { label: "n + 999999", poly: { a: 0, b: 1, c: 999999 } },
  { label: "2n² + 50n + 10", poly: { a: 2, b: 50, c: 10 } },
];

const f = ({ a, b, c }: Poly, n: number) => a * n * n + b * n + c;
const degree = ({ a, b }: Poly) => (a > 0 ? 2 : b > 0 ? 1 : 0);
const dominant = (p: Poly, n: number) => (degree(p) === 2 ? p.a * n * n : degree(p) === 1 ? p.b * n : p.c);
const bigO = (p: Poly) => (degree(p) === 2 ? "O(n²)" : degree(p) === 1 ? "O(n)" : "O(1)");

function formulaText({ a, b, c }: Poly) {
  const parts = [a > 0 ? `${a === 1 ? "" : a}n²` : "", b > 0 ? `${b === 1 ? "" : b}n` : "", c > 0 || (a === 0 && b === 0) ? `${c}` : ""].filter(Boolean);
  return parts.join(" + ");
}

function NumberField({ label, value, onChange, max }: { label: string; value: number; onChange: (v: number) => void; max: number }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <span className="w-24 font-mono text-muted">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(Math.floor(Number(e.target.value) || 0), 0, max))}
        className="min-h-10 w-32 rounded-lg border border-line bg-surface px-3 font-mono"
      />
    </label>
  );
}

export function Playground() {
  const { t, lang } = useI18n();
  const [poly, setPoly] = useState<Poly>({ a: 0, b: 3, c: 7 });
  const [n, setN] = useState(10);
  const fmt = (x: number) => formatCount(x, lang);

  const total = f(poly, n);
  const shares = [
    { key: "quad", label: t(TXT.quad), value: poly.a * n * n, color: "var(--c-quadratic)" },
    { key: "lin", label: t(TXT.lin), value: poly.b * n, color: "var(--c-linear)" },
    { key: "con", label: t(TXT.con), value: poly.c, color: "var(--c-constant)" },
  ].filter((s) => s.value > 0);

  const series: GraphSeries[] = [
    { id: "exact", label: t(TXT.exactSeries), fn: (x) => f(poly, x), color: "var(--c-linear)", marker: true },
    { id: "dom", label: t(TXT.domSeries), fn: (x) => dominant(poly, x), color: "var(--muted)", dashed: true },
  ];

  const set = (key: keyof Poly) => (v: number) => setPoly((p) => ({ ...p, [key]: v }));
  const crossNs = [10, 50, 100, 200, 1000];

  return (
    <div className="space-y-6">
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="space-y-4">
            <SectionTitle>{t(TXT.formula)}</SectionTitle>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t(TXT.presets)}>
              {PRESETS.map((p) => (
                <Button key={p.label} className="font-mono" onClick={() => setPoly(p.poly)}>
                  {p.label}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <NumberField label="a (n²)" value={poly.a} onChange={set("a")} max={100} />
              <NumberField label="b (n)" value={poly.b} onChange={set("b")} max={10000} />
              <NumberField label="c (const)" value={poly.c} onChange={set("c")} max={1000000} />
            </div>
            <p className="rounded-xl bg-surface-2 px-4 py-3 font-mono text-lg font-bold">
              f(n) = {formulaText(poly)} <span className="text-muted">→</span> <span className="text-accent">{t(TXT.verdict, { o: bigO(poly) })}</span>
            </p>
          </Card>

          <Card className="space-y-4">
            <InputSlider value={n} min={1} max={1000000} scale="log" onChange={setN} />
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted">{t(TXT.terms, { n: fmt(n) })}</h3>
              <div className="flex h-8 overflow-hidden rounded-lg border border-line" role="img" aria-label={shares.map((s) => `${s.label}: ${Math.round((s.value / total) * 100)}%`).join(", ")}>
                {shares.map((s, i) => (
                  <div
                    key={s.key}
                    className="cell flex items-center justify-center overflow-hidden text-[11px] font-bold text-white"
                    style={{
                      width: `${(s.value / total) * 100}%`,
                      background: s.color,
                      backgroundImage: i % 2 ? "repeating-linear-gradient(135deg, rgb(255 255 255 / .25) 0 4px, transparent 4px 8px)" : undefined,
                    }}
                  >
                    {s.value / total > 0.08 ? `${Math.round((s.value / total) * 100)}%` : ""}
                  </div>
                ))}
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {shares.map((s) => (
                  <li key={s.key} className="flex items-center justify-between gap-3 font-mono">
                    <span className="flex items-center gap-2 font-sans">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
                      {s.label}
                    </span>
                    <span>
                      {fmt(s.value)} <span className="text-muted">({+((s.value / total) * 100).toFixed(2)}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-xl bg-surface-2 px-4 py-3 font-mono text-sm">
              <dt className="font-sans text-muted">{t(TXT.exact)}</dt>
              <dd className="text-right font-bold">{fmt(total)}</dd>
              <dt className="font-sans text-muted">{t(TXT.dominant)}</dt>
              <dd className="text-right font-bold">{fmt(dominant(poly, n))}</dd>
              <dt className="font-sans text-muted">{t(TXT.ratio)}</dt>
              <dd className="text-right font-bold">{dominant(poly, n) > 0 ? +(total / dominant(poly, n)).toFixed(4) : "—"}</dd>
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionTitle>{t(TXT.graphTitle)}</SectionTitle>
            <ComplexityGraph
              series={series}
              n={n}
              xMin={1}
              xMax={1000000}
              autoZoom
              yLabel={t(S.graph.yTime)}
              ariaLabel={t(TXT.graphTitle)}
              onSelectN={setN}
              endLabels={false}
            />
          </Card>
          <Card className="space-y-3">
            <SectionTitle>{t(TXT.lessonTitle)}</SectionTitle>
            <ol className="space-y-3">
              {TXT.lessons.map((l, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-accent text-xs font-bold text-accent">{i + 1}</span>
                  <p className="leading-relaxed">{t(l)}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <Card className="space-y-3">
        <SectionTitle>{t(TXT.crossTitle)}</SectionTitle>
        <Callout>{t(TXT.crossText)}</Callout>
        <table className="w-full max-w-xl text-sm">
          <thead className="text-left text-xs text-muted">
            <tr>
              <th className="py-1">n</th>
              <th>100n · O(n)</th>
              <th>n² · O(n²)</th>
              <th />
            </tr>
          </thead>
          <tbody className="font-mono">
            {crossNs.map((x) => {
              const lin = 100 * x;
              const quad = x * x;
              return (
                <tr key={x} className="border-t border-line">
                  <td className="py-1.5">{fmt(x)}</td>
                  <td>{fmt(lin)}</td>
                  <td>{fmt(quad)}</td>
                  <td className="font-sans text-xs font-semibold text-muted">
                    {lin === quad ? "= " + t(TXT.equal) : lin < quad ? "100n " + t(TXT.cross) : "n² " + t(TXT.cross)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
