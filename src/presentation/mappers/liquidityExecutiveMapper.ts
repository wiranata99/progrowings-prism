import type { DatabaseRow } from "../../data/database/DatabaseReader";
import type { PrismModuleSnapshot } from "../../types/prism";
import type { MetricStatus } from "../../types/metric";

import {
  calculateDpkNetOutflow,
} from "../../domain/liquidity/calculateDpkNetOutflow";

export interface LiquidityExecutiveViewModel {
  asOfDate: string;
  status: MetricStatus;

  executiveSummary: string;

  managementAttention: string[];
  recommendedActions: string[];

  assessmentTitle: string;
  assessmentNarrative: string;

  riskLevel: string;
  fundingStatus: string;
  monitoringStatus: string;
}

interface CoreLiquidityMetrics {
  lcr: number | null;
  nsfrDaily: number | null;
  nsfrProjection: number | null;
  casaRatio: number | null;
  excessLiquidity: number | null;
  sevenDayRatio: number | null;
  threeMonthRatio: number | null;

  lcrStatus: MetricStatus;
  nsfrDailyStatus: MetricStatus;
  nsfrProjectionStatus: MetricStatus;
  casaStatus: MetricStatus;
  excessLiquidityStatus: MetricStatus;
  sevenDayStatus: MetricStatus;
  threeMonthStatus: MetricStatus;
  dpkOutflowStatus: MetricStatus;
}

const STATUS_PRIORITY: Record<MetricStatus, number> = {
  Healthy: 0,
  Watch: 1,
  Warning: 2,
  Critical: 3,
};

const VALID_STATUSES: MetricStatus[] = [
  "Healthy",
  "Watch",
  "Warning",
  "Critical",
];

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace(/,/g, "")
    .replace(/%/g, "")
    .trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeStatus(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function toStatus(value: unknown): MetricStatus {
  if (typeof value !== "string") {
    return "Healthy";
  }

  const normalized = normalizeStatus(value);

  const matchedStatus = VALID_STATUSES.find(
    (status) => normalizeStatus(status) === normalized
  );

  return matchedStatus ?? "Healthy";
}

function formatRatio(value: number | null): string {
  if (value === null) {
    return "-";
  }

  const percentage =
    Math.abs(value) <= 2
      ? value * 100
      : value;

  return `${percentage.toFixed(2)}%`;
}

function formatAmount(value: number | null): string {
  if (value === null) {
    return "-";
  }

  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1000) {
    return `Rp${(value / 1000).toFixed(2)} T`;
  }

  return `Rp${value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })} Bio`;
}

function getOverallStatus(
  statuses: MetricStatus[]
): MetricStatus {
  return statuses.reduce<MetricStatus>(
    (highestStatus, currentStatus) =>
      STATUS_PRIORITY[currentStatus] >
      STATUS_PRIORITY[highestStatus]
        ? currentStatus
        : highestStatus,
    "Healthy"
  );
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeRecord(
  source: Record<string, unknown>
): Record<string, unknown> {
  return Object.entries(source).reduce<
    Record<string, unknown>
  >((result, [key, value]) => {
    result[normalizeKey(key)] = value;
    return result;
  }, {});
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (typeof value === "number") {
    const excelEpoch = Date.UTC(
      1899,
      11,
      30
    );

    const parsedDate = new Date(
      excelEpoch +
        value * 24 * 60 * 60 * 1000
    );

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const dayFirstMatch =
    trimmedValue.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
    );

  if (dayFirstMatch) {
    const [, day, month, year] =
      dayFirstMatch;

    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  const parsedDate = new Date(trimmedValue);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

function getLiquidityHistory(
  liquidity: PrismModuleSnapshot
): DatabaseRow[] {
  const analytics =
    liquidity.analytics as Record<
      string,
      unknown
    >;

  const history = analytics.history;

  if (!Array.isArray(history)) {
    return [];
  }

  return history.filter(
    (row): row is DatabaseRow =>
      typeof row === "object" &&
      row !== null &&
      !Array.isArray(row)
  );
}

function getSummaryRecord(
  liquidity: PrismModuleSnapshot
): Record<string, unknown> {
  const summary =
    liquidity.summary as Record<
      string,
      unknown
    >;

  const latest = summary.latest;

  if (
    latest &&
    typeof latest === "object" &&
    !Array.isArray(latest)
  ) {
    return normalizeRecord(
      latest as Record<string, unknown>
    );
  }

  return normalizeRecord(summary);
}

function getThresholdRecord(
  liquidity: PrismModuleSnapshot
): Record<string, unknown> {
  const earlyWarning =
    liquidity.earlyWarning as Record<
      string,
      unknown
    >;

  const thresholds =
    earlyWarning.thresholds;

  if (
    !thresholds ||
    typeof thresholds !== "object" ||
    Array.isArray(thresholds)
  ) {
    return {};
  }

  return normalizeRecord(
    thresholds as Record<string, unknown>
  );
}

function getStatusRecord(
  liquidity: PrismModuleSnapshot
): Record<string, unknown> {
  const earlyWarning =
    liquidity.earlyWarning as Record<
      string,
      unknown
    >;

  const statuses =
    earlyWarning.statuses;

  if (
    !statuses ||
    typeof statuses !== "object" ||
    Array.isArray(statuses)
  ) {
    return {};
  }

  return normalizeRecord(
    statuses as Record<string, unknown>
  );
}

function getLatestReportingDate(
  rows: DatabaseRow[]
): string {
  const dates = rows
    .map((sourceRow) => {
      const normalizedRow =
        normalizeRecord(sourceRow);

      return parseDate(
        normalizedRow.date ??
          normalizedRow.reporting_date ??
          normalizedRow.report_date ??
          normalizedRow.snapshot_date ??
          normalizedRow.tanggal
      );
    })
    .filter(
      (date): date is Date =>
        date !== null
    )
    .sort(
      (a, b) =>
        a.getTime() - b.getTime()
    );

  const latestDate = dates.at(-1);

  if (!latestDate) {
    return new Date().toLocaleDateString(
      "en-GB"
    );
  }

  return latestDate.toLocaleDateString(
    "en-GB"
  );
}

function buildExecutiveSummary(
  metrics: CoreLiquidityMetrics,
  status: MetricStatus,
  dpkOutflowValue: number | null
): string {
  const lcr =
    formatRatio(metrics.lcr);

  const nsfrDaily =
    formatRatio(metrics.nsfrDaily);

  const nsfrProjection =
    formatRatio(
      metrics.nsfrProjection
    );

  const dpkOutflow =
    formatAmount(dpkOutflowValue);

  if (status === "Critical") {
    return (
      `The Bank's liquidity position is under significant pressure, ` +
      `with multiple indicators reaching critical levels. ` +
      `LCR is recorded at ${lcr}, Daily NSFR at ${nsfrDaily}, ` +
      `and projected month-end NSFR at ${nsfrProjection}. ` +
      `The maximum monitored deposit movement stands at ${dpkOutflow}. ` +
      `Immediate liquidity preservation and contingency funding actions are required.`
    );
  }

  if (status === "Warning") {
    return (
      `The Bank's liquidity position remains manageable, although material ` +
      `funding pressure has emerged across several monitored indicators. ` +
      `LCR stands at ${lcr}, Daily NSFR at ${nsfrDaily}, ` +
      `and projected month-end NSFR at ${nsfrProjection}. ` +
      `The maximum monitored deposit movement is ${dpkOutflow}. ` +
      `Management should prepare funding contingency measures and strengthen daily monitoring.`
    );
  }

  if (status === "Watch") {
    return (
      `The Bank's liquidity position remains adequate, although early signs ` +
      `of funding pressure require closer management attention. ` +
      `LCR stands at ${lcr}, Daily NSFR at ${nsfrDaily}, ` +
      `and projected month-end NSFR at ${nsfrProjection}. ` +
      `The maximum monitored deposit movement is ${dpkOutflow}. ` +
      `Deposit movements and short-term liquidity buffers should continue to be closely monitored.`
    );
  }

  return (
    `The Bank's liquidity position remains strong and within approved limits. ` +
    `LCR stands at ${lcr}, Daily NSFR at ${nsfrDaily}, ` +
    `and projected month-end NSFR at ${nsfrProjection}. ` +
    `Available liquidity buffers remain adequate to support normal operating requirements.`
  );
}

function buildManagementAttention(
  metrics: CoreLiquidityMetrics
): string[] {
  const attention: string[] = [];

  if (
    metrics.dpkOutflowStatus !==
    "Healthy"
  ) {
    attention.push(
      "Customer deposit movements indicate cumulative funding outflow across the monitored 3-day, 7-day, or 10-day windows."
    );
  }

  if (
    metrics.casaStatus !== "Healthy"
  ) {
    attention.push(
      "CASA Ratio is below its approved target and may increase reliance on higher-cost funding."
    );
  }

  if (
    metrics.nsfrProjectionStatus !==
    "Healthy"
  ) {
    attention.push(
      "Projected month-end NSFR requires close monitoring to maintain an adequate stable funding position."
    );
  }

  if (
    metrics.sevenDayStatus !==
    "Healthy"
  ) {
    attention.push(
      "The 7-day liquidity ratio indicates increasing short-term liquidity pressure."
    );
  }

  if (
    metrics.threeMonthStatus !==
    "Healthy"
  ) {
    attention.push(
      "The 3-month liquidity ratio requires management attention to preserve medium-term liquidity capacity."
    );
  }

  if (
    metrics.excessLiquidityStatus !==
    "Healthy"
  ) {
    attention.push(
      "Available unencumbered liquid assets are declining and should be monitored against upcoming cash-flow requirements."
    );
  }

  if (attention.length === 0) {
    attention.push(
      "No material liquidity pressure is currently identified across the monitored key indicators."
    );
  }

  return attention.slice(0, 4);
}

function buildRecommendedActions(
  status: MetricStatus,
  metrics: CoreLiquidityMetrics
): string[] {
  const actions: string[] = [];

  if (
    metrics.dpkOutflowStatus !==
    "Healthy"
  ) {
    actions.push(
      "Increase monitoring of large depositor movements and identify potential concentration-driven withdrawals."
    );
  }

  if (
    metrics.casaStatus !== "Healthy"
  ) {
    actions.push(
      "Accelerate CASA acquisition and retention initiatives from existing customer relationships."
    );
  }

  if (
    metrics.nsfrProjectionStatus !==
    "Healthy"
  ) {
    actions.push(
      "Closely monitor daily NSFR projections and prepare corrective funding actions before month-end."
    );
  }

  if (
    metrics.sevenDayStatus !==
      "Healthy" ||
    metrics.threeMonthStatus !==
      "Healthy"
  ) {
    actions.push(
      "Review short- and medium-term cash-flow projections under additional deposit outflow scenarios."
    );
  }

  if (
    status === "Warning" ||
    status === "Critical"
  ) {
    actions.push(
      "Prepare available contingency funding sources and assess their operational readiness."
    );
  }

  if (status === "Critical") {
    actions.push(
      "Activate the appropriate stage of the Contingency Funding Plan and escalate liquidity preservation measures."
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Maintain the current funding strategy while continuing daily liquidity monitoring."
    );

    actions.push(
      "Preserve adequate unencumbered liquid assets and maintain funding diversification."
    );

    actions.push(
      "Continue targeted liquidity stress monitoring under deposit outflow scenarios."
    );
  }

  return actions.slice(0, 4);
}

function getAssessmentTitle(
  status: MetricStatus
): string {
  switch (status) {
    case "Critical":
      return "Immediate Liquidity Intervention Required";

    case "Warning":
      return "Liquidity Pressure Requires Management Action";

    case "Watch":
      return "Liquidity Position Remains Adequate with Emerging Pressure";

    default:
      return "Liquidity Position Remains Strong";
  }
}

function getAssessmentNarrative(
  status: MetricStatus
): string {
  switch (status) {
    case "Critical":
      return (
        "Based on the current liquidity ratios, customer deposit movements, " +
        "funding profile, and available liquidity buffers, immediate management " +
        "intervention is required. Liquidity preservation measures and contingency " +
        "funding actions should be executed in accordance with the approved escalation framework."
      );

    case "Warning":
      return (
        "Current liquidity remains manageable, but several indicators show material pressure. " +
        "Management should strengthen funding controls, prepare contingency funding capacity, " +
        "and closely monitor daily liquidity developments."
      );

    case "Watch":
      return (
        "Current liquidity remains within acceptable limits, although emerging pressure " +
        "requires enhanced monitoring. Management should focus on deposit stability, " +
        "short-term cash flows, and projected month-end liquidity ratios."
      );

    default:
      return (
        "Based on current liquidity ratios, funding conditions, projected cash flows, " +
        "and available liquidity buffers, the Bank is expected to comfortably meet its " +
        "short-term obligations under normal operating conditions."
      );
  }
}

function getRiskLevel(
  status: MetricStatus
): string {
  switch (status) {
    case "Critical":
      return "CRITICAL";

    case "Warning":
      return "HIGH";

    case "Watch":
      return "MODERATE";

    default:
      return "LOW";
  }
}

function getFundingStatus(
  metrics: CoreLiquidityMetrics
): string {
  const fundingStatus =
    getOverallStatus([
      metrics.casaStatus,
      metrics.dpkOutflowStatus,
      metrics.nsfrDailyStatus,
      metrics.nsfrProjectionStatus,
    ]);

  switch (fundingStatus) {
    case "Critical":
      return "STRESSED";

    case "Warning":
      return "PRESSURED";

    case "Watch":
      return "MONITORED";

    default:
      return "STABLE";
  }
}

export function mapLiquidityExecutive(
  liquidity:
    | PrismModuleSnapshot
    | undefined
): LiquidityExecutiveViewModel | null {
  if (!liquidity) {
    return null;
  }

  const history =
    getLiquidityHistory(liquidity);

  const summary =
    getSummaryRecord(liquidity);

  const thresholds =
    getThresholdRecord(liquidity);

  const statuses =
    getStatusRecord(liquidity);

  const dpkNetOutflow =
    calculateDpkNetOutflow(history);

  const metrics: CoreLiquidityMetrics = {
    lcr: toNumber(
      summary.lcr
    ),

    nsfrDaily: toNumber(
      summary.nsfr_daily
    ),

    nsfrProjection: toNumber(
      summary["nsfr_(p)eom"] ??
        summary.nsfr_p_eom ??
        summary.nsfr_projection
    ),

    casaRatio: toNumber(
      summary.casa_ratio
    ),

    excessLiquidity: toNumber(
      summary.exc_lqd
    ),

    sevenDayRatio: toNumber(
      summary.lqd7d
    ),

    threeMonthRatio: toNumber(
      summary.lqd3m
    ),

    lcrStatus: toStatus(
      statuses.lcr_s ??
        statuses.lcr
    ),

    nsfrDailyStatus: toStatus(
      statuses.nsfr_daily_s ??
        statuses.nsfr_s
    ),

    nsfrProjectionStatus: toStatus(
      statuses["nsfr_(p)eom_s"] ??
        statuses.nsfr_p_eom_s ??
        statuses.nsfr_projection_s ??
        statuses.nsfr_s
    ),

    casaStatus: toStatus(
      statuses.casa_ratio_s
    ),

    excessLiquidityStatus:
      toStatus(
        statuses.exc_lqd_s
      ),

    sevenDayStatus: toStatus(
      statuses.lqd7d_s
    ),

    threeMonthStatus: toStatus(
      statuses.lqd3m_s
    ),

    dpkOutflowStatus:
      dpkNetOutflow.status,
  };

  void thresholds;

  const overallStatus =
    getOverallStatus([
      metrics.lcrStatus,
      metrics.nsfrDailyStatus,
      metrics.nsfrProjectionStatus,
      metrics.casaStatus,
      metrics.excessLiquidityStatus,
      metrics.sevenDayStatus,
      metrics.threeMonthStatus,
      metrics.dpkOutflowStatus,
    ]);

  return {
    asOfDate:
      getLatestReportingDate(
        history
      ),

    status: overallStatus,

    executiveSummary:
      buildExecutiveSummary(
        metrics,
        overallStatus,
        dpkNetOutflow.value
      ),

    managementAttention:
      buildManagementAttention(
        metrics
      ),

    recommendedActions:
      buildRecommendedActions(
        overallStatus,
        metrics
      ),

    assessmentTitle:
      getAssessmentTitle(
        overallStatus
      ),

    assessmentNarrative:
      getAssessmentNarrative(
        overallStatus
      ),

    riskLevel:
      getRiskLevel(
        overallStatus
      ),

    fundingStatus:
      getFundingStatus(
        metrics
      ),

    monitoringStatus: "DAILY",
  };
}