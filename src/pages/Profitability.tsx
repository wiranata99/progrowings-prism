import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";

import { usePrismStore } from "../store/prismStore";

import ProfitabilityExecutivePanel from "../components/profitability/ProfitabilityExecutivePanel";
import StrategicIntelligence from "../components/profitability/StrategicIntelligence";
import ProfitabilityHealthScore from "../components/profitability/ProfitabilityHealthScore";
import IncomeStatementMovement from "../components/profitability/IncomeStatementMovement";
import ProfitDriverAnalysis from "../components/profitability/ProfitDriverAnalysis";
import ProfitabilityEarlyWarning from "../components/profitability/ProfitabilityEarlyWarning";

import { mapProfitabilityExecutive } from "../presentation/mappers/profitabilityExecutiveMapper";
import { mapProfitabilityHealthScore } from "../presentation/mappers/profitabilityHealthScoreMapper";
import { mapIncomeStatementMovement } from "../presentation/mappers/incomeStatementMovementMapper";
import { mapStrategicIntelligence } from "../presentation/mappers/strategicIntelligenceMapper";

export default function Profitability() {
  const snapshot = usePrismStore((state) => state.snapshot);

  const profitability = snapshot?.modules.profitability;

  const executive = mapProfitabilityExecutive(profitability);
  const health = mapProfitabilityHealthScore(profitability);
  const movement = mapIncomeStatementMovement(profitability);
  const strategicIntelligence = mapStrategicIntelligence(profitability);

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Profitability Intelligence"
          title="Enterprise Profitability Performance"
          description="Comprehensive monitoring of profitability, financial performance, earnings quality, executive health assessment, and income statement movement."
          badge="Dynamic Snapshot"
        /> 
       

        <ProfitabilityHealthScore data={health} />

        <IncomeStatementMovement data={movement} />

        <ProfitDriverAnalysis />

        <ProfitabilityEarlyWarning />

        <StrategicIntelligence data={strategicIntelligence} />

        <ProfitabilityExecutivePanel data={executive} />

      </div>
    </AppLayout>
  );
}
