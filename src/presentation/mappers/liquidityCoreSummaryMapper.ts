import type {
  MetricData,
  MetricStatus,
} from "../../types/metric";

import type {
  LiquidityCoreMetricsData,
} from "../../services/liquidityCoreMetricsApi";

function formatPercentage(
  value: number
): string {
  return `${value.toFixed(2)}%`;
}

function formatCurrency(
  value: number
): string {
  const absolute =
    Math.abs(value);

  if (
    absolute >=
    1_000_000_000_000
  ) {
    return `Rp${(
      value /
      1_000_000_000_000
    ).toFixed(2)} T`;
  }

  if (
    absolute >=
    1_000_000_000
  ) {
    return `Rp${(
      value /
      1_000_000_000
    ).toFixed(2)} B`;
  }

  return `Rp${value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )}`;
}

function getStatus(
  metric:
    | "lcr"
    | "nsfrDaily"
    | "alDpk"
    | "casa"
    | "excessLiquidity",
  value: number
): MetricStatus {
  switch (metric) {
    case "lcr":
      if (value < 100)
        return "Critical";
      if (value < 110)
        return "Warning";
      if (value < 120)
        return "Watch";
      return "Healthy";

    case "nsfrDaily":
      if (value < 100)
        return "Critical";
      if (value < 105)
        return "Warning";
      if (value < 110)
        return "Watch";
      return "Healthy";

    case "alDpk":
      if (value < 10)
        return "Critical";
      if (value < 15)
        return "Warning";
      if (value < 20)
        return "Watch";
      return "Healthy";

    case "casa":
      if (value < 40)
        return "Warning";
      if (value < 50)
        return "Watch";
      return "Healthy";

    case "excessLiquidity":
      if (value < 0)
        return "Critical";
      return "Healthy";
  }
}

function percentageChange(
  current: number,
  previous?: number
): string {
  if (
    previous === undefined
  ) {
    return "-";
  }

  const difference =
    current - previous;

  const sign =
    difference > 0 ? "+" : "";

  return `${sign}${difference.toFixed(
    2
  )}%`;
}

function amountChange(
  current: number,
  previous?: number
): string {
  if (
    previous === undefined
  ) {
    return "-";
  }

  const difference =
    current - previous;

  const sign =
    difference > 0 ? "+" : "";

  return `${sign}${formatCurrency(
    difference
  )}`;
}

export function mapLiquidityCoreSummary(
  data:
    LiquidityCoreMetricsData | null
): MetricData[] {
  if (
    !data?.current ||
    data.history.length === 0
  ) {
    return [];
  }

  const current =
    data.current.metrics;

  const previous =
    data.history.length >= 2
      ? data.history[
          data.history.length - 2
        ].metrics
      : undefined;

  return [
    {
      title:
        "Liquid Assets per TPF (AL/DPK)",

      value:
        formatPercentage(
          current.alDpk.value
        ),

      trend:
        percentageChange(
          current.alDpk.value,
          previous?.alDpk.value
        ),

      target: "≥ 10.00%",

      previousEom: "-",

      status:
        getStatus(
          "alDpk",
          current.alDpk.value
        ),
    },

    {
      title: "LCR",

      value:
        formatPercentage(
          current.lcr.value
        ),

      trend:
        percentageChange(
          current.lcr.value,
          previous?.lcr.value
        ),

      target: "≥ 100.00%",

      previousEom: "-",

      status:
        getStatus(
          "lcr",
          current.lcr.value
        ),
    },

    {
      title:
        "NSFR Daily Monitoring",

      value:
        formatPercentage(
          current.nsfrDaily.value
        ),

      trend:
        percentageChange(
          current.nsfrDaily.value,
          previous?.nsfrDaily.value
        ),

      target: "≥ 100.00%",

      previousEom: "-",

      status:
        getStatus(
          "nsfrDaily",
          current.nsfrDaily.value
        ),
    },

    {
      title:
        "Excess Liquidity",

      subtitle:
        "Unencumbered Liquid Assets",

      value:
        formatCurrency(
          current.excessLiquidity
            .value
        ),

      trend:
        amountChange(
          current.excessLiquidity
            .value,
          previous
            ?.excessLiquidity.value
        ),

      target: "≥ Rp0",

      previousEom: "-",

      status:
        getStatus(
          "excessLiquidity",
          current.excessLiquidity
            .value
        ),
    },

    {
      title: "CASA Ratio",

      value:
        formatPercentage(
          current.casa.value
        ),

      trend:
        percentageChange(
          current.casa.value,
          previous?.casa.value
        ),

      target: "≥ 50.00%",

      previousEom: "-",

      status:
        getStatus(
          "casa",
          current.casa.value
        ),
    },
  ];
}