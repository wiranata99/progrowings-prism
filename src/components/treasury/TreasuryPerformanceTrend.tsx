import Panel from "../ui/Panel";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { treasuryTrend } from "../../data/treasury";

export default function TreasuryPerformanceTrend() {
  return (
    <Panel>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Performance Analysis
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Portfolio vs Benchmark
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400 leading-7">
            Comparison between Treasury Portfolio Yield and
            benchmark government securities during the last
            30 trading days.
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-6 py-5">

          <div className="grid grid-cols-3 gap-8">

            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Portfolio
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                6.84%
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Benchmark
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-300">
                6.55%
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Alpha
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                +29 bps
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-10 h-[430px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={treasuryTrend}>

            <CartesianGrid
              stroke="#1f2937"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
              domain={[5.8, 7.0]}
            />

            <Tooltip />

            <Legend />

            <Line
              dataKey="portfolio"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              name="Portfolio Yield"
            />

            <Line
              dataKey="benchmark"
              stroke="#10b981"
              strokeWidth={3}
              strokeDasharray="8 6"
              dot={{ r: 4 }}
              name="Benchmark Yield"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Executive Insight
        </p>

        <p className="mt-4 leading-8 text-slate-300">

          Treasury Portfolio consistently outperformed its benchmark
          throughout the last 30 trading days, generating a positive
          alpha of <span className="font-semibold text-emerald-400">29 bps</span>.
          The performance reflects effective portfolio allocation and
          duration management under current market conditions.

        </p>

      </div>

    </Panel>
  );
}