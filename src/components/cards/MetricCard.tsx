import type { MetricStatus } from "../../types/metric";

import ProgressBar from "../common/ProgressBar";

import {
  getStatusBadge,
  getStatusDot,
} from "../../utils/statusColor";

import {
  getHealthScore,
} from "../../utils/healthScore";

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: string;
  trend?: string;
  target?: string;
  previousEom?: string;
  status?: MetricStatus;
}

export default function MetricCard({
  title,
  subtitle,
  value,
  trend,
  target,
  previousEom,
  status = "Healthy",
}: MetricCardProps) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-start gap-3">

          <div
            className={`mt-1 h-2.5 w-2.5 rounded-full ${getStatusDot(status)}`}
          />

          <div>

            <p className="text-sm font-medium leading-tight tracking-wide text-slate-400">
              {title}
            </p>

            {subtitle && (
              <p className="mt-1 text-[10px] leading-tight text-slate-500">
                ({subtitle})
              </p>
            )}

          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
            status
          )}`}
        >
          {status}
        </span>

      </div>

      {/* Value */}
      <div className="mt-6">

        <h2
          className={`font-bold tracking-tight text-white ${
            title === "Total Loan Portfolio"
              ? "whitespace-nowrap text-3xl"
              : "text-5xl"
          }`}
        >
          {value}
        </h2>

        <ProgressBar value={getHealthScore(status)} />

      </div>

      {/* Trend */}
      <div className="mt-5">

        <p className="text-sm font-semibold text-cyan-400">
          {trend ?? "-"}
        </p>

        <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
          versus previous day
        </p>

      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-slate-800 transition-colors duration-300 group-hover:bg-slate-700" />

      {/* Footer */}
      <div className="flex items-end justify-between">

        <div>

          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Target
          </p>

          <p className="mt-1 text-sm font-medium text-slate-300">
            {target ?? "-"}
          </p>

        </div>

        <div className="text-right">

          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Previous EOM
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {previousEom ?? "-"}
          </p>

        </div>

      </div>

    </div>
  );
}