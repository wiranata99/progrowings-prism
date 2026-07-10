export interface IntelligenceItem {
  id: string;

  category: string;

  headline: string;

  exposureTitle: string;

  exposureValue: string;

  impact: string;

  recommendation: string;
}

export const strategicIntelligence: IntelligenceItem[] = [
  {
    id: "bi-rate",

    category: "Monetary Policy",

    headline:
      "Bank Indonesia maintained the policy rate at 5.50%, indicating a stable domestic interest rate environment.",

    exposureTitle: "Affected Portfolio",

    exposureValue: "Floating Rate Loans • Rp8.6 T",

    impact:
      "Funding costs and Net Interest Margin are expected to remain broadly stable over the near term.",

    recommendation:
      "Continue current lending strategy while monitoring future BI policy direction.",
  },

  {
    id: "usd",

    category: "Foreign Exchange",

    headline:
      "USD/IDR remains under upward pressure amid global market uncertainty.",

    exposureTitle: "Affected Borrowers",

    exposureValue: "14 Corporate Borrowers • Rp1.8 T",

    impact:
      "Higher debt servicing costs may increase migration risk for selected USD borrowers.",

    recommendation:
      "Review repayment capacity and hedge coverage for major FX borrowers.",
  },

  {
    id: "construction",

    category: "Sector Outlook",

    headline:
      "Construction activity continues to recover, although liquidity pressure remains uneven across contractors.",

    exposureTitle: "Affected Portfolio",

    exposureValue: "Construction Loans • Rp4.2 T",

    impact:
      "Stage 2 migration risk remains elevated for medium-sized construction borrowers.",

    recommendation:
      "Increase monitoring frequency for construction-related borrowers with high exposure.",
  },
];