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

import { mapLiquiditySummary } from "../presentation/mappers/liquiditySummaryMapper";

// V2 Additional for Front & Back Integration
import { useLiquidityCoreMetrics } from "../hooks/useLiquidityCoreMetrics";
import { mapLiquidityCoreSummary } from "../presentation/mappers/liquidityCoreSummaryMapper";

// V2 Executive Intelligence API Integration
import { useLiquidityExecutive } from "../hooks/useLiquidityExecutive";
import { mapLiquidityExecutiveApi } from "../presentation/mappers/liquidityExecutiveApiMapper";

export default function Liquidity() {
  const snapshot = usePrismStore(
    (state) => state.snapshot
  );

  if (!snapshot) {
    return null;
  }

  const liquiditySnapshot =
    snapshot.modules.liquidity;

  const {
    data: liquidityCoreData,
  } = useLiquidityCoreMetrics(30);

  const {
    data: liquidityExecutiveData,
  } = useLiquidityExecutive();

  const executiveData = useMemo(
    () =>
      liquidityExecutiveData
        ? mapLiquidityExecutiveApi(
            liquidityExecutiveData
          )
        : null,
    [liquidityExecutiveData]
  );

  const summaryData = useMemo(() => {
    const legacy =
      mapLiquiditySummary(
        liquiditySnapshot
      );

    const core =
      mapLiquidityCoreSummary(
        liquidityCoreData
      );

    if (core.length === 0) {
      return legacy;
    }

    const coreTitles =
      new Set(
        core.map(
          (item) => item.title
        )
      );

    const legacyOnly =
      legacy.filter(
        (item) =>
          !coreTitles.has(
            item.title
          )
      );

    return [
      ...core,
      ...legacyOnly,
    ];
  }, [
    liquiditySnapshot,
    liquidityCoreData,
  ]);

  return (
    <AppLayout>
      <div className="space-y-8">

        <SectionHeader
          eyebrow="Liquidity Intelligence"
          title="Enterprise Liquidity Risk"
          description="Comprehensive monitoring of liquidity position, funding structure, regulatory liquidity ratio, cash flow projection, liquidity stress indicator, and executive decision support."
          badge="Daily Updated"
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

      <LiquidityExecutivePanel
        data={executiveData}
      />
    </AppLayout>
  );
}