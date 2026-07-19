import MetricCard from "../cards/MetricCard";
import { creditSummary as fallbackCreditSummary } from "../../data/credit";
import { usePrismStore } from "../../store/prismStore";
import { mapCreditSummary } from "../../presentation/mappers/creditSummaryMapper";

export default function PortfolioSummary() {
  const snapshot = usePrismStore((state) => state.snapshot);

  const mappedSummary = mapCreditSummary(
    snapshot?.modules.credit
  );

  const creditSummary =
    mappedSummary.length > 0
      ? mappedSummary
      : fallbackCreditSummary;

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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {creditSummary.map((item) => (
          <MetricCard
            key={item.title}
            title={item.title}
            value={item.value}
            trend={item.trend}
            target={item.target}
            previousEom={item.previousEom}
            status={item.status}
          />
        ))}
      </div>
    </div>
  );
}