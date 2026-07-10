// PortfolioMomentum.tsx
// Replace only the logic section

import { useMemo, useState } from "react";
import { portfolioSegmentationTrend } from "../../data/credit";
import PortfolioSegmentCard from "./PortfolioSegmentCard";
import PortfolioMomentumHeader from "./PortfolioMomentumHeader";
import PortfolioMomentumChart from "./PortfolioMomentumChart";

type Period = 1 | 3 | 6 | 12;

export default function PortfolioMomentum() {
  const [period, setPeriod] = useState<Period>(12);

  const chartData = useMemo(() => {
    if (period === 12) return portfolioSegmentationTrend;

    return portfolioSegmentationTrend.slice(
      portfolioSegmentationTrend.length - period
    );
  }, [period]);

  const ratios = chartData.map((d) => Number(d.totalRatio));

  const latest = ratios.at(-1) ?? 0;
  const peak = Math.max(...ratios);
  const lowest = Math.min(...ratios);

  return (
    <section className="space-y-6">

      <div className="grid gap-6 xl:grid-cols-2">

        <PortfolioSegmentCard
          title="Consumer Loan"
          outstanding="Rp89.4 T"
          nplAmount="Rp2.19 T"
          ratio="2.45%"
        />

        <PortfolioSegmentCard
          title="Corporate Loan"
          outstanding="Rp123.5 T"
          nplAmount="Rp2.96 T"
          ratio="2.40%"
        />

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <PortfolioMomentumHeader
          latest={latest}
          peak={peak}
          lowest={lowest}
          selectedPeriod={period}
          onPeriodChange={setPeriod}
        />

        <PortfolioMomentumChart
          data={chartData}
           period={period}
        />

      </div>

    </section>
  );
}