import { useTranslation } from "react-i18next";

export default function ExecutiveBrief() {
    const { t } = useTranslation();
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            {t("common.creditexecutiveBrief")}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {t("common.creditportfolioCondition")}                
          </h2>

        </div>

        <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
          {t("common.healthy")}
        </span>

      </div>

      <div className="mt-6 space-y-4 leading-8 text-slate-300">

        <p>
          {t("common.creditsummary1")}
          <span className="font-semibold text-white">
            
          </span>
        </p>

        <p>
          {t("common.creditsummary2")}
          <span className="font-semibold text-cyan-400">
            
          </span>
          
        </p>

        <p>
          {t("common.creditsummary3")}
          <span className="font-semibold text-amber-400">
            
          </span>
          
        </p>

      </div>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">

        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Recommended Actions
        </h3>

        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">

          <li>✓ {t("common.creditaction1")} </li>

          <li>✓ {t("common.creditaction2")} </li>

          <li>✓ {t("common.creditaction3")} </li>

        </ul>

      </div>

    </section>
  );
}