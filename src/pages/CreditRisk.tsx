import AppLayout from "../components/layout/AppLayout";
import PortfolioSummary from "../components/credit/PortfolioSummary";
import PortfolioTrend from "../components/credit/PortfolioTrend";
import SectorExposure from "../components/credit/SectorExposure";
import WatchlistTable from "../components/credit/WatchlistTable";
import AiCopilotPanel from "../components/credit/AiCopilotPanel";
import ExecutiveBrief from "../components/credit/ExecutiveBrief";
import SectionHeader from "../components/common/SectionHeader";

export default function CreditRisk() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Header */}

        <SectionHeader
  eyebrow="Credit Intelligence"
  title="Enterprise Credit Risk"
  description="Comprehensive monitoring of portfolio quality, credit concentration, impairment, early warning indicators, and executive decision support."
  badge="Live Monitoring"
/>

        {/* Executive Brief */}

        <ExecutiveBrief />

        {/* KPI */}

        <PortfolioSummary />

        {/* Trend */}

        <PortfolioTrend />

        {/* Middle */}

        <div className="grid gap-6 xl:grid-cols-2">

          <SectorExposure />

          <AiCopilotPanel />

        </div>

        {/* Watchlist */}

        <WatchlistTable />

      </div>
    </AppLayout>
  );
}