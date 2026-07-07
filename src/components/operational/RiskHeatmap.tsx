import Panel from "../ui/Panel";
import RiskLegend from "./heatmap/RiskLegend";
import RiskMatrix from "./heatmap/RiskMatrix";

const risks = [
  {
    id: 1,
    title: "Cyber Attack",
    owner: "IT Security",
    likelihood: 5,
    impact: 5,
    level: "Extreme" as const,
    exposure: 96,
  },
  {
    id: 2,
    title: "Internal Fraud",
    owner: "Operations",
    likelihood: 4,
    impact: 4,
    level: "High" as const,
    exposure: 78,
  },
  {
    id: 3,
    title: "System Failure",
    owner: "IT Operations",
    likelihood: 3,
    impact: 4,
    level: "High" as const,
    exposure: 69,
  },
  {
    id: 4,
    title: "Settlement Error",
    owner: "Treasury",
    likelihood: 2,
    impact: 3,
    level: "Medium" as const,
    exposure: 48,
  },
  {
    id: 5,
    title: "Documentation Error",
    owner: "Credit Admin",
    likelihood: 2,
    impact: 2,
    level: "Low" as const,
    exposure: 28,
  },
];

export default function RiskHeatmap() {
  return (
    <Panel
      title="Enterprise Risk Heatmap"
      subtitle="Residual Operational Risk Distribution"
    >
      <RiskMatrix risks={risks} />

      <RiskLegend />
    </Panel>
  );
}