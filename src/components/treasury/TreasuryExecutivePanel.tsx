import ExecutivePanel from "../common/ExecutivePanel";

export default function TreasuryExecutivePanel() {
  return (
    <ExecutivePanel
      title="Treasury Portfolio Brief"
      generatedAt="As of 10 Jul 2026 | 08:00 WIB"

      summary="The Bank's Treasury portfolio continues to demonstrate resilient performance despite moderate market volatility. Government Securities remain the primary contributor to portfolio income, supported by favorable market positioning and stable carry returns. Portfolio duration remains well within the ALCO-approved limit, while current valuation risk is considered manageable under the prevailing interest rate environment."

      attention={[
        "Modified Duration has increased moderately compared with the previous month.",
        "Long-term government bond yields remain volatile and require close monitoring.",
        "USD/IDR movements may create short-term mark-to-market pressure on FX positions.",
        "Portfolio concentration remains aligned with the Bank's conservative investment strategy."
      ]}

      recommendations={[
        "Continue monitoring Indonesia 10-Year Government Bond yield movements.",
        "Optimize portfolio rebalancing across medium-duration instruments.",
        "Review duration positioning ahead of the upcoming ALCO meeting.",
        "Maintain active monitoring of foreign exchange exposure under volatile market conditions."
      ]}

      assessment="Overall Treasury performance remains healthy. Current portfolio positioning, duration exposure, valuation risk, and investment allocation continue to operate within the Bank's approved risk appetite while providing sustainable earnings contribution."

      confidence="Confidence 96%"

      status="Treasury Portfolio Remains Strong"
    />
  );
}