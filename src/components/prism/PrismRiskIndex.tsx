import { prismRisk } from "../../data/prismRisk";

export default function PrismRiskIndex() {
  const progress = `${prismRisk.score}%`;

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.30em] text-cyan-400">
            PRISM
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Risk Index™
          </h2>

          <p className="mt-2 text-slate-400">
            Executive Decision Intelligence
          </p>

        </div>

        <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
          {prismRisk.status}
        </div>

      </div>

      {/* Score */}

      <div className="mt-10">

        <div className="text-7xl font-black tracking-tight text-white">
          {prismRisk.score}
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-700"
            style={{
              width: progress,
            }}
          />

        </div>

      </div>

      {/* Metrics */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Trend
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            ▲ +{prismRisk.trend}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Confidence
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {prismRisk.confidence}%
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Indicators
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {prismRisk.indicators}
          </p>

        </div>

      </div>

      {/* Drivers */}

      <div className="mt-10 grid gap-6 xl:grid-cols-2">

        <div>

          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Top Positive Drivers
          </h3>

          <div className="mt-4 space-y-3">

            {prismRisk.positiveDrivers.map((driver) => (

              <div
                key={driver.id}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
              >

                <p className="font-medium text-white">

                  ↑ {driver.title}

                </p>

              </div>

            ))}

          </div>

        </div>

        <div>

          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
            Top Risk Drivers
          </h3>

          <div className="mt-4 space-y-3">

            {prismRisk.negativeDrivers.map((driver) => (

              <div
                key={driver.id}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3"
              >

                <p className="font-medium text-white">

                  ↓ {driver.title}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">

        <div>

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Last Updated
          </p>

          <p className="mt-1 font-medium text-slate-300">
            {prismRisk.lastUpdated}
          </p>

        </div>

        <button className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
          Open Executive Insight →
        </button>

      </div>

    </section>
  );
}