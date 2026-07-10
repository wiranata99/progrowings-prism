import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";

// Hero
import ExecutiveNarrative from "../components/credit/ExecutiveNarrative";
import StrategicIntelligence from "../components/credit/StrategicIntelligence";
import PrismScorecard from "../components/prism/PrismScorecard";

// Executive Overview
import PortfolioSummary from "../components/credit/PortfolioSummary";
// import RiskAppetitePanel from "../components/credit/RiskAppetitePanel";

// Analytics
import PortfolioMomentum from "../components/credit/PortfolioMomentum";
import SectorExposure from "../components/credit/SectorExposure";

// Monitoring
import WatchlistTable from "../components/credit/WatchlistTable";

export default function CreditRisk() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Credit Intelligence"
          title="Enterprise Credit Intelligence"
          description="Executive intelligence workspace for monitoring portfolio quality, identifying emerging risks, and supporting strategic credit decisions."
          badge="Live Monitoring"
        />

        <ExecutiveNarrative />

        <PrismScorecard />

        <PortfolioSummary />

        <StrategicIntelligence />

        {/* <RiskAppetitePanel /> */}

        <PortfolioMomentum />

        <SectorExposure />

        <WatchlistTable />
      </div>
    </AppLayout>
  );
}