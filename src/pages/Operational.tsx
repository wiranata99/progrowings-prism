import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";
import OperationalExecutivePanel from "../components/operational/OperationalExecutivePanel";
import OperationalLossTrend from "../components/operational/OperationalLossTrend";
import RiskHeatmap from "../components/operational/RiskHeatmap";
import KRIMonitoring from "../components/operational/KRIMonitoring";

export default function Operational() {
  return (
    <AppLayout>

      <div className="space-y-8">

        <SectionHeader
        
          eyebrow="Operational Intelligence"
          title="Enterprise Operational Risk"
          description="Comprehensive monitoring of operational risk, loss events, control effectiveness, key risk indicators, and executive decision support."
          badge="Month To Date"
        />

        <OperationalExecutivePanel />

        <OperationalLossTrend />

        <RiskHeatmap />

        <KRIMonitoring />

      </div>

    </AppLayout>
  );
}