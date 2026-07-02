export default function AiCopilotPanel() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Executive Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Credit Risk Brief
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
          Kualitas portofolio kredit secara umum masih berada dalam
          <span className="font-semibold text-white">
            {" "}Risk Appetite Bank
          </span>.
          Gross NPL turun menjadi
          <span className="font-semibold text-cyan-400">
            {" "}2.42%
          </span>
          dibanding bulan sebelumnya sebesar
          <span className="font-semibold text-white">
            {" "}2.51%
          </span>.
          Meskipun demikian, peningkatan eksposur debitur pada
          <span className="font-semibold text-amber-400">
            {" "}Kolektibilitas 2
          </span>
          di sektor Konstruksi perlu mendapat perhatian untuk mencegah migrasi menuju
          <span className="font-semibold text-rose-400">
            {" "}Kolektibilitas 3.
          </span>

        </p>

      </section>

      {/* Management Attention */}

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
          Management Attention
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          <li>• Sektor Konstruksi menunjukkan kenaikan eksposur Kolektibilitas 2.</li>

          <li>• Konsentrasi kredit Top 20 debitur masih relatif tinggi.</li>

          <li>• Volatilitas USD berpotensi meningkatkan risiko debitur berdenominasi valuta asing.</li>

        </ul>

      </section>

      {/* Recommended Actions */}

      <section className="mt-8">

        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-slate-300">

          <li>✓ Intensifkan monitoring debitur Kolektibilitas 2 sektor Konstruksi.</li>

          <li>✓ Lakukan review terhadap Top 10 debitur dengan eksposur terbesar.</li>

          <li>✓ Pertahankan strategi recovery pada portofolio Consumer Loan.</li>

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
              Portfolio Remains Healthy
            </h3>

          </div>

          <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
            Confidence 96%
          </div>

        </div>

        <p className="mt-4 leading-7 text-slate-300">
          Berdasarkan indikator kualitas aset, CKPN Coverage,
          tren Gross NPL, dan profil risiko portofolio,
          kondisi kredit Bank masih berada dalam batas toleransi risiko yang telah ditetapkan.
        </p>

      </section>

    </div>
  );
}