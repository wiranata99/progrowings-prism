import { API_BASE_URL } from "../config/api";

export interface TreasuryExecutiveIntelligenceData {
  reportingDate: string | null;
  generatedAt: string;

  summary: string;
  attention: string[];
  recommendations: string[];

  assessment: string;

  confidence: string;
  confidenceScore: number;

  status: string;
  overallStatus: "HEALTHY" | "WATCH" | "CRITICAL";

  supportingContext: {
    portfolioRiskLevel: string;
    activeAlerts: number;
    highAlerts: number;
    watchDrivers: number;
    positiveDrivers: number;
    modifiedDuration: number;
    dv01: number;
    var99: number;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TreasuryExecutiveIntelligenceData;
}

export async function getTreasuryExecutiveIntelligence():
  Promise<TreasuryExecutiveIntelligenceData> {

  const response = await fetch(
    `${API_BASE_URL}/intelligence/treasury/executive-intelligence`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load Treasury Executive Intelligence: ${response.status}`,
    );
  }

  const result: ApiResponse =
    await response.json();

  if (!result.success || !result.data) {
    throw new Error(
      result.message ||
        "Failed to load Treasury Executive Intelligence",
    );
  }

  return result.data;
}