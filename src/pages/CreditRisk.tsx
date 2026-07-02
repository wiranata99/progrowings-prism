import AppLayout from "../components/layout/AppLayout";
import PortfolioSummary from "../components/credit/PortfolioSummary";
import PortfolioTrend from "../components/credit/PortfolioTrend";
import SectorExposure from "../components/credit/SectorExposure";
import WatchlistTable from "../components/credit/WatchlistTable";
import AiCopilotPanel from "../components/credit/AiCopilotPanel";
import ExecutiveBrief from "../components/credit/ExecutiveBrief";

export default function CreditRisk() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Header */}

        <section>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Credit Intelligence
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Enterprise Credit Risk
          </h1>

          <p className="mt-3 max-w-4xl text-slate-400 leading-7">
            Comprehensive monitoring of portfolio quality,
            credit concentration, impairment,
            early warning indicators,
            and executive decision support.
          </p>

        </section>

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