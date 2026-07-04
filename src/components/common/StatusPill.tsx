interface StatusPillProps {
  status: "Healthy" | "Watch" | "Critical";
}

export default function StatusPill({
  status,
}: StatusPillProps) {

  const styles = {
    Healthy:
      "bg-emerald-500/15 text-emerald-400",

    Watch:
      "bg-amber-500/15 text-amber-400",

    Critical:
      "bg-rose-500/15 text-rose-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}