import ExecutivePanel from "../common/ExecutivePanel";

export default function ProfitabilityExecutivePanel() {
  return (
    <ExecutivePanel
      title="Profitability Performance Brief"
      generatedAt="As of 11 Jul 2026 | 08:00 WIB"

      summary="The Bank continues to deliver resilient profitability supported by healthy loan growth, stable Net Interest Margin, and disciplined funding cost management. Growth in earning assets continues to offset moderate increases in Cost of Fund and operating expenses, allowing overall profitability to remain above the approved Business Plan."

      attention={[
        "Cost of Fund increased slightly compared with the previous month due to higher competition for term deposits.",
        "Operating Expense continues to rise faster than revenue growth, putting pressure on the Cost-to-Income Ratio.",
        "Corporate lending remains the primary contributor to interest income, while consumer lending continues to provide stronger portfolio margins.",
        "Treasury investment income remains stable despite moderate market volatility."
      ]}

      recommendations={[
        "Accelerate CASA acquisition to improve funding mix and reduce Cost of Fund.",
        "Review pricing strategy for low-spread lending products to strengthen portfolio margin.",
        "Continue operational efficiency initiatives to improve the Cost-to-Income Ratio.",
        "Maintain disciplined balance sheet growth while preserving sustainable profitability."
      ]}

      assessment="Overall profitability remains healthy and well above internal targets. Current earnings performance is supported by a balanced combination of loan growth, stable funding costs, disciplined expense management, and resilient treasury income. Profitability is expected to remain within the approved risk appetite and Business Plan through year-end."

      confidence="Confidence 97%"

      status="Profitability Remains Strong"
    />
  );
}