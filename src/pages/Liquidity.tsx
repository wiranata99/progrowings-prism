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

// V2 Additional for Front & Back Integration
import { useLiquidityCoreMetrics } from "../hooks/useLiquidityCoreMetrics";
import { mapLiquidityCoreSummary } from "../presentation/mappers/liquidityCoreSummaryMapper";

// V2 Executive Intelligence API Integration
import { useLiquidityExecutive } from "../hooks/useLiquidityExecutive";
import { mapLiquidityExecutiveApi } from "../presentation/mappers/liquidityExecutiveApiMapper";

export default function Liquidity() {
  const {
    data: liquidityCoreData,
    loading: liquidityCoreLoading,
    error: liquidityCoreError,
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
    return mapLiquidityCoreSummary(
      liquidityCoreData
    );
  }, [liquidityCoreData]);

  return (
    <AppLayout>
      <div className="space-y-8">

        <SectionHeader
          eyebrow="Liquidity Intelligence"
          title="Enterprise Liquidity Risk"
          description="Comprehensive monitoring of liquidity position, funding structure, regulatory liquidity ratio, cash flow projection, liquidity stress indicator, and executive decision support."
          badge="Daily Updated"
        />

        {liquidityCoreError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            Liquidity data is temporarily unavailable. Please verify the PRISM API and database connection.
          </div>
        )}

        {!liquidityCoreLoading && (
          <LiquiditySummary
            data={summaryData}
          />
        )}

        <LiquidityMomentum />

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
