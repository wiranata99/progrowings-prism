export type RiskStatus =
  | "Excellent"
  | "Healthy"
  | "Watch"
  | "Elevated"
  | "Critical";

export interface RiskDriver {
  id: string;
  title: string;
  impact: "positive" | "negative";
  description?: string;
}

export interface PrismRisk {
  score: number;
  status: RiskStatus;
  trend: number;
  confidence: number;
  indicators: number;
  lastUpdated: string;

  positiveDrivers: RiskDriver[];
  negativeDrivers: RiskDriver[];
}