export type EclStressEngineMode = "manual-showcase" | "api";

export interface EclStressIntegrationContract {
  mode: EclStressEngineMode;
  portfolioSource: "manual" | "portfolio-api";
  pdSource: "manual" | "pd-engine";
  lgdSource: "manual" | "lgd-engine";
  scenarioSource: "manual" | "macro-scenario-engine";
}

/**
 * V1 is deliberately frontend-only for showcase speed.
 * This contract marks the future adapter boundary without coupling the UI
 * to a backend implementation today.
 */
export const ECL_STRESS_V1_INTEGRATION: EclStressIntegrationContract = {
  mode: "manual-showcase",
  portfolioSource: "manual",
  pdSource: "manual",
  lgdSource: "manual",
  scenarioSource: "manual",
};
