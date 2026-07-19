import type { MetricStatus } from "./metric";

export interface LiquidityHistory {
  date: Date | string | number;

  lcr?: number | null;
  lcr_s?: string | null;

  nsfr_daily?: number | null;
  nsfr_daily_s?: string | null;

  "al/dpk"?: number | null;
  "al/dpk_s"?: string | null;

  casa_ratio?: number | null;
  casa_ratio_s?: string | null;

  exc_lqd?: number | null;
  exc_lqd_s?: string | null;

  [key: string]: unknown;
}

export interface LiquidityAnalytics {
  history?: LiquidityHistory[];
}

export type LiquidityMetricKey =
  | "lcr"
  | "nsfrDaily"
  | "alDpk"
  | "casa"
  | "excessLiquidity";

export type LiquidityMetricUnit =
  | "percentage"
  | "currency";

export interface LiquidityMomentumPoint {
  date: string;
  fullDate: string;
  value: number | null;
}

export interface LiquidityMomentumMetric {
  key: LiquidityMetricKey;
  label: string;
  unit: LiquidityMetricUnit;
  status: MetricStatus;
  current: number | null;
  previous: number | null;
  change: number | null;
  relativeChange: number;
  points: LiquidityMomentumPoint[];
}