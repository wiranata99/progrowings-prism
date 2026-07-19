import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Panel from "../ui/Panel";

import type {
  LiquidityMetricKey,
  LiquidityMetricUnit,
  LiquidityMomentumPoint,
} from "../../types/liquidity";

import type { PrismModuleSnapshot } from "../../types/prism";

import {
  liquidityMomentumMapper,
  type LiquidityMomentumPeriod,
} from "../../presentation/mappers/liquidityMomentumMapper";

interface LiquidityMomentumProps {
  snapshot: PrismModuleSnapshot;
}

interface TooltipPayloadItem {
  value?: number;
  payload?: LiquidityMomentumPoint;
}

interface MomentumTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  unit: LiquidityMetricUnit;
  label: string;
}

const periods: LiquidityMomentumPeriod[] = [
  5,
  10,
  20,
  30,
];

const metricColors: Record<
  LiquidityMetricKey,
  string
> = {
  lcr: "#06b6d4",
  nsfrDaily: "#10b981",
  alDpk: "#3b82f6",
  casa: "#f59e0b",
  excessLiquidity: "#a855f7",
};

function formatMetricValue(
  value: number | null,
  unit: LiquidityMetricUnit
): string {
  if (value === null) {
    return "-";
  }

  if (unit === "percentage") {
    return `${value.toFixed(2)}%`;
  }

  if (Math.abs(value) >= 1000) {
    return `Rp ${(value / 1000).toFixed(
      2
    )} T`;
  }

  return `Rp ${value.toFixed(2)} B`;
}

function formatChange(
  value: number | null,
  unit: LiquidityMetricUnit
): string {
  if (value === null) {
    return "-";
  }

  const sign = value > 0 ? "+" : "";

  if (unit === "percentage") {
    return `${sign}${value.toFixed(
      2
    )} pts`;
  }

  if (Math.abs(value) >= 1000) {
    return `${sign}Rp ${(
      value / 1000
    ).toFixed(2)} T`;
  }

  return `${sign}Rp ${value.toFixed(
    2
  )} B`;
}

function getStatusTextClass(
  status: string
): string {
  switch (status) {
    case "Healthy":
      return "text-emerald-400";

    case "Watch":
      return "text-amber-400";

    case "Warning":
      return "text-orange-400";

    case "Critical":
      return "text-rose-400";

    default:
      return "text-slate-400";
  }
}

function getTrendTextClass(
  change: number | null
): string {
  if (change === null || change === 0) {
    return "text-slate-400";
  }

  return change > 0
    ? "text-emerald-400"
    : "text-rose-400";
}

function MomentumTooltip({
  active,
  payload,
  unit,
  label,
}: MomentumTooltipProps) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const point = payload[0]?.payload;
  const value = payload[0]?.value;

  if (
    !point ||
    typeof value !== "number"
  ) {
    return null;
  }

  return (
    <div className="min-w-[190px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-slate-400">
        {point.fullDate}
      </p>

      <div className="mt-3 flex items-center justify-between gap-6">
        <span className="text-sm text-slate-300">
          {label}
        </span>

        <span className="text-sm font-semibold text-white">
          {formatMetricValue(
            value,
            unit
          )}
        </span>
      </div>
    </div>
  );
}

export default function LiquidityMomentum({
  snapshot,
}: LiquidityMomentumProps) {
  const [period, setPeriod] =
    useState<LiquidityMomentumPeriod>(20);

  const [selectedMetricKey, setSelectedMetricKey] =
    useState<LiquidityMetricKey>("lcr");

  const viewModel = useMemo(
    () =>
      liquidityMomentumMapper(
        snapshot,
        period
      ),
    [snapshot, period]
  );

  const selectedMetric = useMemo(
    () =>
      viewModel.metrics.find(
        (metric) =>
          metric.key === selectedMetricKey
      ) ?? viewModel.metrics[0],
    [viewModel.metrics, selectedMetricKey]
  );

  useEffect(() => {
    if (!selectedMetric) {
      return;
    }

    if (
      selectedMetric.current === null
    ) {
      const firstAvailable =
        viewModel.metrics.find(
          (metric) =>
            metric.current !== null
        );

      if (firstAvailable) {
        setSelectedMetricKey(
          firstAvailable.key
        );
      }
    }
  }, [selectedMetric, viewModel.metrics]);

  const headerAction = (
    <div className="flex items-center gap-2">
      {periods.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setPeriod(item)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            period === item
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {item}D
        </button>
      ))}
    </div>
  );

  if (!selectedMetric) {
    return (
      <Panel
        title="Liquidity Momentum"
        subtitle="Historical trend of key liquidity indicators."
        headerAction={headerAction}
      >
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No historical liquidity data
          available.
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Liquidity Momentum"
      subtitle="Select an indicator to inspect its historical movement."
      headerAction={headerAction}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {viewModel.metrics.map(
          (metric) => {
            const isSelected =
              metric.key ===
              selectedMetric.key;

            return (
              <button
                key={metric.key}
                type="button"
                onClick={() =>
                  setSelectedMetricKey(
                    metric.key
                  )
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-cyan-500/60 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950 hover:-translate-y-0.5 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {metric.label}
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                      {formatMetricValue(
                        metric.current,
                        metric.unit
                      )}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold ${getStatusTextClass(
                      metric.status
                    )}`}
                  >
                    {metric.status}
                  </span>
                </div>

                <div className="mt-3 h-14">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={metric.points}
                      margin={{
                        top: 4,
                        right: 2,
                        bottom: 4,
                        left: 2,
                      }}
                    >
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          metricColors[
                            metric.key
                          ]
                        }
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-600">
                    {period}D Change
                  </span>

                  <span
                    className={`text-xs font-semibold ${getTrendTextClass(
                      metric.change
                    )}`}
                  >
                    {formatChange(
                      metric.change,
                      metric.unit
                    )}
                  </span>
                </div>
              </button>
            );
          }
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Selected Indicator
            </p>

            <div className="mt-2 flex items-center gap-3">
              <h4 className="text-xl font-semibold text-white">
                {selectedMetric.label} Trend
              </h4>

              <span
                className={`text-xs font-semibold ${getStatusTextClass(
                  selectedMetric.status
                )}`}
              >
                {selectedMetric.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Current
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {formatMetricValue(
                  selectedMetric.current,
                  selectedMetric.unit
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Period Change
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${getTrendTextClass(
                  selectedMetric.change
                )}`}
              >
                {formatChange(
                  selectedMetric.change,
                  selectedMetric.unit
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[360px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={selectedMetric.points}
              margin={{
                top: 10,
                right: 20,
                bottom: 0,
                left: 5,
              }}
            >
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={{
                  stroke: "#334155",
                }}
                tickLine={false}
                minTickGap={24}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={72}
                domain={["auto", "auto"]}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                tickFormatter={(value) =>
                  selectedMetric.unit ===
                  "percentage"
                    ? `${Number(
                        value
                      ).toFixed(0)}%`
                    : Number(value) >=
                      1000
                    ? `${(
                        Number(value) /
                        1000
                      ).toFixed(1)}T`
                    : `${Number(
                        value
                      ).toFixed(0)}B`
                }
              />

              <Tooltip
                content={
                  <MomentumTooltip
                    unit={
                      selectedMetric.unit
                    }
                    label={
                      selectedMetric.label
                    }
                  />
                }
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={
                  metricColors[
                    selectedMetric.key
                  ]
                }
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  fill: "#0f172a",
                }}
                connectNulls
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}