interface ExecutivePanelProps {
  title: string;
  generatedAt: string;
  summary: string;
  attention: string[];
  recommendations: string[];
  assessment: string;
  confidence: string;
  status: string;
}

export default function ExecutivePanel({
  title,
  generatedAt,
  summary,
  attention,
  recommendations,
  assessment,
  confidence,
  status,
}: ExecutivePanelProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Executive Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {title}
          </h2>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
          {generatedAt}
        </div>

      </div>

      {/* Executive Summary */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Executive Summary
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          {summary}
        </p>

      </section>

      {/* Management Attention */}

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
          Management Attention
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          {attention.map((item) => (

            <li key={item}>
              • {item}
            </li>

          ))}

        </ul>

      </section>

      {/* Recommended */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          {recommendations.map((item) => (

            <li key={item}>
              ✓ {item}
            </li>

          ))}

        </ul>

      </section>

      {/* Overall */}

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Overall Assessment
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {status}
            </h3>

          </div>

          <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
            {confidence}
          </div>

        </div>

        <p className="mt-4 leading-7 text-slate-300">
          {assessment}
        </p>

      </section>

    </div>
  );
}