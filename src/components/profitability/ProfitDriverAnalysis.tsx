import Panel from "../ui/Panel";

const positive = [
  {
    factor: "CASA Growth",
    impact: "+18 bps",
  },
  {
    factor: "Consumer Loan Yield",
    impact: "+24 bps",
  },
  {
    factor: "Fee Based Income",
    impact: "+8 bps",
  },
];

const negative = [
  {
    factor: "Cost of Credit",
    impact: "-11 bps",
  },
  {
    factor: "Operating Expense",
    impact: "-7 bps",
  },
  {
    factor: "Corporate Margin",
    impact: "-4 bps",
  },
];

export default function ProfitDriverAnalysis() {
  return (
    <Panel title="Executive Profit Driver">

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Positive Contributors
          </h3>

          <div className="space-y-4">

            {positive.map((item) => (

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

            {negative.map((item) => (

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
          AI Executive Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">

          Profitabilitas Bank masih ditopang oleh pertumbuhan CASA,
          peningkatan yield Consumer Loan, serta kenaikan Fee Based Income.
          Namun demikian, peningkatan Cost of Credit pada segmen Corporate
          mulai memberikan tekanan terhadap margin sehingga perlu menjadi
          perhatian manajemen.

        </p>

      </div>

    </Panel>
  );
}