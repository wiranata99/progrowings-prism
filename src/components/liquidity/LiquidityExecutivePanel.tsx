import type {
  LiquidityExecutiveViewModel,
} from "../../presentation/mappers/liquidityExecutiveMapper";

interface LiquidityExecutivePanelProps {
  data:
    | LiquidityExecutiveViewModel
    | null;
}

const statusStyles = {
  Healthy: {
    border: "border-cyan-500/20",
    background: "bg-cyan-500/5",
    title: "text-cyan-400",
  },

  Watch: {
    border: "border-amber-500/20",
    background: "bg-amber-500/5",
    title: "text-amber-400",
  },

  Warning: {
    border: "border-orange-500/20",
    background: "bg-orange-500/5",
    title: "text-orange-400",
  },

  Critical: {
    border: "border-rose-500/20",
    background: "bg-rose-500/5",
    title: "text-rose-400",
  },
} as const;

export default function LiquidityExecutivePanel({
  data,
}: LiquidityExecutivePanelProps) {
  if (!data) {
    return null;
  }

  const assessmentStyle =
    statusStyles[data.status];

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7">

      {/* Header */}

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Executive Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Liquidity Risk Brief
          </h2>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
          Reporting Date {data.asOfDate} | 08:00 WIB
        </div>

      </div>

      {/* Executive Summary */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Executive Summary
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          {data.executiveSummary}
        </p>

      </section>

      {/* Management Attention */}

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
          Management Attention
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          {data.managementAttention.map(
            (item) => (
              <li
                key={item}
                className="flex items-start gap-3"
              >
                <span className="mt-1 text-amber-400">
                  •
                </span>

                <span>{item}</span>
              </li>
            )
          )}

        </ul>

      </section>

      {/* Recommended Actions */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          {data.recommendedActions.map(
            (item) => (
              <li
                key={item}
                className="flex items-start gap-3"
              >
                <span className="mt-1 text-emerald-400">
                  ✓
                </span>

                <span>{item}</span>
              </li>
            )
          )}

        </ul>

      </section>

      {/* Overall Assessment */}

      <section
        className={[
          "mt-8 rounded-2xl border p-5",
          assessmentStyle.border,
          assessmentStyle.background,
        ].join(" ")}
      >

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>

            <p
              className={[
                "text-xs font-semibold uppercase tracking-[0.18em]",
                assessmentStyle.title,
              ].join(" ")}
            >
              Overall Assessment
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {data.assessmentTitle}
            </h3>

          </div>

          <div className="flex flex-wrap gap-3">

            <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
              Risk Level: {data.riskLevel}
            </div>

            <div className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-300">
              Funding: {data.fundingStatus}
            </div>

            <div className="rounded-full bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-300">
              Monitoring: {data.monitoringStatus}
            </div>

          </div>

        </div>

        <p className="mt-4 leading-7 text-slate-300">
          {data.assessmentNarrative}
        </p>

      </section>

    </div>
  );
}