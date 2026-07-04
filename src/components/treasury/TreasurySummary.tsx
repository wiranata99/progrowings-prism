import MetricCard from "../cards/MetricCard";

export default function TreasurySummary() {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Treasury Health Score
        </h2>

        <p className="mt-2 text-slate-400">
          Executive summary of treasury portfolio performance.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <MetricCard
          title="Portfolio Outstanding"
          value="Rp24.8 T"
          trend="+2.4%"
          target="Business Plan"
          status="Healthy"
        />

        <MetricCard
          title="Portfolio Yield"
          value="6.84%"
          trend="+0.12%"
          target="≥ 6.50%"
          status="Healthy"
        />

        <MetricCard
          title="Unrealized Gain"
          value="Rp428 B"
          trend="+18%"
          target="Positive"
          status="Healthy"
        />

        <MetricCard
          title="Realized Gain"
          value="Rp126 B"
          trend="+11%"
          target="YTD Plan"
          status="Healthy"
        />

        <MetricCard
          title="Modified Duration"
          value="3.48"
          trend="+0.12"
          target="< 4.00"
          status="Healthy"
        />

        <MetricCard
          title="Average Duration"
          value="4.10"
          trend="+0.08"
          target="< 5.00"
          status="Healthy"
        />

        <MetricCard
          title="HTM Composition"
          value="62%"
          trend="+2%"
          target="Investment Strategy"
          status="Healthy"
        />

        <MetricCard
          title="FVOCI Composition"
          value="30%"
          trend="-1%"
          target="Investment Strategy"
          status="Healthy"
        />

        <MetricCard
          title="FVTPL Composition"
          value="8%"
          trend="-1%"
          target="< 10%"
          status="Healthy"
        />

      </div>

    </div>
  );
}