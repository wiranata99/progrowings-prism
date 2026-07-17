import Panel from "../ui/Panel";
import {
  positiveProfitDriver,
  negativeProfitDriver,
} from "../../data/profitability";


export default function ProfitDriverAnalysis() {
  return (
    <Panel title="Executive Profit Driver">

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Positive Contributors
          </h3>

          <div className="space-y-4">

            {positiveProfitDriver.map((item) => (

              <div
                key={item.factor}
                className="rounded-2xl border border-slate-800 p-4"
              >

                <div className="flex items-center justify-between">

                  <span className="font-medium">

                    {item.factor}

                  </span>

                  <span className="font-bold text-emerald-400">

                    {item.impact}

                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div>

          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-rose-400">
            Negative Contributors
          </h3>

          <div className="space-y-4">

            {negativeProfitDriver.map((item) => (

              <div
                key={item.factor}
                className="rounded-2xl border border-slate-800 p-4"
              >

                <div className="flex items-center justify-between">

                  <span className="font-medium">

                    {item.factor}

                  </span>

                  <span className="font-bold text-rose-400">

                    {item.impact}

                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Executive Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">
  The Bank's profitability continues to be supported by strong CASA growth,
  improving Consumer Lending yields, and sustained Fee Based Income expansion.
  However, rising Cost of Credit and increasing operating expenses have begun
  to place moderate pressure on portfolio margins. Maintaining funding
  discipline, pricing optimization, and operational efficiency will be
  essential to preserving sustainable earnings growth.
</p>

      </div>

    </Panel>
  );
}