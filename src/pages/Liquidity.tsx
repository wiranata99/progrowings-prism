import { useMemo } from "react";

import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";

import LiquidityExecutivePanel from "../components/liquidity/LiquidityExecutivePanel";
import LiquiditySummary from "../components/liquidity/LiquiditySummary";
import LiquidityMomentum from "../components/liquidity/LiquidityMomentum";
// import LiquidityTrend from "../components/liquidity/LiquidityTrend";
import FundingComposition from "../components/liquidity/FundingComposition";
import LiquidityGap from "../components/liquidity/LiquidityGap";
import LiquidityEarlyWarning from "../components/liquidity/LiquidityEarlyWarning";

import { usePrismStore } from "../store/prismStore";

import { mapLiquidityExecutive } from "../presentation/mappers/liquidityExecutiveMapper";
import { mapLiquiditySummary } from "../presentation/mappers/liquiditySummaryMapper";

export default function Liquidity() {
  const snapshot = usePrismStore(
    (state) => state.snapshot
  );

  if (!snapshot) {
    return null;
  }

  const liquiditySnapshot =
    snapshot.modules.liquidity;

  const executiveData = useMemo(
    () =>
      mapLiquidityExecutive(
        liquiditySnapshot
      ),
    [liquiditySnapshot]
  );

  const summaryData = useMemo(
    () =>
      mapLiquiditySummary(
        liquiditySnapshot
      ),
    [liquiditySnapshot]
  );

  return (
    <AppLayout>
      <div className="space-y-8">

        <SectionHeader
          eyebrow="Liquidity Intelligence"
          title="Enterprise Liquidity Risk"
          description="Comprehensive monitoring of liquidity position, funding structure, regulatory liquidity ratio, cash flow projection, liquidity stress indicator, and executive decision support."
          badge="Daily Updated"
        />

        <LiquidityExecutivePanel
          data={executiveData}
        />

        <LiquiditySummary
          data={summaryData}
        />

        <LiquidityMomentum
          snapshot={liquiditySnapshot}
        />

        

        <div className="grid gap-6 xl:grid-cols-2">

          <FundingComposition />

          <LiquidityGap />

        </div>

        <LiquidityEarlyWarning />

      </div>
    </AppLayout>
  );
}