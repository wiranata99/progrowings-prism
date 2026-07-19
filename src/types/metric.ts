export type MetricStatus =
  | "Healthy"
  | "Watch"
  | "Warning"
  | "Critical";

export interface MetricData {
  title: string;
  subtitle?: string;
  value: string;
  trend?: string;
  target?: string;
  previousEom?: string;
  status?: MetricStatus;
}