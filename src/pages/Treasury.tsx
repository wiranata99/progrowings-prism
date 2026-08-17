import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";
import TreasuryExecutivePanel from "../components/treasury/TreasuryExecutivePanel";
// import TreasurySummary from "../components/treasury/TreasurySummary";
import TreasuryPerformanceTrend from "../components/treasury/TreasuryPerformanceTrend";
import PortfolioComposition from "../components/treasury/PortfolioComposition";
import DurationAnalysis from "../components/treasury/DurationAnalysis";
// import MarketOutlook from "../components/treasury/MarketOutlook";
import TreasuryEarlyWarning from "../components/treasury/TreasuryEarlyWarning";
import StrategicIntelligence from "../components/treasury/StrategicIntelligence";
import MarketRiskDashboard from "../components/treasury/MarketRiskDashboard";
import TreasuryFundingComposition from "../components/treasury/TreasuryFundingComposition";
import TreasuryPortfolioDetail from "../components/treasury/TreasuryPortfolioDetail";

export default function Treasury() {
  return (
    <AppLayout>

      <div className="space-y-8">

        <SectionHeader
          eyebrow="Treasury Intelligence"
          title="Enterprise Treasury Portfolio"
          description="Comprehensive monitoring of investment portfolio performance, duration, valuation, treasury income, and executive decision support."
          badge="Daily Updated"
        />
        
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PortfolioComposition />
          <TreasuryFundingComposition />
        </div>
        
          <MarketRiskDashboard />

          <TreasuryPortfolioDetail />      

        <TreasuryPerformanceTrend />

        <div className="grid gap-8 xl:grid-cols-2">
          <DurationAnalysis />
          <TreasuryEarlyWarning />

          <StrategicIntelligence />
          <TreasuryExecutivePanel />
          
        </div>

      </div>

    </AppLayout>
  );
}