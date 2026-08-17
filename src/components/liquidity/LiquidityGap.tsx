import { useEffect, useState } from "react";

import Panel from "../ui/Panel";
import { getStatusBadge } from "../../utils/statusColor";

type MetricStatus =
  | "Healthy"
  | "Watch"
  | "Warning"
  | "Critical";

interface GapBucket {
  bucketCode: string;
  bucket: string;

  inflow: number | null;
  outflow: number | null;
  gap: number;

  unit: string;
  status: MetricStatus;

  reconciliation: {
    calculatedGap: number | null;
    difference: number | null;
    isReconciled: boolean | null;
  };
}

interface LiquidityGapData {
  reportingDate: string;
  source: string;

  summary: {
    totalInflow: number;
    totalOutflow: number;
    cumulativeGap: number;
    negativeBucketCount: number;
  };

  buckets: GapBucket[];

  insight: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: LiquidityGapData;
}

import { API_BASE_URL } from "../../config/api";

const API_BASE = API_BASE_URL;

function formatAmount(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);

  if (absValue >= 1000) {
    return `${sign}Rp${(absValue / 1000).toFixed(2)}T`;
  }

  return `${sign}Rp${absValue.toFixed(0)}B`;
}

export default function LiquidityGap() {
  const [data, setData] =
    useState<LiquidityGapData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadLiquidityGap() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `${API_BASE}/intelligence/liquidity/gap`,
        );

        if (!response.ok) {
          throw new Error(
            `Liquidity Gap API failed: ${response.status}`,
          );
        }

        const result: ApiResponse =
          await response.json();

        if (!active) {
          return;
        }

        setData(result.data);
      } catch (err) {
        console.error(
          "Failed to load Liquidity Gap",
          err,
        );

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLiquidityGap();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Panel title="Liquidity Gap">
        <div className="py-12 text-center text-sm text-slate-500">
          Loading liquidity gap...
        </div>
      </Panel>
    );
  }

  if (error || !data) {
    return (
      <Panel title="Liquidity Gap">
        <div className="py-12 text-center text-sm text-amber-400">
          Liquidity gap data is currently unavailable.
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Liquidity Gap">
      <div className="space-y-5">
        {data.buckets.map((item) => (
          <div
            key={item.bucketCode}
            className="rounded-2xl border border-slate-800 p-5 transition hover:border-cyan-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wider text-slate-500">
                  {item.bucket}
                </p>

                <h3
                  className={`mt-2 text-2xl font-bold ${
                    item.gap < 0
                      ? "text-amber-400"
                      : "text-white"
                  }`}
                >
                  {formatAmount(item.gap)}
                </h3>

                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  Net Liquidity Gap
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadge(
                  item.status,
                )}`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Cash Inflow
                </p>

                <p className="mt-1 font-semibold text-emerald-400">
                  {formatAmount(item.inflow)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Cash Outflow
                </p>

                <p className="mt-1 font-semibold text-slate-300">
                  {formatAmount(item.outflow)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          AI Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          {data.insight}
        </p>
      </div>
    </Panel>
  );
}