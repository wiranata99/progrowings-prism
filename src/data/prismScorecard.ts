export interface PrismScorecardData {
  score: number;
  maxScore: number;
  status: string;
  appetite: string;
  direction: string;
  confidence: string;
  lastUpdated: string;
}

export const prismScorecard: PrismScorecardData = {
  score: 84,
  maxScore: 100,

  status: "Healthy",

  appetite: "Within Board-approved Risk Appetite",

  direction: "Improving",

  confidence: "High",

  lastUpdated: "30 Jun 2026",
};