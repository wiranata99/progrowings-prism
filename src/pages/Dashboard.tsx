import AppLayout from "../components/layout/AppLayout";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import TrendChart from "../components/dashboard/TrendChart";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";
import { useTranslation } from "react-i18next";

const market = [
  ["USD/IDR", "17,180"],
  ["BI Rate", "5.50%"],
  ["SRBI 12M", "6.42%"],
  ["US 10Y", "4.36%"],
];

const alerts = [
  {
    level: "HIGH",
    titleKey: "dashboard.recoveryPlan",
    descKey: "dashboard.recoveryPlanDesc",
    color: "text-rose-400",
  },
  {
    level: "MEDIUM",
    titleKey: "dashboard.usdVolatility",
    descKey: "dashboard.usdVolatilityDesc",
    color: "text-amber-400",
  },
  {
    level: "LOW",
    titleKey: "dashboard.liquidityPosition",
    descKey: "dashboard.liquidityPositionDesc",
    color: "text-emerald-400",
  },
];

export function Dashboard() {
  const { t } = useTranslation();
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
                {t("dashboard.executiveCopilot")}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {t("dashboard.executiveBrief")}
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
                key={t(item.titleKey)}
                className="border-l-2 border-slate-700 pl-4"
              >

                <p className={`text-xs font-bold ${item.color}`}>

                  {item.level}

                </p>

                <h3 className="mt-2 font-semibold">

                  {t(item.titleKey)}

                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">

                  {t(item.descKey)}

                </p>

              </div>

            ))}

          </div>

        </Panel>

      </div>

      {/* MARKET */}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">

        <Panel
          title={t("dashboard.marketMonitor")}
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
          title={t("dashboard.marketTrend")}
          className="lg:col-span-4"
        >

          <TrendChart />

        </Panel>

      </div>

    </AppLayout>
  );
}