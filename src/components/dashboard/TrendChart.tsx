import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 1.90 },
  { month: "Feb", value: 2.05 },
  { month: "Mar", value: 2.01 },
  { month: "Apr", value: 2.18 },
  { month: "May", value: 2.32 },
  { month: "Jun", value: 2.37 },
  { month: "Jul", value: 2.42 },
];

export default function TrendChart() {
  return (
    <div className="h-[320px]">

      <div className="mb-6 flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Enterprise Trend
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            2.42%
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest observation
          </p>

        </div>

        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400">
          Stable
        </span>

      </div>

      <ResponsiveContainer
        width="100%"
        height={210}
      >

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="riskArea"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#22D3EE"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#22D3EE"
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
            tick={{
              fill: "#94A3B8",
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fill: "#94A3B8",
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 0.05", "dataMax + 0.05"]}
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "14px",
              color: "white",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#22D3EE"
            strokeWidth={3}
            fill="url(#riskArea)"
            animationDuration={900}
            activeDot={{
              r: 6,
              stroke: "#22D3EE",
              strokeWidth: 2,
              fill: "#ffffff",
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}