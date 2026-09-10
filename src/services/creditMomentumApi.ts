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
  debtorId?: string | null;
  debtorCode?: string;
  reportingDate?: string;
  debtor: string;
  exposure: number;
  dpd: number;
  coll: string;
  priority: string;
  action: string;
}

export interface CreditStrategicItem {
  id: string;
  category: string;
  headline: string;
  exposureTitle: string;
  exposureValue: string;
  impact: string;
  recommendation: string;
}

export interface CreditExecutiveNarrative {
  title: string;
  summary: string;
  actions: string[];
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

async function getCreditObject<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(
    API_BASE_URL + "/intelligence/credit/" + path,
    { signal },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Credit " + path);
  }
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success || payload.data == null) {
    throw new Error(payload.message || "Credit data unavailable.");
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

export function getCreditStrategicIntelligence(signal?: AbortSignal): Promise<CreditStrategicItem[]> {
  return getCreditData<CreditStrategicItem>("strategic-intelligence", signal);
}

export function getCreditExecutiveNarrative(signal?: AbortSignal): Promise<CreditExecutiveNarrative> {
  return getCreditObject<CreditExecutiveNarrative>("executive-narrative", signal);
}

export interface CreditDebtorDetail {
  debtorId: string; debtorCode: string; debtorName: string; reportingDate: string | null;
  segment: string | null; sector: string | null; coreSector: string | null;
  riskLevel: string | null; riskScore: number | null; primaryTrigger: string | null;
  intelligenceNarrative: string | null; recommendedAttention: string | null;
  numberOfAccounts: number; restructureStatus: string;
  currencies: Array<{ currency: string; numberOfAccounts: number; outstandingAmount: number;
    totalCkpn: number | null; interestOverdue: number | null; appliedInterestRate: number | null }>;
}
export function getCreditDebtorDetail(debtorId: string, reportingDate?: string, signal?: AbortSignal) {
  const query = reportingDate ? `?reportingDate=${encodeURIComponent(reportingDate)}` : "";
  return getCreditObject<CreditDebtorDetail>(`debtors/${encodeURIComponent(debtorId)}/detail${query}`, signal);
}
