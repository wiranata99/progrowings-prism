import Panel from "../ui/Panel";

const warnings = [
  {
    priority: "High",
    indicator: "DPK Net Outflow",
    current: "-11.8%",
    threshold: "-10%",
    impact: "High",
    action: "Escalate",
    color: "bg-rose-500/15 text-rose-400",
  },
  {
    priority: "Medium",
    indicator: "CASA Ratio",
    current: "41.6%",
    threshold: "45%",
    impact: "Medium",
    action: "Monitor",
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    priority: "Low",
    indicator: "LCR",
    current: "152%",
    threshold: ">100%",
    impact: "Low",
    action: "Normal",
    color: "bg-emerald-500/15 text-emerald-400",
  },
];

export default function LiquidityEarlyWarning() {
  return (
    <Panel title="Early Warning">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.2em] text-slate-500">

              <th className="pb-4">Priority</th>
              <th className="pb-4">Indicator</th>
              <th className="pb-4">Current</th>
              <th className="pb-4">Threshold</th>
              <th className="pb-4">Impact</th>
              <th className="pb-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {warnings.map((item) => (

              <tr
                key={item.indicator}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="py-5">

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>
                    {item.priority}
                  </span>

                </td>

                <td className="font-medium">
                  {item.indicator}
                </td>

                <td className="font-semibold">
                  {item.current}
                </td>

                <td>
                  {item.threshold}
                </td>

                <td>
                  {item.impact}
                </td>

                <td>

                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                    {item.action}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Panel>
  );
}