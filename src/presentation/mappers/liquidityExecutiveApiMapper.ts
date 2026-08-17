import type {
  LiquidityExecutiveApiData,
} from "../../hooks/useLiquidityExecutive";

import type {
  LiquidityExecutiveViewModel,
} from "./liquidityExecutiveMapper";

import type {
  MetricStatus,
} from "../../types/metric";

function mapStatus(
  level: LiquidityExecutiveApiData["riskLevel"],
): MetricStatus {
  switch (level) {
    case "Critical":
      return "Critical";

    case "Warning":
      return "Warning";

    case "Watch":
      return "Watch";

    case "Healthy":
    default:
      return "Healthy";
  }
}

function mapRiskLevel(
  level: LiquidityExecutiveApiData["riskLevel"],
): string {
  switch (level) {
    case "Critical":
      return "CRITICAL";

    case "Warning":
      return "HIGH";

    case "Watch":
      return "MODERATE";

    case "Healthy":
    default:
      return "LOW";
  }
}

function mapFundingStatus(
  status: LiquidityExecutiveApiData["fundingStatus"],
): string {
  switch (status) {
    case "Critical":
      return "STRESSED";

    case "Warning":
      return "PRESSURED";

    case "Watch":
      return "MONITORED";

    case "Healthy":
    default:
      return "STABLE";
  }
}

function getAssessmentTitle(
  status: LiquidityExecutiveApiData["riskLevel"],
): string {
  switch (status) {
    case "Critical":
      return "Immediate Liquidity Intervention Required";

    case "Warning":
      return "Liquidity Pressure Requires Management Action";

    case "Watch":
      return "Liquidity Position Remains Adequate with Emerging Pressure";

    case "Healthy":
    default:
      return "Liquidity Position Remains Strong";
  }
}

function getAsOfDate(): string {
  return new Date().toLocaleDateString(
    "en-GB",
  );
}

export function mapLiquidityExecutiveApi(
  data: LiquidityExecutiveApiData,
): LiquidityExecutiveViewModel {
  return {
    asOfDate: getAsOfDate(),

    status: mapStatus(
      data.riskLevel,
    ),

    executiveSummary:
      data.executiveSummary,

    managementAttention:
      data.managementAttention,

    recommendedActions:
      data.recommendedActions,

    assessmentTitle:
      getAssessmentTitle(
        data.riskLevel,
      ),

    assessmentNarrative:
      data.assessmentNarrative,

    riskLevel:
      mapRiskLevel(
        data.riskLevel,
      ),

    fundingStatus:
      mapFundingStatus(
        data.fundingStatus,
      ),

    monitoringStatus: "DAILY",
  };
}