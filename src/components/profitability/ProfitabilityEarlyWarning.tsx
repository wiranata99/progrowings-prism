import Panel from "../ui/Panel";
import { profitabilityEarlyWarning } from "../../data/profitability";
import { getPriorityBadge } from "../../utils/priorityColor";

export default function ProfitabilityEarlyWarning() {
  return (
    <Panel title="Early Warning">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="pb-4">Priority</th>
              <th className="pb-4">Indicator</th>
              <th className="pb-4">Current</th>
              <th className="pb-4">Threshold</th>
              <th className="pb-4">Impact</th>
              <th className="pb-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {profitabilityEarlyWarning.map((item) => (

              <tr
                key={item.indicator}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="py-5">

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(item.priority)}`}>
                    {item.priority}
                  </span>

                </td>

                <td className="font-medium">

                  {item.indicator}

                </td>

                <td>

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