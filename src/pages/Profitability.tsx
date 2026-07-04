import AppLayout from "../components/layout/AppLayout";
import ProfitabilityExecutivePanel from "../components/profitability/ProfitabilityExecutivePanel";
import ProfitabilitySummary from "../components/profitability/ProfitabilitySummary";
import AssetYieldAnalysis from "../components/profitability/AssetYieldAnalysis";
import CostOfFundAnalysis from "../components/profitability/CostOfFundAnalysis";
import ProductMarginAnalysis from "../components/profitability/ProductMarginAnalysis";
import ProfitabilityEarlyWarning from "../components/profitability/ProfitabilityEarlyWarning";
import ProfitDriverAnalysis from "../components/profitability/ProfitDriverAnalysis";
import SectionHeader from "../components/common/SectionHeader";

export default function Profitability() {
  return (
    <AppLayout>

      <div className="space-y-8">

       <SectionHeader
  eyebrow="Profitability Intelligence"
  title="Enterprise Profitability Performance"
  description="Comprehensive monitoring of profitability, financial performance, asset yield, funding cost, margin optimization, and executive decision support."
  badge="Month To Date"
/>

        <ProfitabilityExecutivePanel />

        <ProfitabilitySummary />

        <div className="grid gap-6 xl:grid-cols-2">

  <AssetYieldAnalysis />

  <CostOfFundAnalysis />

</div>

<ProductMarginAnalysis />

<ProfitDriverAnalysis />

<ProfitabilityEarlyWarning />

      </div>

    </AppLayout>
  );
}