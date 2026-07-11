import { useMemo, useState } from "react";
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

import Panel from "../ui/Panel";
import CustomTooltip from "./LiquidityTooltip";
import { liquidityTrend } from "../../data/liquidity";

type Period = 1 | 3 | 6 | 12;

export default function LiquidityTrend() {
  const [period, setPeriod] = useState<Period>(12);

  const chartData = useMemo(() => {
    if (period === 12) return liquidityTrend;

    return liquidityTrend.slice(
      liquidityTrend.length - period
    );
  }, [period]);

  const values = chartData.map((d) => Number(d.value));

  const latest = values[values.length - 1];
  const peak = Math.max(...values);
  const lowest = Math.min(...values);

  return (
    <Panel>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Liquidity Momentum
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Liquidity Coverage Ratio (LCR)
          </h2>

          <p className="mt-2 text-slate-400">
            Liquidity Coverage Ratio trend and regulatory threshold monitoring.
          </p>

        </div>

        <div className="flex gap-2">

          {[
            { label: "5D", value: 5 },
            { label: "10D", value: 10 },
            { label: "25D", value: 25 },
            { label: "30D", value: 30 },
          ].map((item) => (

            <button
              key={item.value}
              onClick={() =>
                setPeriod(item.value as Period)
              }
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300

              ${
                period === item.value
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                  : "border border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-white"
              }`}
            >
              {item.label}
            </button>

          ))}

        </div>

      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-4">

        <MetricCard
          title="Latest LCR"
          value={`${latest.toFixed(2)}%`}
          color="text-cyan-400"
        />

        <MetricCard
          title="Peak"
          value={`${peak.toFixed(2)}%`}
          color="text-emerald-400"
        />

        <MetricCard
          title="Lowest"
          value={`${lowest.toFixed(2)}%`}
          color="text-amber-400"
        />

        <MetricCard
          title="Regulatory Minimum"
          value="100%"
          color="text-white"
          badge="Healthy"
        />

      </div>
            <div className="mt-8 h-[460px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="lcrGradient"
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
              dataKey="day"
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickFormatter={(v) => `${Number(v).toFixed(2)}%`}
              tickLine={false}
              axisLine={false}
            />

            <ReferenceLine
              y={100}
              stroke="#EF4444"
              strokeDasharray="6 6"
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#22D3EE",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#22D3EE"
              strokeWidth={4}
              fill="url(#lcrGradient)"
              animationDuration={900}
              activeDot={{
                r: 8,
                fill: "#22D3EE",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

        <div>

          <p className="text-sm text-slate-500">
            Last {period} Month{period > 1 ? "s" : ""}
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            LCR remains comfortably above regulatory minimum.
          </p>

        </div>

        <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">

          Healthy Liquidity

        </div>

      </div>

    </Panel>

  );

}

interface MetricCardProps {
  title: string;
  value: string;
  color: string;
  badge?: string;
}

function MetricCard({
  title,
  value,
  color,
  badge,
}: MetricCardProps) {
  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500">

        {title}

      </p>

      <p className={`mt-2 text-4xl font-bold ${color}`}>

        {value}

      </p>

      {badge && (

        <div className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">

          {badge}

        </div>

      )}

    </div>

  );

}