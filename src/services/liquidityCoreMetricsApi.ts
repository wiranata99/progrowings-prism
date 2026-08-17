export type LiquidityMetricKey =
  | "lcr"
  | "nsfrDaily"
  | "alDpk"
  | "casa"
  | "excessLiquidity";

export interface LiquidityMetricApiValue {
  value: number;
  unit: "percentage" | "currency";
  components: Record<string, number>;
}

export interface LiquidityCoreMetricsPoint {
  reportingDate: string;

  metrics: Record<
    LiquidityMetricKey,
    LiquidityMetricApiValue
  >;

  source: string;
}

export interface LiquidityCoreMetricsData {
  reportingDate: string | null;
  period: number;
  current: LiquidityCoreMetricsPoint | null;
  history: LiquidityCoreMetricsPoint[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3001/api/v1";

export async function getLiquidityCoreMetrics(
  period: 5 | 10 | 20 | 30 = 30
): Promise<LiquidityCoreMetricsData> {
  const response = await fetch(
    `${API_BASE_URL}/intelligence/liquidity/core-metrics?period=${period}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load Liquidity Core Metrics: ${response.status}`
    );
  }

  const result =
    (await response.json()) as ApiResponse<LiquidityCoreMetricsData>;

  if (!result.success) {
    throw new Error(
      result.message ||
        "Failed to load Liquidity Core Metrics"
    );
  }

  return result.data;
}