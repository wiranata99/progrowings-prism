import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Panel from "../ui/Panel";
import { operationalLossTrend } from "../../data/operational";

export default function OperationalLossTrend() {
  return (
    <Panel
      title="Operational Loss Trend"
      subtitle="Six-month operational loss movement"
    >
      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={operationalLossTrend}>

            <defs>

              <linearGradient
                id="lossGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#22d3ee"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#22d3ee"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip
              formatter={(value) => [
                `Rp ${value} B`,
                "Operational Loss",
              ]}
            />

            <Area
              type="monotone"
              dataKey="loss"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#lossGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>
    </Panel>
  );
}