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

const alerts = [
  {
    level: "HIGH",
    title: "Recovery Plan Trigger",
    desc: "NPL monitoring threshold remains active.",
    color: "text-rose-400",
  },
  {
    level: "MEDIUM",
    title: "USD Volatility",
    desc: "Monitor FX borrowers with USD exposure.",
    color: "text-amber-400",
  },
  {
    level: "LOW",
    title: "Liquidity Position",
    desc: "LCR remains comfortably above regulatory minimum.",
    color: "text-emerald-400",
  },
];

export function Dashboard() {
  return (
    <AppLayout>

      {/* HERO */}

      <div className="grid gap-6 lg:grid-cols-12">

        <div className="lg:col-span-8">

          <ExecutiveScore
            score={92}
            status="Healthy Institution"
          />

        </div>

        <Panel className="lg:col-span-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                AI Executive Copilot
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Today's Executive Brief
              </h2>

            </div>

            <StatusBadge
              status="success"
              text="Healthy"
            />

          </div>

          <div className="mt-8 space-y-6">

            {alerts.map((item) => (

              <div
                key={item.title}
                className="border-l-2 border-slate-700 pl-4"
              >

                <p className={`text-xs font-bold ${item.color}`}>

                  {item.level}

                </p>

                <h3 className="mt-2 font-semibold">

                  {item.title}

                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">

                  {item.desc}

                </p>

              </div>

            ))}

          </div>

        </Panel>

      </div>

      {/* MARKET */}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">

        <Panel
          title="Market Monitor"
          className="lg:col-span-8"
        >

          <div className="grid grid-cols-2 gap-5">

            {market.map(([name, value]) => (

              <div
                key={name}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-5 transition-all duration-300 hover:border-cyan-500/30"
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
          title="Market Trend"
          className="lg:col-span-4"
        >

          <TrendChart />

        </Panel>

      </div>

    </AppLayout>
  );
}