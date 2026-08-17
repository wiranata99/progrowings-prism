export type StrategicAssessment =
  | "Positive"
  | "Neutral"
  | "Watch";

export interface StrategicMarketIndicator {
  code: string;
  title: string;
  value: number;
  previousValue: number | null;
  unit: string;
  currency: string | null;
  formattedValue: string;
  change: string;
  direction: "UP" | "DOWN" | "HOLD";
}

export interface StrategicDriver {
  indicatorCode: string;
  event: string;
  impact: string;
  outlook: StrategicAssessment;
}

export interface TreasuryStrategicIntelligenceData {
  marketDate: string | null;

  marketData: StrategicMarketIndicator[];

  drivers: StrategicDriver[];

  portfolioContext: {
    securitiesMarketValue: number;
    modifiedDuration: number;
    portfolioDv01: number;
    governmentBondExposure: number;
    usdAssetExposure: number;
    usdLiabilityExposure: number;
    netUsdExposure: number;
    riskLevel: string;
  };

  strategicConclusion: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TreasuryStrategicIntelligenceData;
}

export async function getTreasuryStrategicIntelligence():
  Promise<TreasuryStrategicIntelligenceData> {

  const response = await fetch(
    "http://localhost:3001/api/v1/intelligence/treasury/strategic-intelligence",
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load Treasury Strategic Intelligence: ${response.status}`,
    );
  }

  const result: ApiResponse =
    await response.json();

  if (!result.success || !result.data) {
    throw new Error(
      result.message ||
        "Failed to load Treasury Strategic Intelligence",
    );
  }

  return result.data;
}