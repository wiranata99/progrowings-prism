import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import Panel from "../ui/Panel";

import type { MetricStatus } from "../../types/metric";
import type { ProfitabilityHealthScoreViewModel } from "../../presentation/mappers/profitabilityHealthScoreMapper";

interface ProfitabilityHealthScoreProps {
  data: ProfitabilityHealthScoreViewModel | null;
}

const statusStyles: Record<
  MetricStatus,
  { badge: string; dot: string; bar: string; text: string }
> = {
  Healthy: {
    badge: "bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
    bar: "bg-cyan-400",
    text: "text-emerald-300",
  },
  Watch: {
    badge: "bg-amber-400/15 text-amber-300",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    text: "text-amber-300",
  },
  Warning: {
    badge: "bg-orange-400/15 text-orange-300",
    dot: "bg-orange-400",
    bar: "bg-orange-400",
    text: "text-orange-300",
  },
  Critical: {
    badge: "bg-rose-400/15 text-rose-300",
    dot: "bg-rose-400",
    bar: "bg-rose-400",
    text: "text-rose-300",
  },
};

function EmptyState() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex min-h-[280px] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-amber-300" />
          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            Profitability Health Score is unavailable
          </h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Upload a valid profitability dataset to generate the latest health assessment.
          </p>
        </div>
      </div>
    </Panel>
  );
}

function MovementIcon({ value }: { value: number | null }) {
  if (value === null || value === 0) return <Minus className="h-3.5 w-3.5" />;
  if (value > 0) return <ArrowUpRight className="h-3.5 w-3.5" />;
  return <ArrowDownRight className="h-3.5 w-3.5" />;
}

function getMovementTone(value: number | null, expenseMetric: boolean): string {
  if (value === null || value === 0) return "text-slate-500";
  const favourable = expenseMetric ? value < 0 : value > 0;
  return favourable ? "text-cyan-300" : "text-rose-300";
}

export default function ProfitabilityHealthScore({
  data,
}: ProfitabilityHealthScoreProps) {
  if (!data) return <EmptyState />;

  return (
    <section>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Profitability Health Score
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Ringkasan indikator utama profitabilitas Bank.
          </p>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600">
          Reporting Date {data.reportingDate}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => {
          const style = statusStyles[metric.status];

          return (
            <Panel key={metric.key} className="overflow-hidden rounded-[22px]">
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                    <p className="truncate text-sm font-semibold text-slate-400">
                      {metric.label}
                    </p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${style.badge}`}>
                    {metric.status}
                  </span>
                </div>

                <p className="mt-8 text-5xl font-semibold tracking-tight text-white tabular-nums">
                  {metric.currentValue}
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700/55">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>

                <div className={`mt-5 flex items-center gap-1 text-sm font-semibold ${getMovementTone(metric.movement, metric.expenseMetric)}`}>
                  <MovementIcon value={metric.movement} />
                  <span>{metric.movementLabel}</span>
                </div>

                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                  Versus previous day
                </p>

                <div className="mt-5 border-t border-white/5 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-slate-600">
                        Target
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-300">
                        {metric.targetLabel}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-slate-600">
                        Last EOM ({data.lastEomDate})
                      </p>
                      <p className={`mt-2 text-sm font-semibold ${style.text}`}>
                        {metric.lastEomValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </section>
  );
}
