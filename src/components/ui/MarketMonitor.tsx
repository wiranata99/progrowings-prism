interface MarketItem {
  indicator: string;
  value: string;
  movement: string;
  status: "Positive" | "Stable" | "Watch";
}

interface MarketMonitorProps {
  title?: string;
  data: MarketItem[];
}

const statusColor = {
  Positive: "bg-emerald-500/15 text-emerald-400",
  Stable: "bg-cyan-500/15 text-cyan-400",
  Watch: "bg-amber-500/15 text-amber-400",
};

export default function MarketMonitor({
  title = "Market Monitor",
  data,
}: MarketMonitorProps) {
  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        <span className="text-sm text-slate-500">
          Live Market Snapshot
        </span>

      </div>

      <div className="space-y-3">

        {data.map((item) => (

          <div
            key={item.indicator}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 transition-all duration-300 hover:border-cyan-500/30"
          >

            <div>

              <p className="text-sm text-slate-400">
                {item.indicator}
              </p>

              <h4 className="mt-1 text-2xl font-bold">
                {item.value}
              </h4>

            </div>

            <div className="text-right">

              <p className="text-sm text-slate-300">
                {item.movement}
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  statusColor[item.status]
                }`}
              >
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}