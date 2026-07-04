import type { MetricStatus } from "../types/metric";

export function getHealthScore(status: MetricStatus): number {
  switch (status) {
    case "Healthy":
      return 92;

    case "Watch":
      return 72;

    case "Critical":
      return 38;

    default:
      return 0;
  }
}