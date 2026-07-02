export default function ExecutiveBrief() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Executive Credit Brief
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Kondisi Portofolio Kredit
          </h2>

        </div>

        <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
          Healthy
        </span>

      </div>

      <div className="mt-6 space-y-4 leading-8 text-slate-300">

        <p>
          Portofolio kredit secara umum masih berada dalam
          <span className="font-semibold text-white">
            {" "}Risk Appetite Bank.
          </span>
        </p>

        <p>
          Gross NPL menurun menjadi
          <span className="font-semibold text-cyan-400">
            {" "}2.42%
          </span>
          {" "}dibanding bulan sebelumnya sebesar
          <span className="font-semibold text-white">
            {" "}2.51%.
          </span>
        </p>

        <p>
          Peningkatan eksposur debitur pada
          <span className="font-semibold text-amber-400">
            {" "}Kolektibilitas 2
          </span>
          {" "}di sektor Konstruksi memerlukan perhatian untuk mencegah
          migrasi menuju
          <span className="font-semibold text-rose-400">
            {" "}Kolektibilitas 3.
          </span>
        </p>

      </div>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">

          <li>✓ Intensifkan monitoring sektor Konstruksi.</li>

          <li>✓ Review Top 10 debitur Kolektibilitas 2.</li>

          <li>✓ Pertahankan strategi recovery Consumer Loan.</li>

        </ul>

      </div>

    </section>
  );
}