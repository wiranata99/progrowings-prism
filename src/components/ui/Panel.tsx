import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Panel({
  title,
  subtitle,
  badge,
  headerAction,
  children,
  className = "",
}: PanelProps) {
  return (
    <section
      className={`rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg ${className}`}
    >
      {(title || subtitle || badge || headerAction) && (
        <div className="mb-6 flex items-start justify-between">

          <div>

            {title && (
              <h3 className="text-xl font-semibold text-white">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-2 text-sm text-slate-400">
                {subtitle}
              </p>
            )}

          </div>

          <div className="flex items-center gap-3">

            {badge}

            {headerAction}

          </div>

        </div>
      )}

      {children}

    </section>
  );
}