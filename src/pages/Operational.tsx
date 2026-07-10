import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";
import OperationalExecutivePanel from "../components/operational/OperationalExecutivePanel";
import OperationalLossTrend from "../components/operational/OperationalLossTrend";
import RiskHeatmap from "../components/operational/RiskHeatmap";
import KRIMonitoring from "../components/operational/KRIMonitoring";
import ControlEffectiveness from "../components/operational/ControlEffectiveness";
import TopOperationalIssues from "../components/operational/TopOperationalIssues";
import AIExecutiveInsight from "../components/operational/AIExecutiveInsight";
// import { useTranslation } from "react-i18next";

export default function Operational() {
// const { t } = useTranslation();
    return (
    <AppLayout>

      <div className="space-y-8">

        <SectionHeader
        
          eyebrow="Operational Intelligence"
          title="Operational Intelligence"
          description="Enterprise Operational Risk Monitoring and Intelligence"
          badge="Month To Date"
        />

        <OperationalExecutivePanel />

        <OperationalLossTrend />

        <RiskHeatmap />

        <ControlEffectiveness />

        <TopOperationalIssues />

        <KRIMonitoring />

        <AIExecutiveInsight />

      </div>

    </AppLayout>
  );
}