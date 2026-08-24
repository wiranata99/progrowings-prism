import { API_BASE_URL } from "../config/api";
import type { DatabaseRow } from "../data/database/DatabaseReader";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreditSector {
  name: string;
  exposure: number;
  npl: number;
  percentage: number;
}

export interface CreditWatchlistItem {
  debtor: string;
  exposure: number;
  dpd: number;
  coll: string;
  priority: string;
  action: string;
}

async function getCreditData<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const response = await fetch(
    API_BASE_URL + "/intelligence/credit/" + path,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch Credit " + path + ": " + response.status,
    );
  }

  const payload = (await response.json()) as ApiResponse<T[]>;

  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error(
      payload.message || "Failed to fetch Credit " + path + ".",
    );
  }

  return payload.data;
}

export function getCreditMomentum(
  signal?: AbortSignal,
): Promise<DatabaseRow[]> {
  return getCreditData<DatabaseRow>("momentum", signal);
}

export function getCreditSectors(
  signal?: AbortSignal,
): Promise<CreditSector[]> {
  return getCreditData<CreditSector>("sectors", signal);
}

export function getCreditWatchlist(
  signal?: AbortSignal,
): Promise<CreditWatchlistItem[]> {
  return getCreditData<CreditWatchlistItem>("watchlist", signal);
}
