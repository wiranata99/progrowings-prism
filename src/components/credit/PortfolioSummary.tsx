import MetricCard from "../cards/MetricCard";

export default function PortfolioSummary() {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Portfolio Overview
        </h2>

        <p className="mt-2 text-slate-400">
          Executive summary of enterprise credit portfolio.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Total Portfolio"
          value="Rp60.5 T"
          trend="+3.8% YoY"
          target="Business Plan"
          status="Healthy"
        />

        <MetricCard
          title="Gross NPL"
          value="2.42%"
          trend="-0.08%"
          target="< 3.00%"
          status="Healthy"
        />

        <MetricCard
          title="Net NPL"
          value="0.88%"
          trend="-0.02%"
          target="< 1.00%"
          status="Healthy"
        />

        <MetricCard
          title="CKPN Coverage"
          value="165%"
          trend="+5%"
          target="> 150%"
          status="Healthy"
        />

      </div>

    </div>
  );
}