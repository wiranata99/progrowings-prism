const legends = [
  {
    label: "Low",
    color: "bg-emerald-500",
  },
  {
    label: "Medium",
    color: "bg-amber-400",
  },
  {
    label: "High",
    color: "bg-orange-500",
  },
  {
    label: "Extreme",
    color: "bg-red-500",
  },
];

export default function RiskLegend() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-8">

      {legends.map((item) => (

        <div
          key={item.label}
          className="flex items-center gap-3"
        >

          <div
            className={`h-4 w-4 rounded-full ${item.color}`}
          />

          <span className="text-sm text-slate-300">
            {item.label}
          </span>

        </div>

      ))}

    </div>
  );
}