import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

import CustomTooltip from "./CustomTooltip";

interface Props {
  data: any[];
  period: 1 | 3 | 6 | 12;
}

export default function PortfolioMomentumChart({
  data,
  period,
}: Props) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex gap-8 text-sm">

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            <span className="text-slate-300">
              Gross NPL Ratio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-red-400" />
            <span className="text-slate-300">
              OJK Threshold
            </span>
          </div>

        </div>

        <div className="text-sm text-slate-500">
          Last {period} Month{period > 1 ? "s" : ""}
        </div>

      </div>

      <div className="h-[460px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="nplGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#22D3EE"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#22D3EE"
                  stopOpacity={0}
                />
              </linearGradient>

            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#243244"
              strokeDasharray="4 6"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 6]}
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />

            <ReferenceLine
              y={5}
              stroke="#F87171"
              strokeDasharray="6 6"
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#22D3EE",
                strokeDasharray: "5 5",
                strokeWidth: 2,
              }}
            />

            <Area
              type="monotone"
              dataKey="totalRatio"
              stroke="#22D3EE"
              strokeWidth={4}
              fill="url(#nplGradient)"
              animationDuration={900}
              activeDot={{
                r: 8,
                fill: "#22D3EE",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

        <div>
          <p className="text-sm text-slate-500">
            Latest Observation
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            Gross NPL remains below regulatory threshold.
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
          Healthy Portfolio
        </div>

      </div>

    </div>
  );
}