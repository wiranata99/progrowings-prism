interface StatusBadgeProps {
  status: "success" | "warning" | "danger";
  text: string;
}

const color = {
  success:
    "bg-emerald-500/15 text-emerald-400",

  warning:
    "bg-amber-500/15 text-amber-400",

  danger:
    "bg-red-500/15 text-red-400",
};

export default function StatusBadge({
  status,
  text,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${color[status]}`}
    >
      {text}
    </span>
  );
}