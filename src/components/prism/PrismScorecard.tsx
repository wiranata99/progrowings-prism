import { prismScorecard } from "../../data/prismScorecard";

export default function PrismScorecard() {
  const percentage =
    (prismScorecard.score / prismScorecard.maxScore) * 100;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.30em] text-cyan-400">
            PRISM Scorecard
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Overall Credit Risk Assessment
          </h2>

        </div>

        <div className="rounded-full bg-emerald-500/15 px-4 py-2">

          <span className="text-sm font-semibold text-emerald-400">
            {prismScorecard.status}
          </span>

        </div>

      </div>

      {/* Main */}

      <div className="mt-10 grid gap-10 xl:grid-cols-[1.3fr_1fr]">

        {/* Left */}

        <div>

          <p className="text-sm uppercase tracking-[0.20em] text-slate-500">
            PRISM Risk Index™
          </p>

          <div className="mt-4 flex items-end gap-4">

            <span className="text-7xl font-black tracking-tight text-white">
              {prismScorecard.score}
            </span>

            <span className="mb-3 text-2xl font-semibold text-slate-500">
              / {prismScorecard.maxScore}
            </span>

          </div>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

          <p className="mt-5 text-lg font-semibold text-emerald-400">
            {prismScorecard.appetite}
          </p>

        </div>

        {/* Right */}

        <div className="grid grid-cols-2 gap-6">

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Direction
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              {prismScorecard.direction}
            </h3>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Confidence
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              {prismScorecard.confidence}
            </h3>

          </div>

          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">

            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Last Updated
            </p>

            <h3 className="mt-3 text-lg font-semibold text-white">
              {prismScorecard.lastUpdated}
            </h3>

          </div>

        </div>

      </div>

    </section>
  );
}