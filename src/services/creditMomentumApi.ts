import { API_BASE_URL } from "../config/api";
import type { DatabaseRow } from "../data/database/DatabaseReader";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getCreditMomentum(
  signal?: AbortSignal,
): Promise<DatabaseRow[]> {
  const response = await fetch(
    API_BASE_URL + "/intelligence/credit/momentum",
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch Credit Momentum: " + response.status,
    );
  }

  const payload =
    (await response.json()) as ApiResponse<DatabaseRow[]>;

  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error(
      payload.message || "Failed to fetch Credit Momentum.",
    );
  }

  return payload.data;
}
