import { API_BASE_URL } from "../config/api";

export type TreasuryAlertPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type TreasuryAlertStatus =
  | "WATCH"
  | "CRITICAL";

export interface TreasuryAlert {
  id: string;
  priority: TreasuryAlertPriority;
  status: TreasuryAlertStatus;
  metric: string;

  current: number;
  limit: number;
  utilization: number;

  issue: string;
  businessImpact: string;
  recommendedAction: string;
}

export interface TreasuryEarlyWarningData {
  reportingDate: string;

  overallStatus:
    | "HEALTHY"
    | "WATCH"
    | "CRITICAL";

  summary: {
    activeAlerts: number;
    high: number;
    medium: number;
    low: number;
  };

  alerts: TreasuryAlert[];

  executiveAssessment: string;
}

interface TreasuryEarlyWarningResponse {
  success: boolean;
  message: string;
  data: TreasuryEarlyWarningData;
}

export async function getTreasuryEarlyWarning():
  Promise<TreasuryEarlyWarningData> {

  const response = await fetch(
   `${API_BASE_URL}/intelligence/treasury/early-warning`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load Treasury Early Warning: ${response.status}`,
    );
  }

  const result: TreasuryEarlyWarningResponse =
    await response.json();

  if (!result.success || !result.data) {
    throw new Error(
      result.message ||
        "Failed to load Treasury Early Warning",
    );
  }

  return result.data;
}

