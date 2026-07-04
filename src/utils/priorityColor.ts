import type { WarningPriority } from "../types/warning";

export function getPriorityBadge(priority: WarningPriority) {
  switch (priority) {
    case "High":
      return "bg-rose-500/15 text-rose-400";

    case "Medium":
      return "bg-amber-500/15 text-amber-400";

    case "Low":
      return "bg-emerald-500/15 text-emerald-400";

    default:
      return "";
  }
}