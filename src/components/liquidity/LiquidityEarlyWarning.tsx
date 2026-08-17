import { useEffect, useState } from "react";

import Panel from "../ui/Panel";

type Threshold = {
  operatorMin: string | null;
  minValue: number | null;
  operatorMax: string | null;
  maxValue: number | null;
};

type LiquidityPriority =
  | "Critical"
  | "High"
  | "Medium";

type LiquidityAlert = {
  priority: LiquidityPriority;
  indicator: string;
  businessKey: string;
  current: number;
  unit: string;
  status: string;
  threshold: Threshold | null;
  impact: string;
  action: string;
  color: string;
  icon: string;
};

type EarlyWarningData = {
  activeAlerts: number;
  criticalCount: number;
  warningCount: number;
  watchCount: number;
  alerts: LiquidityAlert[];
  insight: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: EarlyWarningData;
};

function getLiquidityPriorityBadge(
  priority: LiquidityPriority,
) {
  switch (priority) {
    case "Critical":
      return "bg-red-500/10 text-red-400";

    case "High":
      return "bg-orange-500/10 text-orange-400";

    case "Medium":
      return "bg-amber-500/10 text-amber-400";

    default:
      return "bg-slate-500/10 text-slate-400";
  }
}

function formatCurrent(
  value: number,
  unit: string,
) {
  if (unit === "%") {
    return `${value.toFixed(2)}%`;
  }

  return `${value.toFixed(2)}${
    unit ? ` ${unit}` : ""
  }`;
}

function formatThreshold(
  threshold: Threshold | null,
  unit: string,
) {
  if (!threshold) {
    return "N/A";
  }

  const suffix =
    unit === "%"
      ? "%"
      : unit
        ? ` ${unit}`
        : "";

  if (
    threshold.minValue !== null &&
    threshold.maxValue !== null
  ) {
    return `${threshold.minValue}${suffix} – ${threshold.maxValue}${suffix}`;
  }

  if (threshold.minValue !== null) {
    return `≥ ${threshold.minValue}${suffix}`;
  }

  if (threshold.maxValue !== null) {
    return `< ${threshold.maxValue}${suffix}`;
  }

  return "N/A";
}

export default function LiquidityEarlyWarning() {
  const [data, setData] =
    useState<EarlyWarningData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEarlyWarning() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:3001/api/v1/intelligence/liquidity/early-warning",
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`,
          );
        }

        const result: ApiResponse =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load liquidity early warning.",
          );
        }

        if (active) {
          setData(result.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load liquidity early warning.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEarlyWarning();

    return () => {
      active = false;
    };
  }, []);

  const alerts =
    data?.alerts ?? [];

  return (
    <Panel title="Liquidity Early Warning">
      {/* Header */}

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Liquidity Early Warning
          </h2>

          <p className="mt-2 text-slate-400">
            Key liquidity indicators requiring management attention.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Active Alerts
          </p>

          <p className="mt-1 text-4xl font-bold text-cyan-400">
            {loading
              ? "—"
              : data?.activeAlerts ?? 0}
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          Unable to load liquidity early warning:{" "}
          {error}
        </div>
      )}

      {/* Table */}

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-xs uppercase tracking-[0.20em] text-slate-500">
              <th className="px-5 py-4">
                Priority
              </th>

              <th className="px-5 py-4">
                Indicator
              </th>

              <th className="px-5 py-4">
                Current
              </th>

              <th className="px-5 py-4">
                Threshold
              </th>

              <th className="px-5 py-4">
                Impact
              </th>

              <th className="px-5 py-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Loading liquidity intelligence...
                </td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  No active liquidity alerts.
                </td>
              </tr>
            ) : (
              alerts.map((item) => (
                <tr
                  key={item.businessKey}
                  className="border-b border-slate-800 transition hover:bg-slate-800/40"
                >
                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getLiquidityPriorityBadge(
                        item.priority,
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td className="px-5 font-medium text-white">
                    {item.indicator}
                  </td>

                  <td className="px-5 font-semibold text-cyan-400">
                    {formatCurrent(
                      item.current,
                      item.unit,
                    )}
                  </td>

                  <td className="px-5 text-slate-300">
                    {formatThreshold(
                      item.threshold,
                      item.unit,
                    )}
                  </td>

                  <td className="px-5 text-slate-300">
                    {item.impact}
                  </td>

                  <td className="px-5">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Executive Insight */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          {loading
            ? "Generating liquidity intelligence..."
            : data?.insight ??
              "Liquidity intelligence is currently unavailable."}
        </p>
      </div>
    </Panel>
  );
}