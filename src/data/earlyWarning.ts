import type {
  EarlyWarningSummary,
  MigrationData,
  EarlyWarningInsight,
} from "../types/earlyWarning";

export const earlyWarningSummary: EarlyWarningSummary = {
  critical: 3,
  high: 12,
  stable: 1284,
};

export const migrationData: MigrationData[] = [
  {
    id: "1",
    from: "COL 1",
    to: "COL 2",
    accounts: 18,
  },
  {
    id: "2",
    from: "COL 2",
    to: "COL 3",
    accounts: 4,
  },
  {
    id: "3",
    from: "COL 3",
    to: "NPL",
    accounts: 2,
  },
  {
    id: "4",
    from: "Recovery",
    to: "Current",
    accounts: 12,
  },
];

export const earlyWarningInsight: EarlyWarningInsight = {
  title: "Migration Trend",
  description:
    "Stage 2 migration increased during the current period, primarily driven by Construction and Commercial portfolios. Continue enhanced monitoring to prevent further deterioration.",
};