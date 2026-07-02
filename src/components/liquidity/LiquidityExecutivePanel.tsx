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
          Generated 08:00 WIB
        </div>

      </div>

      {/* Executive Summary */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Executive Summary
        </h3>

        <p className="mt-4 leading-8 text-slate-300">

          Posisi likuiditas Bank masih berada pada kondisi
          <span className="font-semibold text-emerald-400">
            {" "}sangat memadai
          </span>
          dengan seluruh indikator regulator berada di atas threshold minimum.
          LCR tercatat sebesar
          <span className="font-semibold text-white">
            {" "}152%
          </span>,
          NSFR Daily sebesar
          <span className="font-semibold text-white">
            {" "}126%
          </span>,
          sedangkan proyeksi NSFR akhir bulan masih berada pada
          <span className="font-semibold text-white">
            {" "}118%
          </span>.
          Meskipun demikian,
          penurunan DPK selama tiga hari terakhir perlu dimonitor untuk mengantisipasi tekanan likuiditas jangka pendek.

        </p>

      </section>

      {/* Management Attention */}

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
          Management Attention
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          <li>• DPK mengalami net outflow selama tiga hari berturut-turut.</li>

          <li>• CASA Ratio masih sedikit di bawah target Corporate Plan.</li>

          <li>• Funding masih didominasi deposito jangka pendek.</li>

          <li>• Liquidity Buffer masih memadai namun perlu dijaga menjelang akhir bulan.</li>

        </ul>

      </section>

      {/* Recommended Actions */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          <li>✓ Optimalkan akuisisi CASA dari nasabah eksisting.</li>

          <li>✓ Review pricing deposito tenor pendek.</li>

          <li>✓ Monitor proyeksi NSFR harian hingga akhir bulan.</li>

          <li>✓ Lakukan stress monitoring terhadap skenario DPK outflow.</li>

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

          <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
            Confidence 97%
          </div>

        </div>

        <p className="mt-4 leading-7 text-slate-300">

          Berdasarkan seluruh indikator likuiditas, posisi kas,
          regulatory ratio, proyeksi arus kas, serta liquidity buffer,
          Bank diperkirakan tetap mampu memenuhi kewajiban jangka pendek
          tanpa tekanan yang material dalam kondisi normal.

        </p>

      </section>

    </div>
  );
}