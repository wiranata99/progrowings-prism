import type { MetricStatus } from "../types/metric";

export function getStatusDot(
  status: MetricStatus
): string {
  switch (status) {
    case "Healthy":
      return "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]";

    case "Watch":
      return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.55)]";

    case "Warning":
      return "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.60)]";

    case "Critical":
      return "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.60)]";

    default:
      return "bg-slate-400";
  }
}

export function getStatusBadge(
  status: MetricStatus
): string {
  switch (status) {
    case "Healthy":
      return [
        "border",
        "border-emerald-500/20",
        "bg-emerald-500/15",
        "text-emerald-400",
      ].join(" ");

    case "Watch":
      return [
        "border",
        "border-amber-500/20",
        "bg-amber-500/15",
        "text-amber-400",
      ].join(" ");

    case "Warning":
      return [
        "border",
        "border-orange-500/25",
        "bg-gradient-to-r",
        "from-orange-500/20",
        "to-amber-500/10",
        "text-orange-300",
        "shadow-sm",
        "shadow-orange-500/10",
      ].join(" ");

    case "Critical":
      return [
        "border",
        "border-rose-500/25",
        "bg-rose-500/15",
        "text-rose-400",
      ].join(" ");

    default:
      return [
        "border",
        "border-slate-600/30",
        "bg-slate-700/30",
        "text-slate-300",
      ].join(" ");
  }
}