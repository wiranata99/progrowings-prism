import { strategicIntelligence } from "../../data/strategicIntelligence";

export default function StrategicIntelligence() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.30em] text-cyan-400">
            Strategic Intelligence
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            External Environment Assessment
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-slate-400">
            Macroeconomic developments and industry trends with potential
            implications for the Bank's credit portfolio.
          </p>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2">

          <span className="text-sm font-semibold text-cyan-400">
            Powered by PRISM AI
          </span>

        </div>

      </div>

      {/* Intelligence Cards */}

      <div className="mt-10 space-y-8">

        {strategicIntelligence.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/40 p-7"
          >

            {/* Category */}

            <div>

              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">

                {item.category}

              </span>

            </div>

            {/* Headline */}

            <h3 className="mt-5 text-xl font-semibold leading-9 text-white">

              {item.headline}

            </h3>

            {/* Body */}

            <div className="mt-8 grid gap-8 lg:grid-cols-3">

              {/* Exposure */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">

                  {item.exposureTitle}

                </p>

                <p className="mt-3 text-lg font-bold text-white">

                  {item.exposureValue}

                </p>

              </div>

              {/* Impact */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">

                  Potential Impact

                </p>

                <p className="mt-3 leading-7 text-slate-300">

                  {item.impact}

                </p>

              </div>

              {/* Recommendation */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">

                  Management Consideration

                </p>

                <p className="mt-3 leading-7 text-slate-300">

                  {item.recommendation}

                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="mt-10 border-t border-slate-800 pt-6">

        <p className="text-sm leading-7 text-slate-500">
          Strategic Intelligence combines internal portfolio exposure with
          external macroeconomic developments to identify emerging credit risks
          before they materially affect portfolio quality.
        </p>

      </div>

    </section>
  );
}