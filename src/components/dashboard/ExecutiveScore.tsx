import { ArrowDownRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import type { DashboardDomain } from "../../types/dashboard";

const statusClass: Record<DashboardDomain["status"], string> = {
  HEALTHY: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  WATCH: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  WARNING: "bg-orange-500/15 text-orange-300 border-orange-500/20",
  CRITICAL: "bg-rose-500/15 text-rose-300 border-rose-500/20",
};

const statusDot: Record<DashboardDomain["status"], string> = {
  HEALTHY: "bg-emerald-400",
  WATCH: "bg-amber-400",
  WARNING: "bg-orange-400",
  CRITICAL: "bg-rose-400",
};

function formatValue(value: number, unit?: string) {
  if (unit === "%") return `${value.toFixed(2)}%`;
  if (!unit) return value.toFixed(2);
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${unit}`;
}

function formatDate(value?: string | null) {
  if (!value) return "Latest available";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ExecutiveScoreProps {
  score: number;
  status: string;
  delta: number;
  domains: DashboardDomain[];
  reportingDate?: string | null;
  portfolioValue?: number | null;
  riskAppetite?: string;
}

export default function ExecutiveScore({
  score,
  status,
  delta,
  domains,
  reportingDate,
  portfolioValue,
  riskAppetite,
}: ExecutiveScoreProps) {
  const deltaPositive = delta >= 0;
  const ringStyle = {
    background: `conic-gradient(#22d3ee ${Math.max(0, Math.min(100, score)) * 3.6}deg, rgba(51,65,85,.55) 0deg)`,
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_38%),linear-gradient(135deg,#0c1524_0%,#0a111d_55%,#08101a_100%)] p-6 shadow-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-cyan-400/10" />
      <div className="pointer-events-none absolute -right-8 top-6 h-44 w-44 rounded-full border border-slate-700/50" />

      <div className="relative grid gap-8 xl:grid-cols-[1.1fr_1fr] xl:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Sparkles size={13} /> Enterprise Health
            </span>
            <span className="text-xs text-slate-500">As of {formatDate(reportingDate)}</span>
          </div>

          <div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="relative h-40 w-40 shrink-0 rounded-full p-[10px]" style={ringStyle}>
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-slate-700/70 bg-[#0A1220] shadow-inner">
                <span className="text-5xl font-black tracking-tight text-white">{score}</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">PRISM Index</span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{status}</h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <ShieldCheck size={14} /> {riskAppetite ?? "Risk profile monitored"}
                </span>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Executive view across five production intelligence domains, with stress testing maintained as the resilience overlay.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${deltaPositive ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-rose-500/20 bg-rose-500/10 text-rose-300"}`}>
                  {deltaPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {deltaPositive ? "+" : ""}{delta.toFixed(0)} pts vs previous observation
                </div>
                {portfolioValue !== null && portfolioValue !== undefined && (
                  <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                    Credit portfolio <span className="font-black text-white">Rp {portfolioValue.toFixed(1)}T</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {domains.map((domain) => (
            <div key={domain.key} className="group rounded-2xl border border-slate-800/90 bg-slate-950/45 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-slate-900/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${statusDot[domain.status]}`} />
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{domain.name}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{domain.indicatorLabel ?? domain.indicator}</p>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[9px] font-black tracking-wide ${statusClass[domain.status]}`}>{domain.status}</span>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-black text-white">{formatValue(domain.value, domain.unit)}</p>
                  {domain.previousValue !== null && domain.previousValue !== undefined && (
                    <p className="mt-1 text-[11px] text-slate-500">Prev {formatValue(domain.previousValue, domain.unit)}</p>
                  )}
                </div>
                <div className="text-right"><span className="text-xs font-bold text-cyan-300">{domain.score}/100</span>{domain.scoreBasisLabel && domain.scoreBasisLabel !== domain.indicatorLabel && <p className="mt-1 max-w-[120px] text-[9px] leading-3 text-slate-600">Score basis: {domain.scoreBasisLabel}</p>}</div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-cyan-400 transition-all duration-700" style={{ width: `${domain.score}%` }} />
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-cyan-400/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300">Stress Testing</p>
                <p className="mt-2 text-sm text-slate-400">Resilience overlay</p>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[9px] font-black text-cyan-300">ANALYTICS</span>
            </div>
            <p className="mt-5 text-lg font-black text-white">Scenario Engine</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Scenario impact is kept outside the five-domain enterprise score to avoid mixing current-state risk with forward-looking stress output.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
