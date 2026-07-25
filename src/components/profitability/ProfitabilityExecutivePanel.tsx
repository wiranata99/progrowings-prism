import ExecutivePanel from "../common/ExecutivePanel";

import type { ProfitabilityExecutiveViewModel } from "../../presentation/mappers/profitabilityExecutiveMapper";

interface ProfitabilityExecutivePanelProps {
  data: ProfitabilityExecutiveViewModel | null;
}

function getConfidence(
  data: ProfitabilityExecutiveViewModel
): string {
  if (data.status === "Critical") {
    return "Confidence 90%";
  }

  if (data.status === "Warning") {
    return "Confidence 92%";
  }

  if (data.status === "Watch") {
    return "Confidence 94%";
  }

  return "Confidence 97%";
}

export default function ProfitabilityExecutivePanel({
  data,
}: ProfitabilityExecutivePanelProps) {
  if (!data) {
    return (
      <ExecutivePanel
        title="Profitability Performance Brief"
        generatedAt="No reporting data available"
        summary="Profitability assessment is unavailable because no valid income statement snapshot has been loaded."
        attention={[
          "Upload a valid PRISM workbook containing DB_IS history.",
        ]}
        recommendations={[
          "Validate the profitability dataset and reload the workbook.",
        ]}
        assessment="No executive profitability assessment can be generated until the required reporting data is available."
        confidence="Confidence unavailable"
        status="Data Unavailable"
      />
    );
  }

  return (
    <ExecutivePanel
      title="Profitability Performance Brief"
      generatedAt={`As of ${data.reportingDate} | 08:00 WIB`}
      summary={data.executiveSummary}
      attention={data.managementAttention}
      recommendations={data.recommendedActions}
      assessment={data.assessmentNarrative}
      confidence={getConfidence(data)}
      status={data.assessmentTitle}
    />
  );
}
