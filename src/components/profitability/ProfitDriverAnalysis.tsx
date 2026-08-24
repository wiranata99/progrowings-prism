import Panel from "../ui/Panel";
import type { ProfitabilityDriversViewModel } from "../../services/profitabilityApi";

export default function ProfitDriverAnalysis({ data }: { data: ProfitabilityDriversViewModel | null }) {
  return <Panel title="Executive Profit Driver">
    {!data ? <p className="text-sm text-slate-500">Loading Profitability drivers...</p> : <>
      <div className="grid gap-6 lg:grid-cols-2">
        {[["Positive Contributors", data.positive, "text-emerald-400"], ["Negative Contributors", data.negative, "text-rose-400"]].map(([title, items, tone]) => <div key={title as string}>
          <h3 className={`mb-5 text-sm font-semibold uppercase tracking-[0.18em] ${tone}`}>{title as string}</h3>
          <div className="space-y-4">{(items as ProfitabilityDriversViewModel["positive"]).map((item) => <div key={item.factor} className="rounded-2xl border border-slate-800 p-4"><div className="flex items-center justify-between"><span className="font-medium">{item.factor}</span><span className={`font-bold ${tone}`}>{item.impactBps > 0 ? "+" : ""}{item.impactBps} bps</span></div></div>)}</div>
        </div>) }
      </div>
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Executive Insight</p><p className="mt-4 leading-7 text-slate-300">Profitability remains supported by CASA growth, asset yield, and fee-based income. Cost of credit, operating expense, and corporate margin remain the principal adverse contributors requiring disciplined monitoring.</p></div>
    </>}
  </Panel>;
}
