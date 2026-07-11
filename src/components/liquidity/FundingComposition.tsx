import Panel from "../ui/Panel";
import { fundingComposition } from "../../data/liquidity";
import { getFundingColor } from "../../utils/fundingColor";



export default function FundingComposition() {

  const casa =
  fundingComposition[0].value +
  fundingComposition[1].value;

  const target = 75;
  const mom = 1.24;

  const stability =
  casa >= target ? "Stable" : "Watch";

  return (

    <Panel title="Funding Composition">

      <div className="space-y-8">

        <div>

          <div className="mb-3 flex items-center justify-between">
            <div className="mb-6 w-full rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-8 py-6">

            <div className="grid grid-cols-4 gap-8">

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Funding Stability
              </p>

              <p className="mt-2 text-xl font-bold text-emerald-400">
                {stability}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                CASA Ratio
              </p>

              <p className="mt-2 text-xl font-bold text-cyan-400">
                {casa.toFixed(2)}%
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Target
              </p>

              <p className="mt-2 text-xl font-bold text-white">
                &gt; {target.toFixed(2)}%
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                MoM
              </p>

              <p className="mt-2 text-xl font-bold text-emerald-400">
                ▲ +{mom.toFixed(2)}%
              </p>

            </div>

          </div>

        </div>

           
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-800">

            <div className="flex h-full">

              <div
                className="bg-cyan-500"
                style={{ width: `${fundingComposition[0].value}%` }}
              />

              <div
                className="bg-sky-500"
                style={{ width: `${fundingComposition[1].value}%` }}
              />

              <div
                className="bg-amber-400"
                style={{ width: `${fundingComposition[2].value}%` }}
              />

            </div>

          </div>

        </div>

        <div className="space-y-5">

          {fundingComposition.map((item) => (

            <div
              key={item.name}
              className="rounded-2xl border border-slate-800 p-4"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`h-3 w-3 rounded-full ${getFundingColor(item.name)}`}
                  />

                  <span className="font-medium">

                    {item.name}

                  </span>

                </div>

                <span className="font-bold">

                  {item.value}%

                </span>

              </div>

              <div className="mt-3 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Outstanding
                </p>

                <p className="mt-1 font-semibold text-white">
                  {item.amount}
                </p>

              </div>

              <div
                className={`text-sm font-semibold ${
                  item.value >= 20
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                ▲ +0.42%
              </div>

            </div>

            </div>

          ))}

        </div>

      </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">

          Funding composition remains healthy with
          CASA contributing
          <span className="font-semibold text-cyan-400">
            {" "}{casa.toFixed(2)}%
          </span>
          of total funding, comfortably above the internal
          target of
          <span className="font-semibold text-white">
            {" "}{target.toFixed(2)}%
          </span>.
          Stable CASA growth continues to reduce reliance
          on higher-cost time deposits and supports a
          resilient liquidity profile.

        </p>

      </div>
    
    </Panel>

  );

}
