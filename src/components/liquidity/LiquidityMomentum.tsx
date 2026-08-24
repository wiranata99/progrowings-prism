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
} from "../../types/liquidity";

import {
  getLiquidityCoreMetrics,
  type LiquidityCoreMetricsData,
  type LiquidityCoreMetricsPoint,
} from "../../services/liquidityCoreMetricsApi";

type LiquidityMomentumPeriod =
  | 5
  | 10
  | 20
  | 30;

interface ChartPoint {
  date: string;
  fullDate: string;
  value: number;
  components: Record<string, number>;
}

interface MetricViewModel {
  key: LiquidityMetricKey;
  label: string;
  unit: LiquidityMetricUnit;
  current: number | null;
  change: number | null;
  status: string;
  points: ChartPoint[];
}

interface TooltipPayloadItem {
  value?: number;
  payload?: ChartPoint;
}

interface MomentumTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  metricKey: LiquidityMetricKey;
  unit: LiquidityMetricUnit;
  label: string;
}

const periods: LiquidityMomentumPeriod[] = [
  5,
  10,
  20,
  30,
];

const metricConfig: Record<
  LiquidityMetricKey,
  {
    label: string;
    unit: LiquidityMetricUnit;
    color: string;
  }
> = {
  lcr: {
    label: "LCR",
    unit: "percentage",
    color: "#06b6d4",
  },

  nsfrDaily: {
    label: "NSFR Daily",
    unit: "percentage",
    color: "#10b981",
  },

  alDpk: {
    label: "AL / DPK",
    unit: "percentage",
    color: "#3b82f6",
  },

  casa: {
    label: "CASA",
    unit: "percentage",
    color: "#f59e0b",
  },

  excessLiquidity: {
    label: "Excess Liquidity",
    unit: "currency",
    color: "#a855f7",
  },
};

const componentLabels: Record<
  LiquidityMetricKey,
  Record<string, string>
> = {
  lcr: {
    hqla: "HQLA",
    netCashOutflow: "Net Cash Outflow",
  },

  nsfrDaily: {
    availableStableFunding:
      "Available Stable Funding",
    requiredStableFunding:
      "Required Stable Funding",
  },

  alDpk: {
    liquidAssets: "Liquid Assets",
    thirdPartyFunds: "Third Party Funds",
  },

  casa: {
    currentAccount: "Current Account",
    savingsAccount: "Savings Account",
    thirdPartyFunds: "Third Party Funds",
  },

  excessLiquidity: {
    availableLiquidity:
      "Available Liquidity",
    requiredLiquidity:
      "Required Liquidity",
  },
};

function formatCurrency(
  value: number
): string {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toFixed(
      2
    )} T`;
  }

  if (absolute >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(
      2
    )} B`;
  }

  if (absolute >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(
      2
    )} M`;
  }

  return `Rp ${value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )}`;
}

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

  return formatCurrency(value);
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

  return `${sign}${formatCurrency(value)}`;
}

function formatDate(
  value: string
): {
  short: string;
  full: string;
} {
  const date = new Date(value);

  return {
    short: date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
      }
    ),

    full: date.toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ),
  };
}

function getStatus(
  key: LiquidityMetricKey,
  value: number
): string {
  switch (key) {
    case "lcr":
      if (value < 100) return "Critical";
      if (value < 110) return "Warning";
      if (value < 120) return "Watch";
      return "Healthy";

    case "nsfrDaily":
      if (value < 100) return "Critical";
      if (value < 105) return "Warning";
      if (value < 110) return "Watch";
      return "Healthy";

    case "alDpk":
      if (value < 10) return "Critical";
      if (value < 15) return "Warning";
      if (value < 20) return "Watch";
      return "Healthy";

    case "casa":
      if (value < 40) return "Warning";
      if (value < 50) return "Watch";
      return "Healthy";

    case "excessLiquidity":
      if (value < 0) return "Critical";
      return "Healthy";

    default:
      return "Healthy";
  }
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

function buildMetric(
  key: LiquidityMetricKey,
  data: LiquidityCoreMetricsData
): MetricViewModel {
  const config = metricConfig[key];

  const points = data.history
    .map((row: LiquidityCoreMetricsPoint) => {
      const metric = row.metrics[key];

      if (!metric) {
        return null;
      }

      const formattedDate = formatDate(
        row.reportingDate
      );

      return {
        date: formattedDate.short,
        fullDate: formattedDate.full,
        value: metric.value,
        components:
          metric.components ?? {},
      };
    })
    .filter(
      (point): point is ChartPoint =>
        point !== null
    );

  const current =
    data.current?.metrics[key]?.value ??
    null;

  const first =
    points.length > 0
      ? points[0].value
      : null;

  const change =
    current !== null &&
    first !== null
      ? current - first
      : null;

  return {
    key,
    label: config.label,
    unit: config.unit,
    current,
    change,
    status:
      current === null
        ? "Unavailable"
        : getStatus(key, current),
    points,
  };
}

function MomentumTooltip({
  active,
  payload,
  metricKey,
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

  const labels =
    componentLabels[metricKey];

  const components = Object.entries(
    point.components ?? {}
  );

  return (
    <div className="min-w-[260px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 shadow-2xl">
      <p className="text-xs font-medium text-slate-400">
        {point.fullDate}
      </p>

      <div className="mt-3 flex items-center justify-between gap-8">
        <span className="text-sm font-medium text-slate-300">
          {label}
        </span>

        <span className="text-sm font-semibold text-white">
          {formatMetricValue(
            value,
            unit
          )}
        </span>
      </div>

      {components.length > 0 && (
        <>
          <div className="my-3 border-t border-slate-800" />

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Underlying Components
          </p>

          <div className="space-y-2">
            {components.map(
              ([key, componentValue]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-8"
                >
                  <span className="text-xs text-slate-400">
                    {labels[key] ?? key}
                  </span>

                  <span className="text-xs font-medium text-slate-200">
                    {formatCurrency(
                      componentValue
                    )}
                  </span>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function LiquidityMomentum() {
  const [period, setPeriod] =
    useState<LiquidityMomentumPeriod>(20);

  const [
    selectedMetricKey,
    setSelectedMetricKey,
  ] =
    useState<LiquidityMetricKey>("lcr");

  const [data, setData] =
    useState<LiquidityCoreMetricsData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(false);

        const result =
          await getLiquidityCoreMetrics(
            period
          );

        if (active) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Failed to load Liquidity Core Metrics",
          err
        );

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [period]);

  const metrics = useMemo(() => {
    if (!data) {
      return [];
    }

    const keys: LiquidityMetricKey[] = [
      "lcr",
      "nsfrDaily",
      "alDpk",
      "casa",
      "excessLiquidity",
    ];

    return keys.map((key) =>
      buildMetric(key, data)
    );
  }, [data]);

  const selectedMetric = useMemo(
    () =>
      metrics.find(
        (metric) =>
          metric.key === selectedMetricKey
      ) ?? metrics[0],
    [metrics, selectedMetricKey]
  );

  useEffect(() => {
    if (
      selectedMetric &&
      selectedMetric.current === null
    ) {
      const firstAvailable =
        metrics.find(
          (metric) =>
            metric.current !== null
        );

      if (firstAvailable) {
        setSelectedMetricKey(
          firstAvailable.key
        );
      }
    }
  }, [selectedMetric, metrics]);

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

  if (loading && !data) {
    return (
      <Panel
        title="Liquidity Momentum"
        subtitle="Select an indicator to inspect its historical movement."
        headerAction={headerAction}
      >
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          Loading liquidity momentum...
        </div>
      </Panel>
    );
  }

  if (
    error ||
    !data ||
    !selectedMetric
  ) {
    return (
      <Panel
        title="Liquidity Momentum"
        subtitle="Historical trend of key liquidity indicators."
        headerAction={headerAction}
      >
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          Liquidity momentum data is not
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
        {metrics.map((metric) => {
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
                        metricConfig[
                          metric.key
                        ].color
                      }
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={
                        false
                      }
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
        })}
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
                    : formatCurrency(
                        Number(value)
                      )
                }
              />

              <Tooltip
                content={
                  <MomentumTooltip
                    metricKey={
                      selectedMetric.key
                    }
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
                  metricConfig[
                    selectedMetric.key
                  ].color
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
