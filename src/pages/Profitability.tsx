import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";
import ProfitabilityExecutivePanel from "../components/profitability/ProfitabilityExecutivePanel";
import StrategicIntelligence from "../components/profitability/StrategicIntelligence";
import ProfitabilityHealthScore from "../components/profitability/ProfitabilityHealthScore";
import IncomeStatementMovement from "../components/profitability/IncomeStatementMovement";
import ProfitDriverAnalysis from "../components/profitability/ProfitDriverAnalysis";
import ProfitabilityEarlyWarning from "../components/profitability/ProfitabilityEarlyWarning";
import { getProfitabilityDashboard, type ProfitabilityDriversViewModel, type ProfitabilityEarlyWarningViewModel } from "../services/profitabilityApi";
import type { ProfitabilityHealthScoreViewModel } from "../presentation/mappers/profitabilityHealthScoreMapper";
import type { IncomeStatementMovementViewModel } from "../presentation/mappers/incomeStatementMovementMapper";
import type { StrategicIntelligenceViewModel } from "../presentation/mappers/strategicIntelligenceMapper";
import type { ProfitabilityExecutiveViewModel } from "../presentation/mappers/profitabilityExecutiveMapper";

interface DashboardState { health: ProfitabilityHealthScoreViewModel; movement: IncomeStatementMovementViewModel; drivers: ProfitabilityDriversViewModel; earlyWarning: ProfitabilityEarlyWarningViewModel; strategic: StrategicIntelligenceViewModel; executive: ProfitabilityExecutiveViewModel; }

export default function Profitability() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; getProfitabilityDashboard().then((result) => { if (active) setData(result); }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Failed to load Profitability Intelligence."); }); return () => { active = false; }; }, []);

  return <AppLayout><div className="space-y-8">
    <SectionHeader eyebrow="Profitability Intelligence" title="Enterprise Profitability Performance" description="Comprehensive monitoring of profitability, financial performance, earnings quality, executive health assessment, and income statement movement." badge={data ? "Live" : error ? "Unavailable" : "Loading"} />
    {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-200">{error}</div>}
    <ProfitabilityHealthScore data={data?.health ?? null} />
    <IncomeStatementMovement data={data?.movement ?? null} />
    <ProfitDriverAnalysis data={data?.drivers ?? null} />
    <ProfitabilityEarlyWarning data={data?.earlyWarning ?? null} />
    {data && <StrategicIntelligence data={data.strategic} />}
    <ProfitabilityExecutivePanel data={data?.executive ?? null} />
  </div></AppLayout>;
}
