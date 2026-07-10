import { prismRisk } from "../../data/prismRisk";

export default function ExecutiveDecision() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-10 py-10">

      {/* Header */}

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
          Executive Decision
        </p>

        <h1 className="mt-5 text-5xl font-bold tracking-tight text-white">
          Maintain Current Credit Strategy
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          Portfolio remains within the approved Risk Appetite.
          No immediate management action is required, although
          enhanced monitoring should continue for selected sectors.
        </p>

      </div>

      {/* Confidence */}

      <div className="mt-8 inline-flex items-center rounded-full bg-emerald-500/15 px-5 py-2">

        <span className="text-sm font-semibold text-emerald-400">
          Confidence {prismRisk.confidence}%
        </span>

      </div>

      {/* Divider */}

      <div className="my-10 h-px bg-slate-800" />

      {/* Risk Index */}

      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-10">

        <div>

          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
            PRISM Risk Index™
          </p>

          <div className="mt-2 flex items-end gap-5">

            <span className="text-8xl font-black tracking-tight text-white">
              {prismRisk.score}
            </span>

            <span className="mb-3 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
              {prismRisk.status}
            </span>

          </div>

          <div className="mt-6 h-3 w-80 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-700"
              style={{
                width: `${prismRisk.score}%`,
              }}
            />

          </div>

        </div>

        <div className="flex gap-10">

          <div>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Trend
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              ▲ +{prismRisk.trend}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Indicators
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {prismRisk.indicators}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Updated
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {prismRisk.lastUpdated}
            </p>

          </div>

        </div>

      </div>

      {/* Divider */}

      <div className="my-10 h-px bg-slate-800" />

      {/* Drivers */}

      <div className="grid gap-10 xl:grid-cols-2">

        <div>

          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Key Positive Drivers
          </h2>

          <div className="mt-6 space-y-4">

            {prismRisk.positiveDrivers.map((item) => (

              <div
                key={item.id}
                className="flex items-center gap-3"
              >

                <span className="text-emerald-400 text-lg">
                  ↑
                </span>

                <span className="text-slate-200">
                  {item.title}
                </span>

              </div>

            ))}

          </div>

        </div>

        <div>

          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            Management Attention
          </h2>

          <div className="mt-6 space-y-4">

            {prismRisk.negativeDrivers.map((item) => (

              <div
                key={item.id}
                className="flex items-center gap-3"
              >

                <span className="text-amber-400 text-lg">
                  ↓
                </span>

                <span className="text-slate-200">
                  {item.title}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Divider */}

      <div className="my-10 h-px bg-slate-800" />

      {/* Actions */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

        <div>

          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Recommended Actions
          </h2>

          <ul className="mt-5 space-y-3 text-slate-300">

            <li>• Continue current credit strategy.</li>

            <li>• Review Construction portfolio performance.</li>

            <li>• Monitor Top 20 obligors closely.</li>

          </ul>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Estimated Reading Time
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            45 sec
          </p>

        </div>

      </div>

    </section>
  );
}