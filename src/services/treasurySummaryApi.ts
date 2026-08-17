import { API_BASE_URL } from "../config/api";
export interface TreasurySummaryItem {
  businessKey: string;
  title: string;
  value: number;
  unit: string;
  trend?: string;
  target?: string;
  status?: string;
  color?: string;
  icon?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getTreasurySummary(): Promise<
  TreasurySummaryItem[]
> {
  const response = await fetch(
    `${API_BASE_URL}/intelligence/treasury/summary`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Treasury Summary: ${response.status}`,
    );
  }

  const payload =
    (await response.json()) as ApiResponse<
      TreasurySummaryItem[]
    >;

  if (!payload.success) {
    throw new Error(
      payload.message ||
        "Failed to fetch Treasury Summary.",
    );
  }

  return payload.data;
}