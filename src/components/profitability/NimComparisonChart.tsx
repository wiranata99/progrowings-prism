import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getNimComparison, type NimComparison } from "../../services/profitabilityApi";

const percent = (value: number | null | undefined) => value == null ? "—" : `${value.toFixed(2)}%`;
export default function NimComparisonChart() {
  const [data, setData] = useState<NimComparison | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    getNimComparison(controller.signal).then((result) => { if (!controller.signal.aborted) setData(result); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, []);
  const latest = data?.points.at(-1);
  const hasData = data?.points.some((p) => p.actualNimMtm !== null || p.actualNimAnnual !== null);
  return <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8" aria-label="Actual NIM comparison">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">Margin performance</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Actual NIM · MTM vs Annual</h2>
        <p className="mt-2 text-xs text-slate-400">Monthly annualised margin and year-to-date annualised margin.</p></div>
      {latest && <div className="flex flex-wrap gap-6 text-sm">
        <div><p className="text-xs text-slate-400">MTM</p><p className="mt-1 text-xl font-semibold text-cyan-300">{percent(latest.actualNimMtm)}</p></div>
        <div><p className="text-xs text-slate-400">Annual · YTD</p><p className="mt-1 text-xl font-semibold text-violet-300">{percent(latest.actualNimAnnual)}</p></div>
        <div><p className="text-xs text-slate-400">Difference</p><p className="mt-1 text-xl font-semibold text-white">{latest.spreadBps === null ? "—" : `${latest.spreadBps > 0 ? "+" : ""}${latest.spreadBps.toFixed(0)} bps`}</p></div>
      </div>}
    </div>
    {!data && !error && <div role="status" className="mt-6 h-64 animate-pulse rounded-xl bg-slate-800"> <span className="sr-only">Loading NIM comparison</span></div>}
    {(error || (data && !hasData)) && <p role="status" className="py-14 text-center text-sm text-slate-400">NIM comparison data is currently unavailable.</p>}
    {data && hasData && <>
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.points} margin={{ top: 10, right: 18, left: 0, bottom: 8 }} accessibilityLayer>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="reportingDate" tickFormatter={(value: string) => new Date(value).toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" })} stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(value: number) => `${value}%`} stroke="#94a3b8" tick={{ fontSize: 11 }} width={48} />
            <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" }}
              formatter={(value) => percent(typeof value === "number" ? value : null)} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 14 }} />
            <Line type="monotone" dataKey="actualNimMtm" name="Actual NIM MTM" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="actualNimAnnual" name="Actual NIM Annual" stroke="#a78bfa" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-3 text-xs text-slate-400"><summary className="cursor-pointer">Calculation basis and monthly values</summary>
        <p className="mt-2">MTM: {data.monthlyBasis}. Annual: {data.annualBasis}. Both series use percentage points; missing observations remain blank.</p>
        <div className="mt-3 overflow-x-auto"><table className="w-full text-left"><thead><tr><th className="py-2">Date</th><th>MTM</th><th>Annual</th><th>Difference</th></tr></thead>
          <tbody>{data.points.map((p) => <tr key={p.reportingDate}><td className="py-1">{p.reportingDate}</td><td>{percent(p.actualNimMtm)}</td><td>{percent(p.actualNimAnnual)}</td><td>{p.spreadBps === null ? "—" : `${p.spreadBps.toFixed(2)} bps`}</td></tr>)}</tbody></table></div>
      </details>
    </>}
  </section>;
}
