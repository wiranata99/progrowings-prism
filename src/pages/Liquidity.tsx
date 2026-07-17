import AppLayout from "../components/layout/AppLayout";
import LiquiditySummary from "../components/liquidity/LiquiditySummary";
import LiquidityExecutivePanel from "../components/liquidity/LiquidityExecutivePanel";
import LiquidityTrend from "../components/liquidity/LiquidityTrend";
import FundingComposition from "../components/liquidity/FundingComposition";
import LiquidityGap from "../components/liquidity/LiquidityGap";
import LiquidityEarlyWarning from "../components/liquidity/LiquidityEarlyWarning";
import SectionHeader from "../components/common/SectionHeader";

export default function Liquidity() {
  return (
    <AppLayout>
      <div className="space-y-8">

       <SectionHeader
  eyebrow="Liquidity Intelligence"
  title="Enterprise Liquidity Risk"
  description="Comprehensive monitoring of liquidity position, funding structure, regulatory liquidity ratio, cash flow projection, liquidity stress indicator, and executive decision support."
  badge="Daily Updated"
/>

        <LiquidityExecutivePanel />
        
        <LiquiditySummary />

        <LiquidityTrend />

        <div className="grid gap-6 xl:grid-cols-2">

          <FundingComposition />

          <LiquidityGap />

        </div>

        <LiquidityEarlyWarning />

      </div>
    </AppLayout>
  );
}   