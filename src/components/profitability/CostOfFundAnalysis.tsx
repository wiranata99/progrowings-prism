import Panel from "../ui/Panel";
import { costOfFundAnalysis } from "../../data/profitability";

export default function CostOfFundAnalysis() {
  return (
    <Panel title="Cost of Fund Analysis">

      <div className="space-y-5">

        {costOfFundAnalysis.map((item) => (

          <div
            key={item.source}
            className="rounded-2xl border border-slate-800 p-5 transition hover:border-cyan-500/30"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">

                  {item.source}

                </h3>

                <p className="mt-2 text-sm text-slate-400">

                  Outstanding {item.outstanding}

                </p>

              </div>

              <div className="text-right">

                <p className="text-3xl font-bold text-cyan-400">

                  {item.cost}

                </p>

                <p className="text-xs uppercase tracking-wider text-slate-500">

                  Cost

                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          AI Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">

          Penurunan Cost of Fund terutama didorong oleh peningkatan CASA dan
          penurunan proporsi deposito berbiaya tinggi. Kondisi ini memberikan
          dampak positif terhadap Net Interest Margin Bank.

        </p>

      </div>

    </Panel>
  );
}