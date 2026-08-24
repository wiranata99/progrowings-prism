import { useEffect, useState } from "react";
import Panel from "../ui/Panel";
import {
  ShieldCheck,
  Activity,
  Gauge,
  TrendingDown,
} from "lucide-react";

import {
  getTreasuryRiskAnalytics,
  type TreasuryRiskAnalytics,
} from "../../services/treasuryRiskApi";

function formatRupiah(value: number) {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000_000_000) {
    return `Rp${(absoluteValue / 1_000_000_000_000).toFixed(2)} T`;
  }

  if (absoluteValue >= 1_000_000_000) {
    return `Rp${(absoluteValue / 1_000_000_000).toFixed(2)} B`;
  }

  if (absoluteValue >= 1_000_000) {
    return `Rp${(absoluteValue / 1_000_000).toFixed(2)} Mn`;
  }

  return `Rp${absoluteValue.toLocaleString("id-ID")}`;
}

type LimitStatus =
  | "HEALTHY"
  | "WATCH"
  | "CRITICAL";

function statusClasses(status: LimitStatus) {
  if (status === "CRITICAL") {
    return "bg-rose-500/10 text-rose-300";
  }

  if (status === "WATCH") {
    return "bg-amber-500/10 text-amber-300";
  }

  return "bg-emerald-500/10 text-emerald-300";
}

function utilizationColor(
  utilization: number,
) {
  if (utilization >= 90) {
    return "text-rose-400";
  }

  if (utilization >= 70) {
    return "text-amber-400";
  }

  return "text-emerald-400";
}

export default function MarketRiskDashboard() {
  const [data, setData] =
    useState<TreasuryRiskAnalytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const result =
          await getTreasuryRiskAnalytics();

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "Failed to load Treasury Risk Analytics",
          error,
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const metrics = data
    ? [
        {
          title: "Modified Duration",
          value:
            data.portfolio.modifiedDuration.toFixed(
              2,
            ),
          context: "Portfolio",
          icon: Gauge,
          color: "text-cyan-400",
          contextBadge:
            "bg-cyan-500/10 text-cyan-300",

          limit:
            data.limits.modifiedDuration.limit.toFixed(
              2,
            ),

          utilization:
            data.limits.modifiedDuration
              .utilization,

          status:
            data.limits.modifiedDuration
              .status,
        },

        {
          title: "DV01",
          value: formatRupiah(
            data.portfolio.dv01,
          ),
          context: "Per 1 bp",
          icon: Activity,
          color: "text-emerald-400",
          contextBadge:
            "bg-emerald-500/10 text-emerald-300",

          limit: formatRupiah(
            data.limits.dv01.limit,
          ),

          utilization:
            data.limits.dv01.utilization,

          status:
            data.limits.dv01.status,
        },

        {
          title: "VaR 99%",
          value: formatRupiah(
            data.portfolio.var99,
          ),
          context: "1-Day",
          icon: TrendingDown,
          color: "text-rose-400",
          contextBadge:
            "bg-rose-500/10 text-rose-300",

          limit: formatRupiah(
            data.limits.var99.limit,
          ),

          utilization:
            data.limits.var99.utilization,

          status:
            data.limits.var99.status,
        },

        {
          title: "VaR / Portfolio",
          value: `${data.portfolio.varToPortfolio.toFixed(
            4,
          )}%`,
          context: "Relative Risk",
          icon: ShieldCheck,
          color: "text-cyan-400",
          contextBadge:
            "bg-cyan-500/10 text-cyan-300",

          limit: `${data.limits.varToPortfolio.limit.toFixed(
            2,
          )}%`,

          utilization:
            data.limits.varToPortfolio
              .utilization,

          status:
            data.limits.varToPortfolio
              .status,
        },
      ]
    : [];

  const watchCount =
    data
      ? Object.values(data.limits).filter(
          (item) =>
            item.status === "WATCH",
        ).length
      : 0;

  const criticalCount =
    data
      ? Object.values(data.limits).filter(
          (item) =>
            item.status === "CRITICAL",
        ).length
      : 0;

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Market Risk Analytics
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Treasury Risk Dashboard
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Key market risk indicators used by ALCO
            to monitor portfolio sensitivity,
            market exposure, and risk limit
            utilization.
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          {loading
            ? "Loading..."
            : "Live Monitoring"}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-500/40"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="rounded-xl bg-slate-900 p-2.5">
                  <Icon
                    className={item.color}
                    size={22}
                  />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.contextBadge}`}
                >
                  {item.context}
                </span>
              </div>

              <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                {item.title}
              </p>

              <p
                className={`mt-2 break-words text-xl font-bold ${item.color}`}
              >
                {item.value}
              </p>

              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Limit
                  </span>

                  <span className="text-xs font-semibold text-slate-300">
                    {item.limit}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Utilization
                  </span>

                  <span
                    className={`text-xs font-bold ${utilizationColor(
                      item.utilization,
                    )}`}
                  >
                    {item.utilization.toFixed(
                      2,
                    )}
                    %
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Risk Assessment
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          {criticalCount > 0
            ? `${criticalCount} Treasury risk metric${
                criticalCount > 1 ? "s are" : " is"
              } operating at critical limit utilization and require immediate management attention.`
            : watchCount > 0
              ? `Treasury market risk remains controlled overall, although ${watchCount} risk metric${
                  watchCount > 1 ? "s are" : " is"
                } currently within the watch zone. Modified Duration and DV01 continue to monitor interest-rate sensitivity, while 1-day 99% Historical VaR measures potential loss under historical market movements.`
              : "Treasury market risk remains within the current internal risk limits. Interest-rate sensitivity and market-loss exposure remain within a controlled risk profile."}
        </p>
      </div>
    </Panel>
  );
}