import Panel from "../ui/Panel";

export default function MarketOutlook() {
  return (
    <Panel>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Outlook Pasar
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Kondisi Pasar Hari Ini
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

          <p className="text-sm text-slate-400">
            Yield SUN 10 Tahun
          </p>

          <h3 className="mt-2 text-3xl font-bold text-cyan-400">
            6.55%
          </h3>

          <p className="mt-2 text-sm text-emerald-400">
            ▼ Turun 12 bps
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

          <p className="text-sm text-slate-400">
            BI Rate
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            5.50%
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Stabil
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

          <p className="text-sm text-slate-400">
            USD / IDR
          </p>

          <h3 className="mt-2 text-3xl font-bold text-amber-400">
            16,240
          </h3>

          <p className="mt-2 text-sm text-rose-400">
            ▲ Naik 0.8%
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

          <p className="text-sm text-slate-400">
            IHSG
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-400">
            7,385
          </h3>

          <p className="mt-2 text-sm text-emerald-400">
            ▲ Naik 0.6%
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Executive Intelligence
        </p>

        <p className="mt-4 leading-8 text-slate-300">
          Penurunan yield SUN memberikan peluang peningkatan valuasi
          portofolio obligasi Bank. Namun pelemahan Rupiah perlu
          dimonitor karena berpotensi meningkatkan volatilitas pasar
          keuangan dalam jangka pendek.
        </p>

      </div>

    </Panel>
  );
}