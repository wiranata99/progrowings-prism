import AppLayout from "../components/layout/AppLayout";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import TrendChart from "../components/dashboard/TrendChart";
import MetricCard from "../components/cards/MetricCard";
import Panel from "../components/ui/Panel";
import MarketMonitor from "../components/ui/MarketMonitor";

const marketData = [
  {
    indicator: "USD / IDR",
    value: "17,180",
    movement: "▲ +0.42%",
    status: "Watch" as const,
  },
  {
    indicator: "BI Rate",
    value: "5.50%",
    movement: "No Change",
    status: "Stable" as const,
  },
  {
    indicator: "SRBI 12M",
    value: "6.42%",
    movement: "▼ -3 bps",
    status: "Positive" as const,
  },
  {
    indicator: "US Treasury 10Y",
    value: "4.36%",
    movement: "▲ +7 bps",
    status: "Watch" as const,
  },
];

export default function Treasury() {
  return (
    <AppLayout>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

        <div className="xl:col-span-8">

          <ExecutiveScore
            score={96}
            status="Strong Liquidity Position"
          />

        </div>

        <Panel className="xl:col-span-4">

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Treasury Executive Brief
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Today's Treasury Update
          </h2>

          <div className="mt-8 space-y-5">

            <div className="border-l-2 border-emerald-500 pl-4">
              <p className="font-semibold">
                Liquidity remains very strong.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                LCR and NSFR remain well above regulatory limits.
              </p>
            </div>

            <div className="border-l-2 border-amber-500 pl-4">
              <p className="font-semibold">
                Monitor USD volatility.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Review FX-sensitive corporate borrowers.
              </p>
            </div>

            <div className="border-l-2 border-cyan-500 pl-4">
              <p className="font-semibold">
                Bond portfolio remains resilient.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Unrealized valuation remains within tolerance.
              </p>
            </div>

          </div>

        </Panel>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

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

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">

        <Panel className="xl:col-span-8">

          <MarketMonitor
            title="Treasury Market Monitor"
            data={marketData}
          />

        </Panel>

        <Panel
          title="Yield Trend"
          className="xl:col-span-4"
        >

          <TrendChart />

        </Panel>

      </div>

    </AppLayout>
  );
}