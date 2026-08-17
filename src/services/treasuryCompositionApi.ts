export interface TreasuryCompositionMetric {
  amount: number;
  rate: number;
  tenor: number;
}

export interface TreasuryCompositionSection {
  IDR: TreasuryCompositionMetric;
  USD: TreasuryCompositionMetric;
  TOTAL: TreasuryCompositionMetric;
}

export interface TreasuryCompositionMatrix {
  fixed: TreasuryCompositionSection;
  floating: TreasuryCompositionSection;
  total: TreasuryCompositionSection;
}

export interface TreasuryComposition {
  reportingDate: string;

  fxRate: {
    usdIdr: number | null;
  };

  investment: TreasuryCompositionMatrix;
  funding: TreasuryCompositionMatrix;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3001/api/v1";

export async function getTreasuryComposition(): Promise<TreasuryComposition> {
  const response = await fetch(
    `${API_BASE_URL}/intelligence/treasury/composition`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Treasury Composition: ${response.status}`,
    );
  }

  const payload =
    (await response.json()) as ApiResponse<TreasuryComposition>;

  if (!payload.success) {
    throw new Error(
      payload.message ||
        "Failed to fetch Treasury Composition.",
    );
  }

  return payload.data;
}