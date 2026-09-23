import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TrendPoint {
  reportingDate: string;
  value: number;
}

interface TrendChartProps {
  label?: string;
  unit?: string;
  points?: TrendPoint[];
}

export default function TrendChart({ label = "Enterprise", unit = "%", points = [] }: TrendChartProps) {
  const data = points.map((point) => ({
    ...point,
    month: new Date(point.reportingDate).toLocaleDateString("en-GB", { month: "short" }),
  }));

  if (!data.length) {
    return <div className="flex h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-800 text-sm text-slate-500">No trend observations available.</div>;
  }

  const latest = data.at(-1)?.value ?? 0;
  const previous = data.at(-2)?.value ?? latest;
  const delta = latest - previous;

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Latest {label}</p>
          <p className="mt-2 text-3xl font-black text-white">{latest.toFixed(2)}{unit}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Latest movement</p>
          <p className={`mt-2 text-3xl font-black ${delta <= 0 ? "text-emerald-300" : "text-amber-300"}`}>{delta > 0 ? "+" : ""}{delta.toFixed(2)} pp</p>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboardTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#263244" strokeDasharray="4 6" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={38} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value) => [`${Number(value).toFixed(2)}${unit}`, label]}
            />
            <Area type="monotone" dataKey="value" stroke="#22D3EE" strokeWidth={3} fill="url(#dashboardTrend)" activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
