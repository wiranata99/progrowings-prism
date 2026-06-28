export default function AiCopilotPanel() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            AI Executive Copilot
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Executive Briefing
          </h2>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
          AI Generated
        </div>

      </div>

      {/* Summary */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Executive Summary
        </h3>

        <p className="mt-3 leading-7 text-slate-300">
          Gross NPL improved to <span className="font-semibold text-white">2.42%</span> and
          remains comfortably below the Board-approved risk appetite of
          <span className="font-semibold text-white"> 3.00%</span>.
          Portfolio quality continues to improve despite higher volatility
          within the construction segment.
        </p>

      </section>

      {/* Risk */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
          Key Risks
        </h3>

        <ul className="mt-3 space-y-3 text-slate-300">

          <li>
            • Construction portfolio shows the highest incremental deterioration.
          </li>

          <li>
            • Concentration risk remains elevated among Top-20 obligors.
          </li>

          <li>
            • USD volatility may increase impairment pressure on FX borrowers.
          </li>

        </ul>

      </section>

      {/* Recommendation */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Recommended Actions
        </h3>

        <ul className="mt-3 space-y-3 text-slate-300">

          <li>
            • Review collateral valuation for high-value construction accounts.
          </li>

          <li>
            • Intensify monitoring of Top-20 corporate borrowers.
          </li>

          <li>
            • Prepare management briefing for the next Credit Committee meeting.
          </li>

        </ul>

      </section>

      {/* Business Impact */}

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Business Impact
        </p>

        <p className="mt-3 leading-7 text-slate-300">
          If the current trend continues, the Bank is expected to maintain
          healthy asset quality while reducing expected credit loss pressure
          over the coming reporting periods.
        </p>

      </section>

    </div>
  );
}