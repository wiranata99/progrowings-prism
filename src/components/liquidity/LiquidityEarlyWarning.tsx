import Panel from "../ui/Panel";
import { liquidityEarlyWarning } from "../../data/liquidity";
import { getPriorityBadge } from "../../utils/priorityColor";

export default function LiquidityEarlyWarning() {
  return (
    <Panel title="Liquidity Early Warning">

      {/* Header */}

      <div className="mb-8 flex items-start justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Liquidity Early Warning
          </h2>

          <p className="mt-2 text-slate-400">
            Key liquidity indicators requiring management attention.
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Active Alerts
          </p>

          <p className="mt-1 text-4xl font-bold text-cyan-400">
            {liquidityEarlyWarning.length}
          </p>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-xs uppercase tracking-[0.20em] text-slate-500">

              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Indicator</th>
              <th className="px-5 py-4">Current</th>
              <th className="px-5 py-4">Threshold</th>
              <th className="px-5 py-4">Impact</th>
              <th className="px-5 py-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {liquidityEarlyWarning.map((item) => (

              <tr
                key={item.indicator}
                className="border-b border-slate-800 transition hover:bg-slate-800/40"
              >

                <td className="px-5 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>

                </td>

                <td className="px-5 font-medium text-white">
                  {item.indicator}
                </td>

                <td className="px-5 font-semibold text-cyan-400">
                  {item.current}
                </td>

                <td className="px-5 text-slate-300">
                  {item.threshold}
                </td>

                <td className="px-5 text-slate-300">
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

      {/* Executive Insight */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          Four liquidity indicators currently require management attention.
          Despite these alerts, all key regulatory liquidity ratios remain
          comfortably above internal risk appetite and OJK minimum
          requirements. Current funding conditions continue to support a
          resilient liquidity position with no immediate funding stress
          identified.
        </p>

      </div>

    </Panel>
  );
}