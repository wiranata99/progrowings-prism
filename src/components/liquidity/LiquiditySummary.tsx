import MetricCard from "../cards/MetricCard";

export default function LiquiditySummary() {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Liquidity Health Score
        </h2>

        <p className="mt-2 text-slate-400">
          Executive summary of enterprise liquidity position.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <MetricCard
          title="AL / DPK"
          value="16.42%"
          trend="+0.55%"
          target="≥ 10%"
          status="Healthy"
        />

        <MetricCard
          title="LCR"
          value="152%"
          trend="+8%"
          target="≥ 100%"
          status="Healthy"
        />

        <MetricCard
          title="NSFR Daily"
          value="126%"
          trend="+2%"
          target="≥ 100%"
          status="Healthy"
        />

        <MetricCard
          title="NSFR Projection"
          value="118%"
          trend="-1%"
          target="≥ 100%"
          status="Healthy"
        />

        <MetricCard
          title="Liquidity Buffer"
          value="Rp4.82 T"
          trend="+0.35 T"
          target="> 0"
          status="Healthy"
        />

        <MetricCard
          title="7 Days Ratio"
          value="-0.8%"
          trend="+0.4%"
          target="≥ -2%"
          status="Healthy"
        />

        <MetricCard
          title="3 Months Ratio"
          value="92%"
          trend="+3%"
          target="≥ 85%"
          status="Healthy"
        />

        <MetricCard
          title="CASA Ratio"
          value="41.6%"
          trend="+0.8%"
          target="Corporate Plan"
          status="Healthy"
        />

        <MetricCard
          title="DPK Net Flow"
          value="-2.3%"
          trend="3 Days"
          target="< 10%"
          status="Watch"
        />

      </div>

    </div>
  );
}
