export type WarningPriority = "High" | "Medium" | "Low";

export interface WarningData {
  priority: WarningPriority;
  indicator: string;
  current: string;
  threshold: string;
  impact: WarningPriority;
  action: string;
}