import AppLayout from "../components/layout/AppLayout";
import LiquiditySummary from "../components/liquidity/LiquiditySummary";
import LiquidityExecutivePanel from "../components/liquidity/LiquidityExecutivePanel";
import LiquidityTrend from "../components/liquidity/LiquidityTrend";
import FundingComposition from "../components/liquidity/FundingComposition";
import LiquidityGap from "../components/liquidity/LiquidityGap";
import LiquidityEarlyWarning from "../components/liquidity/LiquidityEarlyWarning";

export default function Liquidity() {
  return (
    <AppLayout>
      <div className="space-y-8">

        <section>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Liquidity Intelligence
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Enterprise Liquidity Risk
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-400">
            Comprehensive monitoring of liquidity position,
            funding structure,
            regulatory liquidity ratio,
            cash flow projection,
            liquidity stress indicator,
            and executive decision support.
          </p>

        </section>

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