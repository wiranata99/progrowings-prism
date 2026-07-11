import Panel from "../ui/Panel";
import {
  ShieldCheck,
  Activity,
  ArrowLeftRight,
  Gauge,
} from "lucide-react";

const metrics = [
  {
    title: "Modified Duration",
    value: "3.48",
    delta: "-0.08 MoM",
    icon: Gauge,
    color: "text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-300",
  },
  {
    title: "DV01",
    value: "Rp28.4 Mn",
    delta: "+3.2%",
    icon: Activity,
    color: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300",
  },
  {
    title: "FX Open Position",
    value: "1.82%",
    delta: "Within Limit",
    icon: ArrowLeftRight,
    color: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300",
  },
  {
    title: "VaR Utilization",
    value: "41.25%",
    delta: "Healthy",
    icon: ShieldCheck,
    color: "text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-300",
  },
];

export default function MarketRiskDashboard() {
  return (
    <Panel>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Market Risk Analytics
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Treasury Risk Dashboard
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Key market risk indicators used by ALCO to monitor
            portfolio sensitivity, market exposure, and limit
            utilization.
          </p>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          Live Monitoring
        </div>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">

        {metrics.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-cyan-500/40"
            >

              <div className="flex items-center justify-between">

                <div className="rounded-xl bg-slate-900 p-3">

                  <Icon
                    className={item.color}
                    size={22}
                  />

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}
                >
                  {item.delta}
                </span>

              </div>

              <p className="mt-6 text-sm uppercase tracking-wider text-slate-500">
                {item.title}
              </p>

              <p className={`mt-2 text-4xl font-bold ${item.color}`}>
                {item.value}
              </p>

            </div>

          );

        })}

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Risk Assessment
        </p>

        <p className="mt-4 leading-8 text-slate-300">

          Treasury market risk remains comfortably within the Bank's
          approved risk appetite. Duration exposure, Value-at-Risk,
          and foreign exchange positions continue to operate well
          below internal ALCO limits, providing sufficient capacity
          to absorb moderate interest rate and exchange rate
          fluctuations.

        </p>

      </div>

    </Panel>
  );
}