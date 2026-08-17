import { useEffect, useState } from "react";

import Panel from "../ui/Panel";

import {
  getTreasuryEarlyWarning,
  type TreasuryEarlyWarningData,
  type TreasuryAlertPriority,
} from "../../services/treasuryEarlyWarningApi";

export default function TreasuryEarlyWarning() {
  const [data, setData] =
    useState<TreasuryEarlyWarningData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(false);

        const result =
          await getTreasuryEarlyWarning();

        if (active) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Failed to load Treasury Early Warning",
          err,
        );

        if (active) {
          setData(null);
          setError(true);
        }
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

  const summary = data?.summary;

  return (
    <Panel>

      {/* Header */}

      <div className="mb-8 flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
            Early Warning
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Treasury Risk Alerts
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Key treasury indicators requiring management attention.
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.20em] text-slate-500">
            Active Alerts
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {loading
              ? "—"
              : summary?.activeAlerts ?? 0}
          </p>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900/70">

            <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="px-5 py-4">
                Priority
              </th>

              <th className="px-5 py-4">
                Issue
              </th>

              <th className="px-5 py-4">
                Business Impact
              </th>

              <th className="px-5 py-4">
                Recommended Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr className="border-t border-slate-800">

                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  Loading Treasury Risk Alerts...
                </td>

              </tr>
            )}

            {!loading &&
              data?.alerts.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-slate-800 transition hover:bg-slate-800/40"
                >

                  <td className="px-5 py-5">

                    <PriorityBadge
                      priority={item.priority}
                    />

                  </td>

                  <td className="px-5 font-medium text-white">

                    {item.issue}

                    <div className="mt-2 text-xs font-normal text-slate-500">
                      {item.metric} ·{" "}
                      {item.utilization.toFixed(2)}%
                      utilization
                    </div>

                  </td>

                  <td className="px-5 leading-7 text-slate-300">
                    {item.businessImpact}
                  </td>

                  <td className="px-5">

                    <span className="inline-block rounded-xl bg-cyan-500/10 px-3 py-2 text-xs font-semibold leading-5 text-cyan-300">
                      {item.recommendedAction}
                    </span>

                  </td>

                </tr>

              ))}

            {!loading &&
              !error &&
              data?.alerts.length === 0 && (

                <tr className="border-t border-slate-800">

                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center"
                  >

                    <p className="font-semibold text-emerald-400">
                      No Active Treasury Risk Alerts
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      All monitored Treasury risk indicators remain within healthy thresholds.
                    </p>

                  </td>

                </tr>

              )}

            {!loading && error && (

              <tr className="border-t border-slate-800">

                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  Treasury Early Warning data is not available.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Summary */}

      <div className="mt-8 grid gap-5 lg:grid-cols-3">

        <SummaryCard
          title="High"
          value={summary?.high ?? 0}
          loading={loading}
          className="border-rose-500/20 bg-rose-500/5"
          valueClassName="text-rose-300"
        />

        <SummaryCard
          title="Medium"
          value={summary?.medium ?? 0}
          loading={loading}
          className="border-amber-500/20 bg-amber-500/5"
          valueClassName="text-amber-300"
        />

        <SummaryCard
          title="Low"
          value={summary?.low ?? 0}
          loading={loading}
          className="border-emerald-500/20 bg-emerald-500/5"
          valueClassName="text-emerald-300"
        />

      </div>

      {/* PRISM Insight */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <div className="flex items-start justify-between gap-6">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
              PRISM Executive Insight
            </p>

            <p className="mt-4 leading-8 text-slate-300">

              {loading
                ? "Loading Treasury risk assessment..."
                : error
                  ? "Treasury risk assessment is currently unavailable."
                  : data?.executiveAssessment}

            </p>

          </div>

          {!loading && data && (

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                data.overallStatus === "CRITICAL"
                  ? "bg-rose-500/15 text-rose-300"
                  : data.overallStatus === "WATCH"
                    ? "bg-amber-500/15 text-amber-300"
                    : "bg-emerald-500/15 text-emerald-300"
              }`}
            >
              {data.overallStatus}
            </span>

          )}

        </div>

      </div>

    </Panel>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: TreasuryAlertPriority;
}) {
  const label =
    priority.charAt(0) +
    priority.slice(1).toLowerCase();

  const style =
    priority === "HIGH"
      ? "bg-rose-500/15 text-rose-300"
      : priority === "MEDIUM"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-emerald-500/15 text-emerald-300";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}

function SummaryCard({
  title,
  value,
  loading,
  className,
  valueClassName,
}: {
  title: string;
  value: number;
  loading: boolean;
  className: string;
  valueClassName: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
    >

      <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClassName}`}
      >
        {loading ? "—" : value}
      </p>

    </div>
  );
}