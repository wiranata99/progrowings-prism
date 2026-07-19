import type {
  MetricData,
  MetricStatus,
} from "../../types/metric";

import type {
  PrismModuleSnapshot,
} from "../../types/prism";

import type {
  DatabaseRow,
} from "../../data/database/DatabaseReader";

import {
  calculateDpkNetOutflow,
} from "../../domain/liquidity/calculateDpkNetOutflow";

type MetricType =
  | "ratio"
  | "amount";

interface LiquidityMetricConfig {
  title: string;
  subtitle?: string;
  key: string;
  thresholdKey: string;
  statusKey: string;
  type: MetricType;
}

interface SummaryRecords {
  latest: Record<
    string,
    unknown
  >;

  previousDay: Record<
    string,
    unknown
  >;

  previousEom: Record<
    string,
    unknown
  >;
}

const validStatuses:
  MetricStatus[] = [
    "Healthy",
    "Watch",
    "Warning",
    "Critical",
  ];

const liquidityMetrics:
  LiquidityMetricConfig[] = [
    {
      title:
        "Liquid Assets per TPF (AL/DPK)",
      key: "al/dpk",
      thresholdKey:
        "al/dpk_t",
      statusKey:
        "al/dpk_s",
      type: "ratio",
    },
    {
      title: "LCR",
      key: "lcr",
      thresholdKey:
        "lcr_t",
      statusKey:
        "lcr_s",
      type: "ratio",
    },
    {
      title:
        "NSFR Daily Monitoring",
      key: "nsfr_daily",
      thresholdKey:
        "nsfr_t",
      statusKey:
        "nsfr_daily_s",
      type: "ratio",
    },
    {
      title:
        "NSFR EOM Projection",
      key: "nsfr_(p)eom",
      thresholdKey:
        "nsfr_t",
      statusKey:
        "nsfr_(p)eom_s",
      type: "ratio",
    },
    {
      title:
        "Excess Liquidity",
      subtitle:
        "Unencumbered Liquid Assets",
      key: "exc_lqd",
      thresholdKey: "",
      statusKey:
        "exc_lqd_s",
      type: "amount",
    },
    {
      title:
        "7 Days Liquidity Ratio",
      key: "lqd7d",
      thresholdKey:
        "lqd7d_t",
      statusKey:
        "lqd7d_s",
      type: "ratio",
    },
    {
      title:
        "3 Months Liquidity Ratio",
      key: "lqd3m",
      thresholdKey:
        "lqd3m_t",
      statusKey:
        "lqd3m_s",
      type: "ratio",
    },
    {
      title:
        "CASA Ratio",
      key: "casa_ratio",
      thresholdKey:
        "casa_ratio_t",
      statusKey:
        "casa_ratio_s",
      type: "ratio",
    },
    {
      title:
        "DPK Net Outflow",
      key:
        "__dpk_net_outflow__",
      thresholdKey:
        "__dynamic__",
      statusKey:
        "__calculated__",
      type: "amount",
    },
  ];

function normalizeKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[\s-]+/g,
      "_"
    );
}

function normalizeRecord(
  source: Record<
    string,
    unknown
  >
): Record<string, unknown> {
  return Object.entries(
    source
  ).reduce<
    Record<string, unknown>
  >(
    (
      result,
      [key, value]
    ) => {
      result[
        normalizeKey(key)
      ] = value;

      return result;
    },
    {}
  );
}

function getObjectRecord(
  value: unknown
): Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return normalizeRecord(
    value as Record<
      string,
      unknown
    >
  );
}

function normalizeStatus(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[\s_-]+/g,
      ""
    );
}

function toMetricStatus(
  value: unknown
): MetricStatus {
  if (
    typeof value !== "string"
  ) {
    /*
     * Missing Excel status must not
     * silently appear Healthy.
     */
    return "Watch";
  }

  const normalized =
    normalizeStatus(value);

  const matchedStatus =
    validStatuses.find(
      (status) =>
        normalizeStatus(
          status
        ) === normalized
    );

  return (
    matchedStatus ??
    "Watch"
  );
}

function toNumber(
  value: unknown
): number | null {
  if (
    typeof value === "number"
  ) {
    return Number.isFinite(
      value
    )
      ? value
      : null;
  }

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value
      .replace(/,/g, "")
      .replace(/%/g, "")
      .trim();

  if (!normalized) {
    return null;
  }

  const parsed =
    Number(normalized);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
}

function normalizeRatio(
  value: number
): number {
  return Math.abs(value) <= 2
    ? value * 100
    : value;
}

function formatRatio(
  value: unknown
): string {
  const numericValue =
    toNumber(value);

  if (
    numericValue === null
  ) {
    return "-";
  }

  return `${normalizeRatio(
    numericValue
  ).toFixed(2)}%`;
}

function formatAmount(
  value: unknown
): string {
  const numericValue =
    toNumber(value);

  if (
    numericValue === null
  ) {
    return "-";
  }

  const absoluteValue =
    Math.abs(
      numericValue
    );

  if (
    absoluteValue >= 1000
  ) {
    return `Rp${(
      numericValue / 1000
    ).toFixed(2)} T`;
  }

  return `Rp${numericValue.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )} Bio`;
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
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  /*
   * Preserve descriptive Excel
   * targets such as >= 100%.
   */
  if (
    typeof value === "string"
  ) {
    return value;
  }

  return formatMetricValue(
    value,
    type
  );
}

function formatTrend(
  currentValue: unknown,
  previousValue: unknown,
  type: MetricType
): string {
  const current =
    toNumber(currentValue);

  const previous =
    toNumber(previousValue);

  if (
    current === null ||
    previous === null
  ) {
    return "-";
  }

  if (
    type === "ratio"
  ) {
    const difference =
      normalizeRatio(
        current
      ) -
      normalizeRatio(
        previous
      );

    const sign =
      difference > 0
        ? "+"
        : "";

    return `${sign}${difference.toFixed(
      2
    )}%`;
  }

  const difference =
    current -
    previous;

  const sign =
    difference > 0
      ? "+"
      : "";

  const absoluteDifference =
    Math.abs(
      difference
    );

  if (
    absoluteDifference >= 1000
  ) {
    return `${sign}Rp${(
      difference / 1000
    ).toFixed(2)} T`;
  }

  return `${sign}Rp${difference.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )} Bio`;
}

function getLiquidityHistory(
  liquidity:
    PrismModuleSnapshot
): DatabaseRow[] {
  const analytics =
    liquidity.analytics as Record<
      string,
      unknown
    >;

  const history =
    analytics.history;

  if (
    !Array.isArray(history)
  ) {
    return [];
  }

  return history.filter(
    (
      row
    ): row is DatabaseRow =>
      typeof row ===
        "object" &&
      row !== null &&
      !Array.isArray(row)
  );
}

function getSummaryRecords(
  liquidity:
    PrismModuleSnapshot
): SummaryRecords {
  const summary =
    liquidity.summary as Record<
      string,
      unknown
    >;

  /*
   * New snapshot structure.
   */
  const latest =
    getObjectRecord(
      summary.latest
    );

  const previousDay =
    getObjectRecord(
      summary.previousDay
    );

  const previousEom =
    getObjectRecord(
      summary.previousEom
    );

  /*
   * Backward compatibility during
   * hot reload or old snapshot state.
   */
  if (
    Object.keys(
      latest
    ).length === 0
  ) {
    return {
      latest:
        normalizeRecord(
          summary
        ),
      previousDay: {},
      previousEom: {},
    };
  }

  return {
    latest,
    previousDay,
    previousEom,
  };
}

function getThresholdRecord(
  liquidity:
    PrismModuleSnapshot
): Record<string, unknown> {
  const earlyWarning =
    liquidity.earlyWarning as Record<
      string,
      unknown
    >;

  return getObjectRecord(
    earlyWarning.thresholds
  );
}

function getStatusRecord(
  liquidity:
    PrismModuleSnapshot
): Record<string, unknown> {
  const earlyWarning =
    liquidity.earlyWarning as Record<
      string,
      unknown
    >;

  return getObjectRecord(
    earlyWarning.statuses
  );
}

export function mapLiquiditySummary(
  liquidity:
    | PrismModuleSnapshot
    | undefined
): MetricData[] {
  if (!liquidity) {
    return [];
  }

  const {
    latest,
    previousDay,
    previousEom,
  } =
    getSummaryRecords(
      liquidity
    );

  const thresholds =
    getThresholdRecord(
      liquidity
    );

  const statuses =
    getStatusRecord(
      liquidity
    );

  const history =
    getLiquidityHistory(
      liquidity
    );

  const dpkNetOutflow =
    calculateDpkNetOutflow(
      history
    );

  return liquidityMetrics.map(
    (
      metric
    ): MetricData => {
      if (
        metric.key ===
        "__dpk_net_outflow__"
      ) {
        return {
          title:
            metric.title,

          subtitle:
            metric.subtitle,

          value:
            formatAmount(
              dpkNetOutflow.value
            ),

          trend: "-",

          target:
            formatAmount(
              dpkNetOutflow.threshold
            ),

          previousEom: "-",

          status:
            dpkNetOutflow.status,
        };
      }

      const currentValue =
        latest[
          metric.key
        ];

      const previousDayValue =
        previousDay[
          metric.key
        ];

      const previousEomValue =
        previousEom[
          metric.key
        ];

      const targetValue =
        metric.thresholdKey
          ? thresholds[
              metric.thresholdKey
            ]
          : undefined;

      const statusValue =
        statuses[
          metric.statusKey
        ];

      return {
        title:
          metric.title,

        subtitle:
          metric.subtitle,

        value:
          formatMetricValue(
            currentValue,
            metric.type
          ),

        /*
         * Difference versus previous
         * available reporting day.
         */
        trend:
          formatTrend(
            currentValue,
            previousDayValue,
            metric.type
          ),

        target:
          formatTarget(
            targetValue,
            metric.type
          ),

        /*
         * Difference versus previous
         * month-end reporting position.
         */
        previousEom:
          formatTrend(
            currentValue,
            previousEomValue,
            metric.type
          ),

        /*
         * Status comes directly from
         * the latest Excel status field.
         */
        status:
          toMetricStatus(
            statusValue
          ),
      };
    }
  );
}