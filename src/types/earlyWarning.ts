export interface EarlyWarningSummary {
  critical: number;
  high: number;
  stable: number;
}

export interface MigrationData {
  id: string;
  from: string;
  to: string;
  accounts: number;
}

export interface EarlyWarningInsight {
  title: string;
  description: string;
}