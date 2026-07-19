import type { PrismModuleSnapshot } from "../../types/prism";
import type { MetricStatus } from "../../types/metric";

import type {
  LiquidityAnalytics,
  LiquidityHistory,
  LiquidityMetricKey,
  LiquidityMetricUnit,
  LiquidityMomentumMetric,
  LiquidityMomentumPoint,
} from "../../types/liquidity";

export type LiquidityMomentumPeriod = 5 | 10 | 20 | 30;

export type LiquidityTrendInsight =
  | "Improving"
  | "Stable"
  | "Deteriorating";

export interface LiquidityMomentumViewModel {
  period: LiquidityMomentumPeriod;
  metrics: LiquidityMomentumMetric[];
  insight: LiquidityTrendInsight;
  strongestMetric: string;
  weakestMetric: string;
}

interface MetricDefinition {
  key: LiquidityMetricKey;
  label: string;
  unit: LiquidityMetricUnit;
  valueField:
    | "lcr"
    | "nsfr_daily"
    | "al/dpk"
    | "casa_ratio"
    | "exc_lqd";
  statusField:
    | "lcr_s"
    | "nsfr_daily_s"
    | "al/dpk_s"
    | "casa_ratio_s"
    | "exc_lqd_s";
}

const metricDefinitions: MetricDefinition[] = [
  {
    key: "lcr",
    label: "LCR",
    unit: "percentage",
    valueField: "lcr",
    statusField: "lcr_s",
  },
  {
    key: "nsfrDaily",
    label: "NSFR Daily",
    unit: "percentage",
    valueField: "nsfr_daily",
    statusField: "nsfr_daily_s",
  },
  {
    key: "alDpk",
    label: "AL/DPK",
    unit: "percentage",
    valueField: "al/dpk",
    statusField: "al/dpk_s",
  },
  {
    key: "casa",
    label: "CASA Ratio",
    unit: "percentage",
    valueField: "casa_ratio",
    statusField: "casa_ratio_s",
  },
  {
    key: "excessLiquidity",
    label: "Excess Liquidity",
    unit: "currency",
    valueField: "exc_lqd",
    statusField: "exc_lqd_s",
  },
];

function toTimestamp(
  value: Date | string | number
): number {
  const date = new Date(value);
  const timestamp = date.getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function formatShortDate(
  value: Date | string | number
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatFullDate(
  value: Date | string | number
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeValue(
  value: unknown,
  unit: LiquidityMetricUnit
): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  if (unit === "percentage") {
    return value * 100;
  }

  return value;
}

function normalizeStatus(
  value: unknown
): MetricStatus {
  if (typeof value !== "string") {
    return "Healthy";
  }

  const status = value.trim().toLowerCase();

  if (
    status === "healthy" ||
    status === "adequate"
  ) {
    return "Healthy";
  }

  if (status === "watch") {
    return "Watch";
  }

  if (status === "warning") {
    return "Warning";
  }

  if (status === "critical") {
    return "Critical";
  }

  return "Healthy";
}

function getRelativeChange(
  first: number | null,
  last: number | null
): number {
  if (
    first === null ||
    last === null ||
    first === 0
  ) {
    return 0;
  }

  return (last - first) / Math.abs(first);
}

function buildMetric(
  rows: LiquidityHistory[],
  definition: MetricDefinition
): LiquidityMomentumMetric {
  const points: LiquidityMomentumPoint[] =
    rows.map((row) => ({
      date: formatShortDate(row.date),
      fullDate: formatFullDate(row.date),
      value: normalizeValue(
        row[definition.valueField],
        definition.unit
      ),
    }));

  const validPoints = points.filter(
    (
      point
    ): point is LiquidityMomentumPoint & {
      value: number;
    } => point.value !== null
  );

  const first =
    validPoints.length > 0
      ? validPoints[0].value
      : null;

  const last =
    validPoints.length > 0
      ? validPoints[
          validPoints.length - 1
        ].value
      : null;

  const latestRow =
    rows.length > 0
      ? rows[rows.length - 1]
      : undefined;

  return {
    key: definition.key,
    label: definition.label,
    unit: definition.unit,
    status: normalizeStatus(
      latestRow?.[definition.statusField]
    ),
    current: last,
    previous: first,
    change:
      first !== null && last !== null
        ? last - first
        : null,
    relativeChange: getRelativeChange(
      first,
      last
    ),
    points,
  };
}

export function liquidityMomentumMapper(
  snapshot: PrismModuleSnapshot,
  period: LiquidityMomentumPeriod = 20
): LiquidityMomentumViewModel {
  const analytics =
    snapshot.analytics as unknown as LiquidityAnalytics;

  const history =
    analytics.history ?? [];

  const sortedHistory = [...history].sort(
    (a, b) =>
      toTimestamp(a.date) -
      toTimestamp(b.date)
  );

  const rows = sortedHistory.slice(-period);

  const metrics = metricDefinitions.map(
    (definition) =>
      buildMetric(rows, definition)
  );

  const availableMetrics = metrics.filter(
    (metric) => metric.current !== null
  );

  if (availableMetrics.length === 0) {
    return {
      period,
      metrics,
      insight: "Stable",
      strongestMetric: "-",
      weakestMetric: "-",
    };
  }

  const rankedMetrics = [
    ...availableMetrics,
  ].sort(
    (a, b) =>
      b.relativeChange -
      a.relativeChange
  );

  const improvingCount =
    availableMetrics.filter(
      (metric) =>
        metric.relativeChange > 0.005
    ).length;

  const deterioratingCount =
    availableMetrics.filter(
      (metric) =>
        metric.relativeChange < -0.005
    ).length;

  let insight: LiquidityTrendInsight =
    "Stable";

  if (
    improvingCount >
    deterioratingCount
  ) {
    insight = "Improving";
  } else if (
    deterioratingCount >
    improvingCount
  ) {
    insight = "Deteriorating";
  }

  return {
    period,
    metrics,
    insight,
    strongestMetric:
      rankedMetrics[0]?.label ?? "-",
    weakestMetric:
      rankedMetrics[
        rankedMetrics.length - 1
      ]?.label ?? "-",
  };
}