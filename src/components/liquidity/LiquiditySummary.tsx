import MetricCard from "../cards/MetricCard";
import { liquiditySummary } from "../../data/liquidity";

export default function LiquiditySummary() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  {liquiditySummary.map((item) => (
    <MetricCard
      key={item.title}
      title={item.title}
      value={item.value}
      trend={item.trend}
      target={item.target}
      status={item.status}
    />
  ))}
</div>
  );
}
