import { executiveNarrative } from "../../data/executiveNarrative";

export default function ExecutiveNarrative() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8">

      {/* Header */}

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.30em] text-cyan-400">
          Executive Brief
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
          {executiveNarrative.title}
        </h2>

      </div>

      {/* Narrative */}

      <div className="mt-8">

        <p className="max-w-5xl text-lg leading-9 text-slate-300">
          {executiveNarrative.summary}
        </p>

      </div>

      {/* Recommended Actions */}

      <div className="mt-10 border-t border-slate-800 pt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Recommended Actions
        </h3>

        <div className="mt-5 space-y-4">

          {executiveNarrative.actions.map((action, index) => (

            <div
              key={index}
              className="flex items-start gap-4"
            >

              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-400">

                {index + 1}

              </div>

              <p className="text-slate-300 leading-7">
                {action}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Footer */}

      <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">

        <p className="text-sm text-slate-500">
          Estimated reading time <span className="font-semibold text-slate-300">45 sec</span>
        </p>

        <div className="rounded-full bg-emerald-500/15 px-4 py-2">

          <span className="text-sm font-semibold text-emerald-400">
            Board Ready
          </span>

        </div>

      </div>

    </section>
  );
}