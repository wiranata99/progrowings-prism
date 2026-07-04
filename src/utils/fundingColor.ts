export function getFundingColor(name: string) {
  switch (name) {
    case "Current Account":
      return "bg-cyan-500";

    case "Saving Account":
      return "bg-sky-500";

    case "Time Deposit":
      return "bg-amber-400";

    default:
      return "bg-slate-500";
  }
}