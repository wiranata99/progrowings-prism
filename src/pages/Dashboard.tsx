import AppLayout from "../components/layout/AppLayout";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import TrendChart from "../components/dashboard/TrendChart";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";

const market = [
  ["USD/IDR", "17,180"],
  ["BI Rate", "5.50%"],
  ["SRBI 12M", "6.42%"],
  ["US 10Y", "4.36%"],
];

export function Dashboard() {
  return (
    <AppLayout>

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8">
          <ExecutiveScore
            score={92}
            status="Healthy Institution"
          />
        </div>

        <Panel className="col-span-4">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Executive Brief
            </h2>

            <StatusBadge
              status="success"
              text="Healthy"
            />

          </div>

          <p className="mt-6 leading-7 text-slate-300">
            Corporate portfolio remains resilient.
            FX volatility should continue to be monitored.
            Review Top 20 corporate borrowers before month end.
          </p>

        </Panel>

      </div>

      <div className="grid grid-cols-12 gap-6">

        <Panel
          title="Market Monitor"
          className="col-span-8"
        >

          <div className="grid grid-cols-2 gap-5">

            {market.map(([name, value]) => (

              <div
                key={name}
                className="rounded-xl border border-slate-700 p-5"
              >

                <p className="text-slate-400">
                  {name}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {value}
                </h3>

              </div>

            ))}

          </div>

        </Panel>

        <Panel
          title="Trend"
          className="col-span-4"
        >

          <TrendChart />

        </Panel>

      </div>

    </AppLayout>
  );
}