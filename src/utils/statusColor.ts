import type { MetricStatus } from "../types/metric";

export function getStatusBadge(status: MetricStatus) {
  switch (status) {
    case "Healthy":
      return "bg-emerald-500/15 text-emerald-400";

    case "Watch":
      return "bg-amber-500/15 text-amber-400";

    case "Critical":
      return "bg-rose-500/15 text-rose-400";

    default:
      return "";
  }
}

export function getStatusDot(status: MetricStatus) {
  switch (status) {
    case "Healthy":
      return "bg-emerald-400";

    case "Watch":
      return "bg-amber-400";

    case "Critical":
      return "bg-rose-400";

    default:
      return "";
  }
}