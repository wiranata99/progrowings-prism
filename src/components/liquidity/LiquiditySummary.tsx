import type { MetricData } from "../../types/metric";

import MetricCard from "../cards/MetricCard";

interface LiquiditySummaryProps {
  data: MetricData[];
}

export default function LiquiditySummary({
  data,
}: LiquiditySummaryProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <MetricCard
          key={item.title}
          title={item.title}
          subtitle={item.subtitle}
          value={item.value}
          trend={item.trend}
          target={item.target}
          previousEom={item.previousEom}
          status={item.status}
        />
      ))}
    </div>
  );
}