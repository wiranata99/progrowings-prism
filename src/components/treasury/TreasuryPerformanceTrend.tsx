import { useMemo, useState } from "react";
import Panel from "../ui/Panel";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { treasuryTrend } from "../../data/treasury";
import TreasuryTooltip from "./TreasuryTooltip";

type Period = 5 | 10 | 20 | 30;

export default function TreasuryPerformanceTrend() {

  const [period, setPeriod] = useState<Period>(30);

  const chartData = useMemo(() => {
    return treasuryTrend.slice(
      treasuryTrend.length - period
    );
  }, [period]);

  const latest = chartData[chartData.length - 1];

  const portfolio = latest?.portfolio ?? 0;
  const benchmark = latest?.benchmark ?? 0;

  const alpha = (portfolio - benchmark) * 100;

  const trackingError = 0.18;

  return (

    <Panel>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">

            Treasury Momentum

          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">

            Portfolio vs Benchmark

          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">

            Treasury portfolio performance
            against benchmark government securities
            during the selected trading period.

          </p>

        </div>

        <div className="flex gap-2">

          {[
            {
              label: "5D",
              value: 5,
            },
            {
              label: "10D",
              value: 10,
            },
            {
              label: "20D",
              value: 20,
            },
            {
              label: "30D",
              value: 30,
            },
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
          title="Portfolio Yield"
          value={`${portfolio.toFixed(2)}%`}
          color="text-cyan-400"
        />

        <MetricCard
          title="Benchmark Yield"
          value={`${benchmark.toFixed(2)}%`}
          color="text-white"
        />

        <MetricCard
          title="Alpha"
          value={`+${alpha.toFixed(0)} bps`}
          color="text-emerald-400"
        />

        <MetricCard
          title="Tracking Error"
          value={`${trackingError.toFixed(2)}%`}
          color="text-amber-400"
        />

      </div>

      <div className="mt-7 flex items-center justify-between">

        <div className="flex items-center gap-8">

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-cyan-400"/>

            <span className="text-sm text-slate-300">

              Portfolio Yield

            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-0.5 w-8 border-t-2 border-dashed border-emerald-400"/>

            <span className="text-sm text-slate-300">

              Benchmark Yield

            </span>

          </div>

        </div>

        <span className="text-sm text-slate-500">

          Last {period} Trading Days

        </span>

      </div>

      <div className="mt-8 h-[440px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid
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
              domain={[5.8, 7.0]}
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickFormatter={(v) =>
                `${Number(v).toFixed(2)}%`
              }
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={<TreasuryTooltip />}
              cursor={{
                stroke: "#22D3EE",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />

            <Line
              dataKey="portfolio"
              stroke="#22D3EE"
              strokeWidth={4}
              dot={false}
              activeDot={{
                r: 8,
                fill: "#22D3EE",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
              name="Portfolio Yield"
            />

            <Line
              dataKey="benchmark"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="8 6"
              dot={false}
              activeDot={{
                r: 7,
              }}
              name="Benchmark Yield"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.20em] text-emerald-400">

              Executive Insight

            </p>

            <p className="mt-4 leading-8 text-slate-300">

              Treasury portfolio continues to outperform the benchmark,
              generating positive alpha of
              <span className="font-semibold text-emerald-400">
                {" "}+29 bps
              </span>.
              Current portfolio positioning remains appropriate under
              prevailing market conditions while duration exposure
              stays within ALCO-approved limits.

            </p>

          </div>

          <div className="ml-10 text-right">

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">

              Analysis Period

            </p>

            <p className="mt-2 text-xl font-bold text-cyan-400">

              Last {period} Trading Days

            </p>

          </div>

        </div>

      </div>

    </Panel>

  );

}

interface MetricCardProps {

  title: string;

  value: string;

  color: string;

}

function MetricCard({

  title,

  value,

  color,

}: MetricCardProps) {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500">

        {title}

      </p>

      <p className={`mt-2 text-4xl font-bold ${color}`}>

        {value}

      </p>

    </div>

  );

}