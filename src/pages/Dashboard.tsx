import AppLayout from "../components/layout/AppLayout";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import TrendChart from "../components/dashboard/TrendChart";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";
import { useTranslation } from "react-i18next";

interface MarketIndicator {
  id: string;
  labelKey: string;
  value: number;
  suffix: string;
  format: "number" | "decimal";
}

const market: MarketIndicator[] = [
  {
    id: "usdidr",
    labelKey: "dashboard.usdidr",
    value: 17180,
    suffix: "",
    format: "number",
  },
  {
    id: "birate",
    labelKey: "dashboard.biRate",
    value: 5.5,
    suffix: "%",
    format: "decimal",
  },
  {
    id: "srbi12m",
    labelKey: "dashboard.srbi12m",
    value: 6.42,
    suffix: "%",
    format: "decimal",
  },
  {
    id: "us10y",
    labelKey: "dashboard.us10y",
    value: 4.36,
    suffix: "%",
    format: "decimal",
  },
];

const alerts = [
  {
    id: "recovery",
    levelKey: "common.high",
    titleKey: "dashboard.recoveryPlan",
    descKey: "dashboard.recoveryPlanDesc",
    color: "text-rose-400",
  },
  {
    id: "usd",
    levelKey: "common.moderate",
    titleKey: "dashboard.usdVolatility",
    descKey: "dashboard.usdVolatilityDesc",
    color: "text-amber-400",
  },
  {
    id: "liquidity",
    levelKey: "common.low",
    titleKey: "dashboard.liquidityPosition",
    descKey: "dashboard.liquidityPositionDesc",
    color: "text-emerald-400",
  },
];

export function Dashboard() {
  const { t } = useTranslation();
  const formatValue = (item: MarketIndicator) => {
  if (item.format === "number") {
    return item.value.toLocaleString("en-US");
  }

  return item.value.toFixed(2);
};
  return (
    <AppLayout>

      {/* HERO */}

      <div className="grid gap-6 lg:grid-cols-12">

        <div className="lg:col-span-8">

          <ExecutiveScore
            score={92}
            status="Healthy Institution"
            delta={2.4}
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
                key={item.id}
                className="border-l-2 border-slate-700 pl-4"
              >

                <p className={`text-xs font-bold ${item.color}`}>

                  {t(item.levelKey)}

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

            {market.map((item) => (

              <div
                key={item.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-5 transition-all duration-300 hover:border-cyan-500/30"
              >

                <p className="text-sm text-slate-400">

                  {t(item.labelKey)}

                </p>

                <h3 className="mt-2 text-3xl font-bold">

                  {formatValue(item)}
{item.suffix}

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