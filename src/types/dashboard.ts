export interface DashboardDomain {
  key: string;
  name: string;
  indicator: string;
  indicatorLabel?: string;
  value: number;
  previousValue?: number | null;
  unit?: string;
  reportingDate?: string | null;
  scoreBasis?: string;
  scoreBasisLabel?: string;
  scoreBasisValue?: number;
  scoreBasisPreviousValue?: number | null;
  scoreBasisUnit?: string;
  status: "HEALTHY" | "WATCH" | "WARNING" | "CRITICAL";
  score: number;
}

export interface DashboardContext {
  portfolioValue: number | null;
  portfolioUnit: string;
  riskAppetite: string;
  scoredDomains: number;
  stressLayer: string;
}

export interface DashboardMarketMetric {
  code: string;
  label: string;
  value: number;
  previousValue: number | null;
  unit: string;
  marketDate: string;
}

export interface DashboardData {
  reportingDate: string;
  enterpriseScore: number;
  previousEnterpriseScore?: number;
  status: string;
  delta: number;
  context?: DashboardContext;
  domains: DashboardDomain[];
  market: DashboardMarketMetric[];
  trend: {
    label: string;
    unit: string;
    points: Array<{ reportingDate: string; value: number }>;
  };
  alerts: Array<{ level: string; title: string; description: string }>;
}
