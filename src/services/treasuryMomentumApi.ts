import { API_BASE_URL } from "../config/api";
export type TreasuryMomentumCurrency =
  | "ALL"
  | "IDR"
  | "USD";

export type TreasuryMomentumBenchmark =
  | "INDONIA"
  | "SRBI_1Y"
  | "IDR_GOVT_5Y"
  | "SOFR"
  | "UST_1Y"
  | "UST_5Y";

export type TreasuryMomentumPeriod =
  | 5
  | 10
  | 20
  | 30;

export interface TreasuryMomentumPoint {
  date: string;
  day: string;

  assetYield: number;
  liabilityExpense: number;
  benchmark: number | null;

  treasurySpreadBps: number;
  assetToBenchmarkBps: number | null;
}

export interface TreasuryMomentumData {
  currency: TreasuryMomentumCurrency;

  benchmark: TreasuryMomentumBenchmark;
  benchmarkLabel: string;

  period: TreasuryMomentumPeriod;

  source: string;

  latest: TreasuryMomentumPoint | null;

  trend: TreasuryMomentumPoint[];
}

interface TreasuryMomentumResponse {
  success: boolean;
  message: string;
  data: TreasuryMomentumData;
}

export const treasuryMomentumBenchmarks = {
  ALL: [
    {
      value: "INDONIA",
      label: "INDONIA",
    },
    {
      value: "SRBI_1Y",
      label: "SRBI 1Y",
    },
    {
      value: "IDR_GOVT_5Y",
      label: "IDR Govt 5Y",
    },
  ],

  IDR: [
    {
      value: "INDONIA",
      label: "INDONIA",
    },
    {
      value: "SRBI_1Y",
      label: "SRBI 1Y",
    },
    {
      value: "IDR_GOVT_5Y",
      label: "IDR Govt 5Y",
    },
  ],

  USD: [
    {
      value: "SOFR",
      label: "SOFR",
    },
    {
      value: "UST_1Y",
      label: "UST 1Y",
    },
    {
      value: "UST_5Y",
      label: "UST 5Y",
    },
  ],
} satisfies Record<
  TreasuryMomentumCurrency,
  {
    value: TreasuryMomentumBenchmark;
    label: string;
  }[]
>;

export async function getTreasuryMomentum(
  currency: TreasuryMomentumCurrency = "ALL",
  benchmark?: TreasuryMomentumBenchmark,
  period: TreasuryMomentumPeriod = 30,
): Promise<TreasuryMomentumData> {
  const params = new URLSearchParams();

  params.set(
    "currency",
    currency,
  );

  params.set(
    "period",
    String(period),
  );

  if (benchmark) {
    params.set(
      "benchmark",
      benchmark,
    );
  }

  const response = await fetch(
  `${API_BASE_URL}/intelligence/treasury/momentum?${params.toString()}`
);

  if (!response.ok) {
    throw new Error(
      `Failed to load Treasury Momentum: ${response.status}`,
    );
  }

  const result: TreasuryMomentumResponse =
    await response.json();

  if (
    !result.success ||
    !result.data
  ) {
    throw new Error(
      result.message ||
        "Failed to load Treasury Momentum",
    );
  }

  return result.data;
}