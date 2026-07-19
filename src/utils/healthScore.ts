import type { MetricStatus } from "../types/metric";

export function getHealthScore(
  status: MetricStatus
): number {
  switch (status) {
    case "Healthy":
      return 92;

    case "Watch":
      return 72;

    case "Warning":
      return 48;

    case "Critical":
      return 28;

    default:
      return 0;
  }
}