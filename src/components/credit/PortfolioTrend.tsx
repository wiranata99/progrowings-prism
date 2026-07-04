import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", npl: 2.91 },
  { month: "Feb", npl: 2.82 },
  { month: "Mar", npl: 2.76 },
  { month: "Apr", npl: 2.63 },
  { month: "May", npl: 2.51 },
  { month: "Jun", npl: 2.42 },
];

export default function PortfolioTrend() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Gross NPL Trend
          </h2>

          <p className="mt-2 text-slate-400">
            Six-month portfolio quality movement
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current
          </p>

          <h3 className="mt-1 text-4xl font-bold">
            2.42%
          </h3>

          <p className="mt-1 text-sm font-semibold text-emerald-400">
            ▼ Improving
          </p>

        </div>

      </div>

      <div className="mt-8 h-[280px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient id="nplFill" x1="0" y1="0" x2="0" y2="1">

                <stop
                  offset="0%"
                  stopColor="#22d3ee"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#22d3ee"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="#263244"
              strokeDasharray="4 6"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis
              domain={[2.3, 3]}
              stroke="#94a3b8"
            />

            <Tooltip
              formatter={(value) => [
            `${Number(value).toFixed(2)}%`,
            "Gross NPL Ratio",
            ]}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}

              labelFormatter={(label) => `Periode : ${label}`}
            />

            

            <Area
              type="monotone"
              dataKey="npl"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#nplFill)"
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}