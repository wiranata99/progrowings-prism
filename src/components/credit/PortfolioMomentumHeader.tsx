type Period = 1 | 3 | 6 | 12;

interface Props {
  latest: number;
  peak: number;
  lowest: number;

  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

type ThresholdStatus =
  | "Breached"
  | "Almost Breached"
  | "Safe";

function getThresholdStatus(
  latest: number
): ThresholdStatus {
  if (latest > 5) {
    return "Breached";
  }

  if (latest >= 4) {
    return "Almost Breached";
  }

  return "Safe";
}

function getThresholdClass(
  status: ThresholdStatus
): string {
  if (status === "Breached") {
    return "bg-red-500/20 text-red-300";
  }

  if (status === "Almost Breached") {
    return "bg-amber-500/20 text-amber-300";
  }

  return "bg-emerald-500/20 text-emerald-300";
}

export default function PortfolioMomentumHeader({
  latest,
  peak,
  lowest,
  selectedPeriod,
  onPeriodChange,
}: Props) {
  const thresholdStatus =
    getThresholdStatus(latest);

  const thresholdClass =
    getThresholdClass(thresholdStatus);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Portfolio Momentum
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            NPL Trend (Gross)
          </h2>

          <p className="mt-2 max-w-2xl text-slate-400">
            Gross NPL Ratio over the last{" "}
            {selectedPeriod} month
            {selectedPeriod > 1 ? "s" : ""}{" "}
            compared with OJK threshold.
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { label: "1M", value: 1 },
            { label: "3M", value: 3 },
            { label: "6M", value: 6 },
            { label: "12M", value: 12 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() =>
                onPeriodChange(
                  item.value as Period
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                selectedPeriod === item.value
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                  : "border border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Latest NPL
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {latest.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Peak
          </p>

          <p className="mt-2 text-4xl font-bold text-red-400">
            {peak.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Lowest
          </p>

          <p className="mt-2 text-4xl font-bold text-emerald-400">
            {lowest.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
          <p className="text-xs uppercase tracking-wider text-cyan-300">
            Threshold OJK
          </p>

          <p className="mt-2 text-4xl font-bold text-white">
            5.00%
          </p>

          <div
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${thresholdClass}`}
          >
            {thresholdStatus}
          </div>
        </div>
      </div>
    </div>
  );
}