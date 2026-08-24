import { API_BASE_URL } from "../config/api";

export interface CreditSummaryItem {
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

export async function getCreditSummary(
  signal?: AbortSignal,
): Promise<CreditSummaryItem[]> {
  const response = await fetch(
    API_BASE_URL + "/intelligence/credit/summary",
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch Credit Summary: " + response.status,
    );
  }

  const payload =
    (await response.json()) as ApiResponse<CreditSummaryItem[]>;

  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error(
      payload.message || "Failed to fetch Credit Summary.",
    );
  }

  return payload.data;
}
