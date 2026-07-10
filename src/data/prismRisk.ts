import type { PrismRisk } from "../types/prismRisk";

export const prismRisk: PrismRisk = {
  score: 84,
  status: "Healthy",
  trend: 2.4,
  confidence: 96,
  indicators: 42,
  lastUpdated: "30 Jun 2026",

  positiveDrivers: [
    {
      id: "collection",
      title: "Collection Performance",
    impact: "positive",
    },
    {
      id: "coverage",
      title: "Coverage Ratio",
      impact: "positive",
    },
    {
      id: "gross_npl",
      title: "Gross NPL Improvement",
      impact: "positive",
    },
  ],

  negativeDrivers: [
    {
      id: "stage2",
      title: "Stage 2 Migration",
      impact: "negative",
    },
    {
      id: "construction",
      title: "Construction Concentration",
      impact: "negative",
    },
  ],
};