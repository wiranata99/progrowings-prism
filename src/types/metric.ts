export type MetricStatus = "Healthy" | "Watch" | "Critical";

export interface MetricData {
  title: string;
  value: string;
  trend: string;
  target: string;
  status: MetricStatus;
}