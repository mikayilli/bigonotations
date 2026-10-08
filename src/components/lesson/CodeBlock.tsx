/** Read-only code listing with line numbers and highlighted (currently executing) lines. */
export function CodeBlock({ code, active = [], label }: { code: string; active?: number[]; label: string }) {
  const lines = code.split("\n");
  return (
    <pre
      aria-label={label}
      className="overflow-x-auto rounded-xl border border-line bg-surface-2 py-2 font-mono text-[13px] leading-6"
    >
      <code className="block min-w-max">
        {lines.map((line, i) => {
          const on = active.includes(i + 1);
          return (
            <span
              key={i}
              className={`flex border-l-4 pr-4 ${on ? "border-accent bg-accent-soft" : "border-transparent"}`}
            >
              <span className="w-9 shrink-0 select-none pr-3 text-right text-muted" aria-hidden="true">
                {i + 1}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
              {on && <span className="sr-only"> (running)</span>}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
