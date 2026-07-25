import type { MetricStatus } from "../../types/metric";
import type { PrismModuleSnapshot } from "../../types/prism";

import {
  mapIncomeStatementMovement,
  type IncomeStatementMovementRow,
  type IncomeStatementMovementViewModel,
} from "./incomeStatementMovementMapper";

export interface ProfitabilityExecutiveViewModel {
  reportingDate: string;
  status: MetricStatus;

  executiveSummary: string;

  managementAttention: string[];
  recommendedActions: string[];

  assessmentTitle: string;
  assessmentNarrative: string;

  profitabilityLevel: string;
  earningsTrend: string;
  monitoringStatus: string;
}

interface ProfitabilitySignals {
  netInterestIncome: number | null;
  operatingIncome: number | null;
  operatingExpense: number | null;
  operationalIncome: number | null;
  ebt: number | null;
  netProfit: number | null;

  netInterestIncomeMtd: number | null;
  operatingIncomeMtd: number | null;
  operatingExpenseMtd: number | null;
  operationalIncomeMtd: number | null;
  ebtMtd: number | null;
  netProfitMtd: number | null;

  netProfitDtd: number | null;
  netProfitWtd: number | null;
}

const STATUS_PRIORITY: Record<MetricStatus, number> = {
  Healthy: 0,
  Watch: 1,
  Warning: 2,
  Critical: 3,
};

function getRow(
  movement: IncomeStatementMovementViewModel,
  key: string
): IncomeStatementMovementRow | undefined {
  return movement.rows.find(
    (row) => row.key === key
  );
}

function getRawValue(
  row: IncomeStatementMovementRow | undefined,
  column:
    | "latest"
    | "dtd"
    | "wtd"
    | "mtd"
): number | null {
  return row?.values[column].raw ?? null;
}

function getSignals(
  movement: IncomeStatementMovementViewModel
): ProfitabilitySignals {
  const netInterestIncome =
    getRow(movement, "netInterestIncome");

  const operatingIncome =
    getRow(movement, "operatingIncome");

  const operatingExpense =
    getRow(movement, "operatingExpense");

  const operationalIncome =
    getRow(movement, "operationalIncome");

  const ebt =
    getRow(movement, "ebt");

  const netProfit =
    getRow(movement, "netProfit");

  return {
    netInterestIncome:
      getRawValue(
        netInterestIncome,
        "latest"
      ),

    operatingIncome:
      getRawValue(
        operatingIncome,
        "latest"
      ),

    operatingExpense:
      getRawValue(
        operatingExpense,
        "latest"
      ),

    operationalIncome:
      getRawValue(
        operationalIncome,
        "latest"
      ),

    ebt:
      getRawValue(
        ebt,
        "latest"
      ),

    netProfit:
      getRawValue(
        netProfit,
        "latest"
      ),

    netInterestIncomeMtd:
      getRawValue(
        netInterestIncome,
        "mtd"
      ),

    operatingIncomeMtd:
      getRawValue(
        operatingIncome,
        "mtd"
      ),

    operatingExpenseMtd:
      getRawValue(
        operatingExpense,
        "mtd"
      ),

    operationalIncomeMtd:
      getRawValue(
        operationalIncome,
        "mtd"
      ),

    ebtMtd:
      getRawValue(
        ebt,
        "mtd"
      ),

    netProfitMtd:
      getRawValue(
        netProfit,
        "mtd"
      ),

    netProfitDtd:
      getRawValue(
        netProfit,
        "dtd"
      ),

    netProfitWtd:
      getRawValue(
        netProfit,
        "wtd"
      ),
  };
}

function getSignalStatus(
  value: number | null,
  negativeIsAdverse = false
): MetricStatus {
  if (value === null) {
    return "Watch";
  }

  if (value === 0) {
    return "Watch";
  }

  const adverse =
    negativeIsAdverse
      ? value > 0
      : value < 0;

  return adverse
    ? "Warning"
    : "Healthy";
}

function getOverallStatus(
  signals: ProfitabilitySignals
): MetricStatus {
  const statuses: MetricStatus[] = [
    getSignalStatus(
      signals.netProfitMtd
    ),

    getSignalStatus(
      signals.operationalIncomeMtd
    ),

    getSignalStatus(
      signals.ebtMtd
    ),

    getSignalStatus(
      signals.netInterestIncomeMtd
    ),

    getSignalStatus(
      signals.operatingExpenseMtd,
      true
    ),
  ];

  const adverseCount =
    statuses.filter(
      (status) =>
        status === "Warning" ||
        status === "Critical"
    ).length;

  const missingCount =
    statuses.filter(
      (status) =>
        status === "Watch"
    ).length;

  if (
    signals.netProfit !== null &&
    signals.netProfit < 0
  ) {
    return "Critical";
  }

  if (
    signals.netProfitMtd !== null &&
    signals.netProfitMtd < 0 &&
    adverseCount >= 3
  ) {
    return "Critical";
  }

  if (adverseCount >= 2) {
    return "Warning";
  }

  if (
    adverseCount === 1 ||
    missingCount >= 2
  ) {
    return "Watch";
  }

  return "Healthy";
}

function getHighestStatus(
  statuses: MetricStatus[]
): MetricStatus {
  return statuses.reduce<MetricStatus>(
    (highest, current) =>
      STATUS_PRIORITY[current] >
      STATUS_PRIORITY[highest]
        ? current
        : highest,
    "Healthy"
  );
}

function formatAmount(
  value: number | null
): string {
  if (value === null) {
    return "-";
  }

  const absoluteValue =
    Math.abs(value);

  if (absoluteValue >= 1_000_000) {
    return `Rp${(
      value / 1_000_000
    ).toFixed(2)} T`;
  }

  if (absoluteValue >= 1_000) {
    return `Rp${(
      value / 1_000
    ).toFixed(2)} Bio`;
  }

  return `Rp${value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )} Mio`;
}

function getDirection(
  value: number | null
): string {
  if (value === null) {
    return "unavailable";
  }

  if (value > 0) {
    return "increased";
  }

  if (value < 0) {
    return "declined";
  }

  return "remained stable";
}

function buildExecutiveSummary(
  signals: ProfitabilitySignals,
  status: MetricStatus
): string {
  const netProfit =
    formatAmount(
      signals.netProfit
    );

  const netProfitDirection =
    getDirection(
      signals.netProfitMtd
    );

  const niiDirection =
    getDirection(
      signals.netInterestIncomeMtd
    );

  const operatingIncomeDirection =
    getDirection(
      signals.operatingIncomeMtd
    );

  const operatingExpenseDirection =
    getDirection(
      signals.operatingExpenseMtd
    );

  if (status === "Critical") {
    return (
      `The Bank's profitability position is under significant pressure. ` +
      `Net Profit is recorded at ${netProfit} and has ${netProfitDirection} month-to-date. ` +
      `Net Interest Income has ${niiDirection}, while Operating Income has ${operatingIncomeDirection}. ` +
      `Operating Expense has ${operatingExpenseDirection}, resulting in material pressure on earnings sustainability.`
    );
  }

  if (status === "Warning") {
    return (
      `The Bank remains profitable, although earnings performance shows material pressure. ` +
      `Net Profit stands at ${netProfit} and has ${netProfitDirection} month-to-date. ` +
      `Net Interest Income has ${niiDirection}, Operating Income has ${operatingIncomeDirection}, ` +
      `and Operating Expense has ${operatingExpenseDirection}. Management action is required to preserve earnings momentum.`
    );
  }

  if (status === "Watch") {
    return (
      `The Bank's profitability remains adequate, although early signs of earnings pressure require closer monitoring. ` +
      `Net Profit stands at ${netProfit} and has ${netProfitDirection} month-to-date. ` +
      `Net Interest Income has ${niiDirection}, while Operating Income has ${operatingIncomeDirection} ` +
      `and Operating Expense has ${operatingExpenseDirection}.`
    );
  }

  return (
    `The Bank's profitability position remains healthy. ` +
    `Net Profit stands at ${netProfit} and has ${netProfitDirection} month-to-date, ` +
    `supported by Net Interest Income which has ${niiDirection} and Operating Income which has ${operatingIncomeDirection}. ` +
    `Operating Expense has ${operatingExpenseDirection}, while overall earnings remain sustainable.`
  );
}

function buildManagementAttention(
  signals: ProfitabilitySignals
): string[] {
  const attention: string[] = [];

  if (
    signals.netInterestIncomeMtd !== null &&
    signals.netInterestIncomeMtd < 0
  ) {
    attention.push(
      "Net Interest Income has declined month-to-date and requires review of margin, loan yield, and funding cost drivers."
    );
  }

  if (
    signals.operatingIncomeMtd !== null &&
    signals.operatingIncomeMtd < 0
  ) {
    attention.push(
      "Operating Income is weakening and requires assessment of fee income, market-related income, and other revenue sources."
    );
  }

  if (
    signals.operatingExpenseMtd !== null &&
    signals.operatingExpenseMtd > 0
  ) {
    attention.push(
      "Operating Expense has increased month-to-date and may place additional pressure on earnings efficiency."
    );
  }

  if (
    signals.operationalIncomeMtd !== null &&
    signals.operationalIncomeMtd < 0
  ) {
    attention.push(
      "Operational Income is declining and indicates pressure within the Bank's core earnings generation."
    );
  }

  if (
    signals.ebtMtd !== null &&
    signals.ebtMtd < 0
  ) {
    attention.push(
      "Earnings Before Tax has weakened month-to-date and requires review of both operating and non-operating drivers."
    );
  }

  if (
    signals.netProfitMtd !== null &&
    signals.netProfitMtd < 0
  ) {
    attention.push(
      "Net Profit has declined month-to-date and should be closely monitored against the approved business plan."
    );
  }

  if (attention.length === 0) {
    attention.push(
      "No material profitability pressure is currently identified across the monitored income statement drivers."
    );
  }

  return attention.slice(0, 4);
}

function buildRecommendedActions(
  signals: ProfitabilitySignals,
  status: MetricStatus
): string[] {
  const actions: string[] = [];

  if (
    signals.netInterestIncomeMtd !== null &&
    signals.netInterestIncomeMtd < 0
  ) {
    actions.push(
      "Review asset yield, funding cost, and repricing actions to restore Net Interest Income momentum."
    );
  }

  if (
    signals.operatingIncomeMtd !== null &&
    signals.operatingIncomeMtd < 0
  ) {
    actions.push(
      "Accelerate fee-based income initiatives and evaluate underperforming non-interest revenue sources."
    );
  }

  if (
    signals.operatingExpenseMtd !== null &&
    signals.operatingExpenseMtd > 0
  ) {
    actions.push(
      "Strengthen operating expense controls and identify near-term cost optimisation opportunities."
    );
  }

  if (
    signals.operationalIncomeMtd !== null &&
    signals.operationalIncomeMtd < 0
  ) {
    actions.push(
      "Perform a focused review of core operating profitability and prioritise corrective actions on the largest adverse drivers."
    );
  }

  if (
    status === "Warning" ||
    status === "Critical"
  ) {
    actions.push(
      "Increase profitability monitoring frequency and compare actual performance against the latest business plan forecast."
    );
  }

  if (status === "Critical") {
    actions.push(
      "Escalate the earnings recovery plan to senior management and define accountable actions with measurable completion targets."
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Maintain current profitability initiatives while continuing daily monitoring of key income and expense drivers."
    );

    actions.push(
      "Preserve earnings quality through disciplined pricing, funding, and operating cost management."
    );
  }

  return actions.slice(0, 4);
}

function getAssessmentTitle(
  status: MetricStatus
): string {
  switch (status) {
    case "Critical":
      return "Immediate Earnings Recovery Required";

    case "Warning":
      return "Profitability Pressure Requires Management Action";

    case "Watch":
      return "Profitability Remains Adequate with Emerging Pressure";

    default:
      return "Profitability Position Remains Healthy";
  }
}

function getAssessmentNarrative(
  status: MetricStatus
): string {
  switch (status) {
    case "Critical":
      return (
        "Current profitability indicators show significant deterioration across core earnings, operating performance, or Net Profit. " +
        "Immediate management intervention is required to stabilise earnings and execute a structured recovery plan."
      );

    case "Warning":
      return (
        "The Bank remains profitable, but several income statement drivers show material pressure. " +
        "Management should strengthen margin management, revenue generation, and expense control to preserve earnings capacity."
      );

    case "Watch":
      return (
        "Profitability remains within an acceptable range, although emerging pressure requires closer monitoring. " +
        "Management should focus on core income momentum, operating efficiency, and the sustainability of Net Profit."
      );

    default:
      return (
        "Based on current income statement performance, the Bank maintains healthy earnings generation, adequate operating profitability, " +
        "and sufficient capacity to support business growth under normal conditions."
      );
  }
}

function getProfitabilityLevel(
  status: MetricStatus
): string {
  switch (status) {
    case "Critical":
      return "CRITICAL";

    case "Warning":
      return "PRESSURED";

    case "Watch":
      return "ADEQUATE";

    default:
      return "HEALTHY";
  }
}

function getEarningsTrend(
  signals: ProfitabilitySignals
): string {
  const trendStatus =
    getHighestStatus([
      getSignalStatus(
        signals.netProfitDtd
      ),

      getSignalStatus(
        signals.netProfitWtd
      ),

      getSignalStatus(
        signals.netProfitMtd
      ),
    ]);

  switch (trendStatus) {
    case "Critical":
      return "SHARPLY DECLINING";

    case "Warning":
      return "DECLINING";

    case "Watch":
      return "STABLE";

    default:
      return "IMPROVING";
  }
}

export function mapProfitabilityExecutive(
  profitability:
    | PrismModuleSnapshot
    | undefined
): ProfitabilityExecutiveViewModel | null {
  const movement =
    mapIncomeStatementMovement(
      profitability
    );

  if (!movement) {
    return null;
  }

  const signals =
    getSignals(movement);

  const status =
    getOverallStatus(signals);

  return {
    reportingDate:
      movement.reportingDate,

    status,

    executiveSummary:
      buildExecutiveSummary(
        signals,
        status
      ),

    managementAttention:
      buildManagementAttention(
        signals
      ),

    recommendedActions:
      buildRecommendedActions(
        signals,
        status
      ),

    assessmentTitle:
      getAssessmentTitle(
        status
      ),

    assessmentNarrative:
      getAssessmentNarrative(
        status
      ),

    profitabilityLevel:
      getProfitabilityLevel(
        status
      ),

    earningsTrend:
      getEarningsTrend(
        signals
      ),

    monitoringStatus:
      "DAILY",
  };
}
