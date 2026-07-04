import Panel from "../ui/Panel";
import StatusBadge from "../ui/StatusBadge";
import { kriMonitoring } from "../../data/operational";

export default function KRIMonitoring() {
  return (
    <Panel
      title="Key Risk Indicator"
      subtitle="Enterprise operational risk monitoring"
    >
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="pb-4">Indicator</th>
              <th className="pb-4">Current</th>
              <th className="pb-4">Threshold</th>
              <th className="pb-4">Trend</th>
              <th className="pb-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {kriMonitoring.map((item) => (

              <tr
                key={item.indicator}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="py-5 font-medium">
                  {item.indicator}
                </td>

                <td>{item.current}</td>

                <td>{item.threshold}</td>

                <td
                  className={
                    item.trend === "▲"
                      ? "font-bold text-rose-400"
                      : "font-bold text-emerald-400"
                  }
                >
                  {item.trend}
                </td>

                <td>

                  <StatusBadge
                    status={
                      item.status === "Healthy"
                        ? "success"
                        : item.status === "Watch"
                        ? "warning"
                        : "danger"
                    }
                    text={item.status}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Panel>
  );
}