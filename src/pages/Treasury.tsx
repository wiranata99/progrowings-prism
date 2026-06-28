import AppLayout from "../components/layout/AppLayout";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import MetricCard from "../components/cards/MetricCard";
import Panel from "../components/ui/Panel";
import TrendChart from "../components/dashboard/TrendChart";

export default function Treasury() {
  return (
    <AppLayout>

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="col-span-8">

          <ExecutiveScore
            score={96}
            status="Strong Liquidity Position"
          />

        </div>

        {/* RIGHT */}

        <Panel className="col-span-4">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
              Treasury Executive Brief
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Today's Treasury Update
            </h2>

          </div>

          <div className="mt-8 space-y-5">

            <div className="border-l-2 border-emerald-500 pl-4">

              <p className="font-semibold">
                Liquidity remains very strong.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                LCR and NSFR remain comfortably above regulatory thresholds.
              </p>

            </div>

            <div className="border-l-2 border-amber-500 pl-4">

              <p className="font-semibold">
                USD volatility requires monitoring.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Foreign currency borrowers should remain under close observation.
              </p>

            </div>

            <div className="border-l-2 border-cyan-500 pl-4">

              <p className="font-semibold">
                Bond portfolio remains resilient.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Unrealized valuation impact remains within internal tolerance.
              </p>

            </div>

          </div>

        </Panel>

      </div>

      {/* KPI */}

      <div className="mt-6 grid grid-cols-4 gap-6">

        <MetricCard
          title="Liquidity Coverage Ratio"
          value="221%"
          trend="+4%"
          target=">100%"
          status="Healthy"
        />

        <MetricCard
          title="Net Stable Funding Ratio"
          value="138%"
          trend="+1%"
          target=">100%"
          status="Healthy"
        />

        <MetricCard
          title="FX Open Position"
          value="3.8%"
          trend="-0.4%"
          target="<20%"
          status="Healthy"
        />

        <MetricCard
          title="Liquidity Buffer"
          value="Rp12.8 T"
          trend="+6%"
          target="Internal Limit"
          status="Healthy"
        />

      </div>

      {/* Bottom */}

      <div className="mt-6 grid grid-cols-12 gap-6">

        <Panel
          title="Market Snapshot"
          className="col-span-8"
        >

          <div className="grid grid-cols-2 gap-5">

            {[
              ["USD/IDR","17,180"],
              ["BI Rate","5.50%"],
              ["SRBI 12M","6.42%"],
              ["US Treasury 10Y","4.36%"],
            ].map(([name,value])=>(
              <div
                key={name}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">
                  {name}
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {value}
                </h3>
              </div>
            ))}

          </div>

        </Panel>

        <Panel
          title="Yield Trend"
          className="col-span-4"
        >

          <TrendChart/>

        </Panel>

      </div>

    </AppLayout>
  );
}