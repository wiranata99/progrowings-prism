import Panel from "../ui/Panel";

const warnings = [
  {
    level: "High",
    issue: "USD/IDR volatility continues to increase.",
    impact: "Potential mark-to-market impact on FX positions.",
    action: "Enhance daily monitoring and stress testing.",
  },
  {
    level: "Medium",
    issue: "Modified Duration approaching ALCO limit.",
    impact: "Higher sensitivity to upward interest rate movement.",
    action: "Review duration positioning and portfolio rebalancing.",
  },
  {
    level: "Low",
    issue: "Corporate bond allocation gradually increased.",
    impact: "Slight increase in investment credit exposure.",
    action: "Review issuer rating and concentration limits.",
  },
];

export default function TreasuryEarlyWarning() {
  return (
    <Panel>

      {/* Header */}

      <div className="mb-8 flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
            Early Warning
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Treasury Risk Alerts
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Key treasury indicators requiring management attention.
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.20em] text-slate-500">
            Active Alerts
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {warnings.length}
          </p>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900/70">

            <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Issue</th>
              <th className="px-5 py-4">Business Impact</th>
              <th className="px-5 py-4">Recommended Action</th>

            </tr>

          </thead>

          <tbody>

            {warnings.map((item) => (

              <tr
                key={item.issue}
                className="border-t border-slate-800 transition hover:bg-slate-800/40"
              >

                <td className="px-5 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.level === "High"
                        ? "bg-rose-500/15 text-rose-300"
                        : item.level === "Medium"
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {item.level}
                  </span>

                </td>

                <td className="px-5 font-medium text-white">
                  {item.issue}
                </td>

                <td className="px-5 text-slate-300 leading-7">
                  {item.impact}
                </td>

                <td className="px-5">

                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {item.action}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Summary */}

      <div className="mt-8 grid gap-5 lg:grid-cols-3">

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">

          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            High
          </p>

          <p className="mt-2 text-3xl font-bold text-rose-300">
            1
          </p>

        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            Medium
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-300">
            1
          </p>

        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            Low
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-300">
            1
          </p>

        </div>

      </div>

      {/* PRISM Insight */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Executive Insight
        </p>

        <p className="mt-4 leading-8 text-slate-300">

          Treasury risk exposure remains within the Bank's approved
          risk appetite despite increasing market volatility.
          Current duration positioning, investment concentration,
          and foreign exchange exposure continue to stay within
          ALCO-approved limits. Enhanced monitoring is recommended
          for FX movements and interest rate sensitivity over the
          coming trading sessions.

        </p>

      </div>

    </Panel>
  );
}