import type {
  MetricData,
  MetricStatus,
} from "../../types/metric";

import type { PrismModuleSnapshot } from "../../types/prism";

const validStatuses: MetricStatus[] = [
  "Healthy",
  "Watch",
  "Warning",
  "Critical",
];

type MetricType = "ratio" | "amount";

interface CreditMetricConfig {
  title: string;
  key: string;
  thresholdKey: string;
  statusKey: string;
  type: MetricType;
}

const creditMetrics: CreditMetricConfig[] = [
  {
    title: "Gross NPL Ratio",
    key: "nplg",
    thresholdKey: "nplg_t",
    statusKey: "nplg_s",
    type: "ratio",
  },
  {
    title: "Net NPL Ratio",
    key: "npln",
    thresholdKey: "npln_t",
    statusKey: "npln_s",
    type: "ratio",
  },
  {
    title: "Loan at Risk Ratio",
    key: "lar",
    thresholdKey: "lar_t",
    statusKey: "lar_s",
    type: "ratio",
  },
  {
    title: "CKPN Coverage Ratio",
    key: "ckpn_cov",
    thresholdKey: "ckpn_cov_t",
    statusKey: "ckpn_cov_s",
    type: "ratio",
  },
  {
    title: "Total Loan Portfolio",
    key: "loan",
    thresholdKey: "loan_t",
    statusKey: "loan_s",
    type: "amount",
  },
];

function toMetricStatus(value: unknown): MetricStatus {
  if (
    typeof value === "string" &&
    validStatuses.includes(value as MetricStatus)
  ) {
    return value as MetricStatus;
  }

  return "Watch";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
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

  return null;
}

function formatRatio(value: unknown): string {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return "-";
  }

  return `${(numericValue * 100).toFixed(2)}%`;
}

function formatAmount(value: unknown): string {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return "-";
  }

  return `Rp ${numericValue.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })} Bio`;
}

function formatMetricValue(
  value: unknown,
  type: MetricType
): string {
  return type === "ratio"
    ? formatRatio(value)
    : formatAmount(value);
}

function formatTarget(
  value: unknown,
  type: MetricType
): string {
  if (typeof value === "string") {
    return value;
  }

  return formatMetricValue(value, type);
}

function formatTrend(
  currentValue: unknown,
  previousValue: unknown,
  type: MetricType
): string {
  const current = toNumber(currentValue);
  const previous = toNumber(previousValue);

  if (current === null || previous === null) {
    return "-";
  }

  const difference = current - previous;

  if (type === "ratio") {
    const percentagePointDifference =
      difference * 100;

    const sign =
      percentagePointDifference > 0 ? "+" : "";

    return `${sign}${percentagePointDifference.toFixed(
      2
    )}%`;
  }

  const sign = difference > 0 ? "+" : "";

  return `${sign}Rp ${difference.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )} Bio`;
}

export function mapCreditSummary(
  credit: PrismModuleSnapshot | undefined
): MetricData[] {
  if (!credit) {
    return [];
  }

  const summary =
    (credit.summary as Record<string, unknown>) ?? {};

  const thresholds =
    (credit.earlyWarning?.thresholds as Record<
      string,
      unknown
    >) ?? {};

  const statuses =
    (credit.earlyWarning?.statuses as Record<
      string,
      unknown
    >) ?? {};

  return creditMetrics.map((metric) => {
    const currentValue = summary[metric.key];

    const previousDayValue =
      summary[`${metric.key}_prev`];

    const previousEomValue =
      summary[`${metric.key}_prev_eom`];

    return {
      title: metric.title,

      value: formatMetricValue(
        currentValue,
        metric.type
      ),

      trend: formatTrend(
        currentValue,
        previousDayValue,
        metric.type
      ),

      target: formatTarget(
        thresholds[metric.thresholdKey],
        metric.type
      ),

      previousEom: formatMetricValue(
        previousEomValue,
        metric.type
      ),

      status: toMetricStatus(
        statuses[metric.statusKey]
      ),
    };
  });
}