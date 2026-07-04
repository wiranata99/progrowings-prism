export type WarningPriority = "High" | "Medium" | "Low";

export interface WarningData {
  priority: WarningPriority;
  indicator: string;
  current: string;
  threshold: string;
  impact: WarningPriority;
  action: string;
}

export interface WatchlistData {
  priority: WarningPriority;
  debtor: string;
  exposure: string;
  dpd: number;
  coll: number;
  action: string;
}