import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Panel({
  title,
  children,
  className = "",
}: PanelProps) {
  return (
    <section
      className={`rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg ${className}`}
    >
      {title && (
        <h3 className="mb-6 text-xl font-semibold text-white">
          {title}
        </h3>
      )}

      {children}
    </section>
  );
}