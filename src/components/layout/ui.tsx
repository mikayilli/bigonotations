import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: Tag = "section",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
} & React.AriaAttributes) {
  return (
    <Tag {...rest} className={`rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5 ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, sub, id }: { children: ReactNode; sub?: ReactNode; id?: string }) {
  return (
    <div className="mb-3">
      <h2 id={id} className="text-lg font-semibold tracking-tight">
        {children}
      </h2>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export function PageHeading({ title, sub }: { title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {sub && <p className="mt-2 max-w-3xl text-muted">{sub}</p>}
    </div>
  );
}

export function Callout({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  const tones = {
    info: "border-accent/40 bg-accent-soft",
    warn: "border-warn/50 bg-warn/10",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}>{children}</div>;
}

/** Monospace chip for formulas and notation. */
export function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono ${className}`}>{children}</span>;
}

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const variants = {
    primary: "bg-accent text-bg hover:opacity-90",
    secondary: "border border-line bg-surface text-ink hover:bg-surface-2",
    ghost: "text-muted hover:bg-surface-2 hover:text-ink",
  };
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
