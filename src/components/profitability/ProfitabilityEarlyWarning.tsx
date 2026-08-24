import Panel from "../ui/Panel";
import { getPriorityBadge } from "../../utils/priorityColor";
import type { ProfitabilityEarlyWarningViewModel } from "../../services/profitabilityApi";

export default function ProfitabilityEarlyWarning({ data }: { data: ProfitabilityEarlyWarningViewModel | null }) {
  return <Panel title="Early Warning"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.18em] text-slate-500"><th className="pb-4">Priority</th><th className="pb-4">Indicator</th><th className="pb-4">Current</th><th className="pb-4">Threshold</th><th className="pb-4">Status</th><th className="pb-4">Action</th></tr></thead><tbody>
    {(data?.alerts ?? []).map((item) => <tr key={item.indicator} className="border-b border-slate-800 transition hover:bg-slate-800/40"><td className="py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(item.priority)}`}>{item.priority}</span></td><td className="font-medium">{item.indicator}</td><td>{item.current.toFixed(2)}%</td><td>{item.threshold.toFixed(2)}%</td><td>{item.status}</td><td><span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">{item.action}</span></td></tr>)}
  </tbody></table>{!data && <p className="py-6 text-sm text-slate-500">Loading Profitability early-warning indicators...</p>}</div></Panel>;
}
