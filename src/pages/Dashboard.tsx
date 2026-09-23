import { ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit, CircleAlert, Gauge, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import TrendChart from "../components/dashboard/TrendChart";
import { useDashboard } from "../hooks/useDashboard";

const domainRoutes: Record<string, string> = {
  credit: "/credit",
  liquidity: "/liquidity",
  market: "/treasury",
  profitability: "/profitability",
  operational: "/operational",
};

function marketValue(value: number, unit: string) {
  const normalized = unit.toUpperCase();
  if (normalized.includes("PERCENT") || normalized === "%") return `${value.toFixed(2)}%`;
  if (normalized.includes("IDR") && value > 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function marketMovement(value: number, previousValue: number | null) {
  if (previousValue === null) return null;
  const delta = value - previousValue;
  return { delta, up: delta >= 0 };
}

function alertTone(level: string) {
  if (level === "CRITICAL") return "border-rose-500/25 bg-rose-500/[0.06] text-rose-300";
  if (level === "WARNING" || level === "WATCH") return "border-amber-500/25 bg-amber-500/[0.06] text-amber-300";
  return "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-300";
}

export function Dashboard() {
  const { data, loading, error } = useDashboard();

  if (!data) {
    return (
      <AppLayout showHeaderContext={false}>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-10">
          <div className="flex items-center gap-3 text-cyan-300">
            <Radar size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.24em]">Executive Intelligence</span>
          </div>
          <h2 className="mt-4 text-3xl font-black">{loading ? "Building enterprise view..." : "Executive Dashboard unavailable"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {loading ? "PRISM is consolidating the latest production intelligence across risk domains." : error ?? "The dashboard API did not return a usable response."}
          </p>
        </div>
      </AppLayout>
    );
  }

  const activeAlerts = data.alerts.filter((alert) => alert.level !== "LOW");
  const attentionCount = data.domains.filter((domain) => domain.status !== "HEALTHY").length;

  return (
    <AppLayout showHeaderContext={false}>
      <ExecutiveScore
        score={data.enterpriseScore}
        status={data.status}
        delta={data.delta}
        domains={data.domains}
        reportingDate={data.reportingDate}
        portfolioValue={data.context?.portfolioValue}
        riskAppetite={data.context?.riskAppetite}
      />

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/75 p-6 sm:p-8 xl:col-span-5">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/[0.04] blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <BrainCircuit size={17} />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em]">Executive Brief</p>
                </div>
                <h2 className="mt-3 text-2xl font-black">What requires management attention now</h2>
              </div>
              <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${attentionCount ? "border-amber-500/20 bg-amber-500/10 text-amber-300" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"}`}>
                {attentionCount ? `${attentionCount} signal${attentionCount > 1 ? "s" : ""}` : "Controlled"}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              {attentionCount
                ? "PRISM is flagging selected domains for focused review while the remaining production domains stay within the current monitoring framework."
                : "The five production risk domains are currently assessed within the active management framework. Stress testing remains the forward-looking resilience layer."}
            </p>

            <div className="mt-6 space-y-3">
              {(activeAlerts.length ? activeAlerts : data.alerts).slice(0, 3).map((alert, index) => (
                <div key={`${alert.title}-${index}`} className={`rounded-2xl border p-4 ${alertTone(alert.level)}`}>
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 shrink-0" size={17} />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.18em]">{alert.level}</div>
                      <h3 className="mt-1.5 text-sm font-bold text-white">{alert.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-5">
              <Link to="/stress-testing" className="group inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200">
                Open resilience scenario layer <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/75 p-6 sm:p-8 xl:col-span-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Gauge size={17} />
                <p className="text-[11px] font-bold uppercase tracking-[0.22em]">Current Trajectory</p>
              </div>
              <h2 className="mt-3 text-2xl font-black">{data.trend.label} momentum</h2>
            </div>
            <Link to="/credit" className="text-xs font-bold text-slate-400 transition hover:text-cyan-300">Open Credit Intelligence →</Link>
          </div>
          <TrendChart label={data.trend.label} unit={data.trend.unit} points={data.trend.points} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-[#0A1220] p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-300">
              <Radar size={17} />
              <p className="text-[11px] font-bold uppercase tracking-[0.22em]">Macro & Market Pulse</p>
            </div>
            <h2 className="mt-3 text-2xl font-black">External conditions shaping the risk view</h2>
          </div>
          <p className="max-w-xl text-right text-xs leading-5 text-slate-500">Market indicators are displayed as context only; they do not independently alter the enterprise score.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.market.map((metric) => {
            const movement = marketMovement(metric.value, metric.previousValue);
            return (
              <div key={metric.code} className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5 transition duration-300 hover:border-cyan-400/20 hover:bg-slate-900/75">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{metric.code.replaceAll("_", " ")}</p>
                    <p className="mt-2 text-sm text-slate-400">{metric.label}</p>
                  </div>
                  {movement && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${movement.up ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                      {movement.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(movement.delta).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <div className="mt-6 flex items-end justify-between gap-3">
                  <p className="text-3xl font-black tracking-tight text-white">
                    {marketValue(metric.value, metric.unit)}
                    {(metric.unit === "%" || metric.unit.toUpperCase().includes("PERCENT")) ? "" : metric.unit ? <span className="ml-1 text-xs font-semibold text-slate-500">{metric.unit}</span> : null}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {data.domains.map((domain) => (
          <Link key={domain.key} to={domainRoutes[domain.key] ?? "/dashboard"} className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/45 px-4 py-3 text-sm transition hover:border-cyan-400/20 hover:bg-slate-900">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Deep Dive</p>
              <p className="mt-1 font-bold text-slate-200">{domain.name}</p>
            </div>
            <ArrowRight size={16} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
          </Link>
        ))}
      </section>
    </AppLayout>
  );
}
