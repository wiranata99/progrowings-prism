export default function LiquidityExecutivePanel() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Executive Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Liquidity Risk Brief
          </h2>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
          As of {new Date().toLocaleDateString("en-GB")} | 08:00 WIB
        </div>

      </div>

      {/* Executive Summary */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Executive Summary
        </h3>

        <p className="mt-4 leading-8 text-slate-300">

          The Bank's liquidity position remains
          <span className="font-semibold text-emerald-400">
            {" "}strong and well above regulatory requirements
          </span>,
          with all key liquidity indicators comfortably exceeding
          internal and regulatory thresholds.
          The Liquidity Coverage Ratio (LCR) stands at
          <span className="font-semibold text-white">
            {" "}152.00%
          </span>,
          while Daily NSFR is recorded at
          <span className="font-semibold text-white">
            {" "}126.00%
          </span>.
          Month-end NSFR is projected to remain healthy at
          <span className="font-semibold text-white">
            {" "}118.00%
          </span>.
          Nevertheless, the recent three-day decline in customer deposits
          should continue to be monitored to anticipate potential short-term
          funding pressure.

        </p>

      </section>

      {/* Management Attention */}

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
          Management Attention
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          <li>• Customer deposits recorded net outflows for three consecutive business days.</li>

          <li>• CASA Ratio remains marginally below the Corporate Plan target.</li>

          <li>• Funding structure is still relatively concentrated in short-term time deposits.</li>

          <li>• Liquidity Buffer remains adequate but requires close monitoring approaching month-end.</li>

        </ul>

      </section>

      {/* Recommended Actions */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          <li>✓ Accelerate CASA acquisition from existing customer relationships.</li>

          <li>✓ Review short-term deposit pricing strategy to optimize funding costs.</li>

          <li>✓ Closely monitor daily NSFR projection through month-end.</li>

          <li>✓ Perform targeted liquidity stress monitoring under deposit outflow scenarios.</li>

        </ul>

      </section>

      {/* Overall Assessment */}

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Overall Assessment
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              Liquidity Position Remains Strong
            </h3>

          </div>

          <div className="flex gap-3">

  <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
    Risk Level: LOW
  </div>

  <div className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-300">
    Funding: STABLE
  </div>

  <div className="rounded-full bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-300">
    Confidence 97%
  </div>

</div>

        </div>

        <p className="mt-4 leading-7 text-slate-300">

          Based on current liquidity ratios, cash position,
          funding profile, projected cash flows,
          and available liquidity buffers,
          the Bank is expected to comfortably meet its short-term
          obligations under normal operating conditions.
          Current liquidity risk remains within the approved risk appetite,
          with no indication of immediate funding stress.

        </p>

      </section>

    </div>
  );
}