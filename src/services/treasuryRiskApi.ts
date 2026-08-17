import { API_BASE_URL } from "../config/api";
export interface TreasuryRiskAnalytics {
  reportingDate: string;

  portfolio: {
    marketValue: number;
    modifiedDuration: number;
    dv01: number;
    var99: number;
    varToPortfolio: number;
    riskLevel: string;
  };

  limits: {
  modifiedDuration: {
    current: number;
    limit: number;
    utilization: number;
    status: "HEALTHY" | "WATCH" | "CRITICAL";
  };

  dv01: {
    current: number;
    limit: number;
    utilization: number;
    status: "HEALTHY" | "WATCH" | "CRITICAL";
  };

  var99: {
    current: number;
    limit: number;
    utilization: number;
    status: "HEALTHY" | "WATCH" | "CRITICAL";
  };

  varToPortfolio: {
    current: number;
    limit: number;
    utilization: number;
    status: "HEALTHY" | "WATCH" | "CRITICAL";
  };
};

  concentration: {
    largestRisk: {
      instrumentId: string;
      instrumentName: string;
      marketValue: number;
      dv01: number;
      dv01Share: number;
    } | null;

    instruments: {
      instrumentId: string;
      instrumentName: string;
      marketValue: number;
      dv01: number;
      dv01Share: number;
    }[];
  };

  methodology: string;
  confidenceLevel: number;
  holdingPeriodDays: number;
  scenarioCount: number;
  worstLoss: number;
  averageLoss: number;
}

export interface InterestRateSensitivityBucket {
  bucket: string;
  outstanding: number;
  dv01: number;
  dv01Contribution: number;
  shock100bpsImpact: number;
}

export interface InterestRateSensitivity {
  buckets: InterestRateSensitivityBucket[];

  total: {
    outstanding: number;
    dv01: number;
    dv01Contribution: number;
    shock100bpsImpact: number;
  };
}

export interface TreasuryPortfolioRiskInstrument {
  instrumentId: string;
  instrumentName: string;
  instrumentType: string;
  accountingClass: string | null;

  currency: string;
  rateType: string;

  nominalValue: number;
  bookValue: number;
  marketValue: number;
  currentYield: number;

  maturityDate: string;
  remainingTenorYears: number;

  macaulayDuration: number;
  modifiedDuration: number;
  dv01: number;
}

export interface TreasuryPortfolioRisk {
  reportingDate: string | null;

  totalMarketValue: number;
  portfolioDv01: number;
  weightedModifiedDuration: number;

  interestRateSensitivity: InterestRateSensitivity;

  instruments: TreasuryPortfolioRiskInstrument[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


// ============================================================
// Executive Treasury Risk Analytics
// ============================================================

export async function getTreasuryRiskAnalytics(): Promise<TreasuryRiskAnalytics> {
  const response = await fetch(
    `${API_BASE_URL}/intelligence/treasury/risk-analytics`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Treasury Risk Analytics: ${response.status}`,
    );
  }

  const payload =
    (await response.json()) as ApiResponse<TreasuryRiskAnalytics>;

  if (!payload.success) {
    throw new Error(
      payload.message ||
        "Failed to fetch Treasury Risk Analytics.",
    );
  }

  return payload.data;
}

// ============================================================
// Treasury Portfolio Risk Engine
// ============================================================

export async function getTreasuryPortfolioRisk(): Promise<TreasuryPortfolioRisk> {
  const response = await fetch(
    `${API_BASE_URL}/intelligence/treasury/risk`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Treasury Portfolio Risk: ${response.status}`,
    );
  }

  const payload =
    (await response.json()) as ApiResponse<TreasuryPortfolioRisk>;

  if (!payload.success) {
    throw new Error(
      payload.message ||
        "Failed to fetch Treasury Portfolio Risk.",
    );
  }

  return payload.data;
}