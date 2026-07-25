import type { MetricStatus } from "../../types/metric";
import type { PrismModuleSnapshot } from "../../types/prism";

export interface ProfitabilityHealthMetric {
  key: string;
  label: string;

  value: number | null;

  currentValue: string;

  movement: number | null;

  movementLabel: string;

  targetLabel: string;

  lastEomValue: string;

  status: MetricStatus;

  progress: number;

  expenseMetric: boolean;
}

export interface ProfitabilityHealthScoreViewModel {
  reportingDate: string;
  lastEomDate: string;
  metrics: ProfitabilityHealthMetric[];
}

type GenericRecord = Record<string, unknown>;

interface MetricConfig {
  key:
    | "roa"
    | "roe"
    | "nim"
    | "bopo"
    | "cir"
    | "interestBearingAssetsYield"
    | "interestBearingLiabilityExpenseRate"
    | "interestSpread";
  label: string;
  direction: "higher" | "lower";
  target: number;
  targetLabel: string;
  source: "ewi" | "nim" | "derived";
}

const metricConfigs: MetricConfig[] = [
  {
    key: "roa",
    label: "Actual ROA",
    direction: "higher",
    target: 0.0075,
    targetLabel: "> 0.75%",
    source: "ewi",
  },
  {
    key: "roe",
    label: "Actual ROE",
    direction: "higher",
    target: 0.03,
    targetLabel: "> 3.00%",
    source: "ewi",
  },
  {
    key: "nim",
    label: "Actual NIM",
    direction: "higher",
    target: 0.03,
    targetLabel: "> 3.00%",
    source: "ewi",
  },
  {
    key: "bopo",
    label: "Actual BOPO",
    direction: "lower",
    target: 0.925,
    targetLabel: "< 92.50%",
    source: "ewi",
  },
  {
    key: "cir",
    label: "Actual CIR",
    direction: "lower",
    target: 0.6,
    targetLabel: "≤ 60.00%",
    source: "derived",
  },
  {
    key: "interestBearingAssetsYield",
    label: "Interest Bearing Assets Yield",
    direction: "higher",
    target: 0.07,
    targetLabel: "> 7.00%",
    source: "nim",
  },
  {
    key: "interestBearingLiabilityExpenseRate",
    label: "Interest Bearing Liability Expense Rate",
    direction: "lower",
    target: 0.05,
    targetLabel: "< 5.00%",
    source: "nim",
  },
  {
    key: "interestSpread",
    label: "Interest Spread",
    direction: "higher",
    target: 0.02,
    targetLabel: "> 2.00%",
    source: "derived",
  },
];

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRecord(record: GenericRecord): GenericRecord {
  return Object.entries(record).reduce<GenericRecord>(
    (result, [key, value]) => {
      result[normalizeKey(key)] = value;
      return result;
    },
    {}
  );
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const rawValue = value.trim();

  if (!rawValue) {
    return null;
  }

  const isPercentage = rawValue.endsWith("%");

  const normalizedValue = rawValue
    .replace(/,/g, "")
    .replace(/%$/, "")
    .trim();

  const parsed = Number(normalizedValue);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return isPercentage ? parsed / 100 : parsed;
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const excelEpoch = Date.UTC(1899, 11, 30);
    const parsed = new Date(excelEpoch + value * 86_400_000);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getHistory(
  profitability: PrismModuleSnapshot,
  section: "incomeStatement" | "nim" | "ewi"
): GenericRecord[] {
  const analytics = profitability.analytics as GenericRecord;
  const group = analytics[section] as GenericRecord | undefined;

  if (!group || !Array.isArray(group.history)) {
    return [];
  }

  return group.history.filter(
    (row): row is GenericRecord =>
      typeof row === "object" &&
      row !== null &&
      !Array.isArray(row)
  );
}

function sortByDate(rows: GenericRecord[]): GenericRecord[] {
  return rows
    .map((row, index) => {
      const normalized = normalizeRecord(row);

      return {
        row,
        index,
        date: parseDate(normalized.date),
      };
    })
    .filter(
      (
        entry
      ): entry is {
        row: GenericRecord;
        index: number;
        date: Date;
      } => entry.date !== null
    )
    .sort((a, b) => {
      const dateDifference = a.date.getTime() - b.date.getTime();

      return dateDifference !== 0
        ? dateDifference
        : a.index - b.index;
    })
    .map((entry) => entry.row);
}

function getLatestRows(
  rows: GenericRecord[]
): [GenericRecord | undefined, GenericRecord | undefined] {
  const sortedRows = sortByDate(rows);

  return [sortedRows.at(-1), sortedRows.at(-2)];
}

function getLatestNimRateRows(
  rows: GenericRecord[]
): [GenericRecord | undefined, GenericRecord | undefined] {
  const rateRows = sortByDate(rows).filter((row) => {
    const normalized = normalizeRecord(row);
    const notes = String(normalized.notes ?? "")
      .trim()
      .toLowerCase();

    return notes === "rate";
  });

  return [rateRows.at(-1), rateRows.at(-2)];
}

function getPreviousEomRow(
  rows: GenericRecord[],
  latestRow: GenericRecord | undefined
): GenericRecord | undefined {
  if (!latestRow) {
    return undefined;
  }

  const latestNormalized = normalizeRecord(latestRow);
  const latestDate = parseDate(latestNormalized.date);

  if (!latestDate) {
    return undefined;
  }

  const candidates = sortByDate(rows).filter((row) => {
    const normalized = normalizeRecord(row);
    const date = parseDate(normalized.date);

    if (!date) {
      return false;
    }

    return (
      date.getFullYear() < latestDate.getFullYear() ||
      (
        date.getFullYear() === latestDate.getFullYear() &&
        date.getMonth() < latestDate.getMonth()
      )
    );
  });

  return candidates.at(-1);
}

function getPreviousEomNimRateRow(
  rows: GenericRecord[],
  latestRow: GenericRecord | undefined
): GenericRecord | undefined {
  const rateRows = sortByDate(rows).filter((row) => {
    const normalized = normalizeRecord(row);

    return (
      String(normalized.notes ?? "")
        .trim()
        .toLowerCase() === "rate"
    );
  });

  return getPreviousEomRow(rateRows, latestRow);
}



function getValue(
  row: GenericRecord | undefined,
  ...keys: string[]
): number | null {
  if (!row) {
    return null;
  }

  const normalized = normalizeRecord(row);

  for (const key of keys) {
    const normalizedKey = normalizeKey(key);
    const value = toNumber(normalized[normalizedKey]);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

function getStatusFromRow(
  row: GenericRecord | undefined,
  key: string
): MetricStatus | null {
  if (!row) {
    return null;
  }

  const normalized = normalizeRecord(row);
  const statusKey = normalizeKey(`${key}_s`);
  const rawStatus = String(normalized[statusKey] ?? "")
    .trim()
    .toLowerCase();

  switch (rawStatus) {
    case "healthy":
      return "Healthy";

    case "watch":
      return "Watch";

    case "warning":
      return "Warning";

    case "critical":
      return "Critical";

    default:
      return null;
  }
}

function calculateStatus(
  value: number | null,
  config: MetricConfig
): MetricStatus {
  if (value === null) {
    return "Warning";
  }

  const ratio =
    config.direction === "higher"
      ? value / config.target
      : config.target / Math.max(value, 0.000001);

  if (ratio >= 1) {
    return "Healthy";
  }

  if (ratio >= 0.9) {
    return "Watch";
  }

  if (ratio >= 0.8) {
    return "Warning";
  }

  return "Critical";
}

function calculateProgress(
  value: number | null,
  config: MetricConfig
): number {
  if (value === null) {
    return 0;
  }

  if (config.direction === "higher") {
    return Math.min(
      100,
      Math.max(0, (value / config.target) * 85)
    );
  }

  if (value <= config.target) {
    return 92;
  }

  return Math.min(
    92,
    Math.max(15, (config.target / value) * 85)
  );
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "-";
  }

  return `${(value * 100).toFixed(2)}%`;
}

function formatMovement(value: number | null): string {
  if (value === null) {
    return "-";
  }

  const percentagePoints = value * 100;
  const sign = percentagePoints > 0 ? "+" : "";

  return `${sign}${percentagePoints.toFixed(2)}%`;
}

function formatShortDate(date: Date | null): string {
  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function calculateCir(
  row: GenericRecord | undefined
): number | null {
  const operatingExpense = getValue(
    row,
    "operating_expense"
  );

  const netInterestIncome = getValue(
    row,
    "net_interest_income"
  );

  const operatingIncome = getValue(
    row,
    "operating_income"
  );

  if (
    operatingExpense === null ||
    netInterestIncome === null ||
    operatingIncome === null
  ) {
    return null;
  }

  const totalOperatingIncome =
  netInterestIncome +
  operatingIncome;

if (totalOperatingIncome <= 0) {
  return null;
}

return operatingExpense / totalOperatingIncome;
}

function calculateCirStatus(
  value: number | null
): MetricStatus {
  if (value === null) {
    return "Warning";
  }

  if (value <= 0.6) {
    return "Healthy";
  }

  if (value <= 0.7) {
    return "Watch";
  }

  if (value <= 0.8) {
    return "Warning";
  }

  return "Critical";
}

export function mapProfitabilityHealthScore(
  profitability: PrismModuleSnapshot | undefined
): ProfitabilityHealthScoreViewModel | null {
  if (!profitability) {
    return null;
  }

  const ewiHistory = getHistory(profitability, "ewi");
  const nimHistory = getHistory(profitability, "nim");
  const incomeStatementHistory = getHistory(
    profitability,
    "incomeStatement"
  );

  const [latestEwi, previousEwi] =
    getLatestRows(ewiHistory);

  const [latestNim, previousNim] =
    getLatestNimRateRows(nimHistory);

  const [latestIncomeStatement, previousIncomeStatement] =
    getLatestRows(incomeStatementHistory);

  const lastEomEwi = getPreviousEomRow(
  ewiHistory,
  latestEwi
);

const lastEomNim = getPreviousEomNimRateRow(
  nimHistory,
  latestNim
);

const lastEomIncomeStatement = getPreviousEomRow(
  incomeStatementHistory,
  latestIncomeStatement
);

const lastEomDates = [
  lastEomEwi,
  lastEomNim,
  lastEomIncomeStatement,
]
  .map((row) => {
    if (!row) {
      return null;
    }

    const normalized = normalizeRecord(row);

    return parseDate(normalized.date);
  })
  .filter(
    (date): date is Date =>
      date !== null
  );

const lastEomDate =
  lastEomDates.length > 0
    ? lastEomDates.reduce(
        (latest, current) =>
          current.getTime() > latest.getTime()
            ? current
            : latest
      )
    : null;

  if (
    !latestEwi &&
    !latestNim &&
    !latestIncomeStatement
  ) {
    return null;
  }

  const latestInterestBearingAssetsYield = getValue(
    latestNim,
    "interest_bearing_asset"
  );

  const previousInterestBearingAssetsYield = getValue(
    previousNim,
    "interest_bearing_asset"
  );

  const latestInterestBearingLiabilityExpenseRate =
    getValue(
      latestNim,
      "interest_bearing_liability"
    );

  const previousInterestBearingLiabilityExpenseRate =
    getValue(
      previousNim,
      "interest_bearing_liability"
    );

  const latestInterestSpread =
    latestInterestBearingAssetsYield !== null &&
    latestInterestBearingLiabilityExpenseRate !== null
      ? latestInterestBearingAssetsYield -
        latestInterestBearingLiabilityExpenseRate
      : null;

  const previousInterestSpread =
    previousInterestBearingAssetsYield !== null &&
    previousInterestBearingLiabilityExpenseRate !== null
      ? previousInterestBearingAssetsYield -
        previousInterestBearingLiabilityExpenseRate
      : null;

  const lastEomInterestBearingAssetsYield =
  getValue(
    lastEomNim,
    "interest_bearing_asset"
  );

const lastEomInterestBearingLiabilityExpenseRate =
  getValue(
    lastEomNim,
    "interest_bearing_liability"
  );

const lastEomInterestSpread =
  lastEomInterestBearingAssetsYield !== null &&
  lastEomInterestBearingLiabilityExpenseRate !== null
    ? lastEomInterestBearingAssetsYield -
      lastEomInterestBearingLiabilityExpenseRate
    : null;

  const latestValues: Record<
    MetricConfig["key"],
    number | null
  > = {
    roa: getValue(latestEwi, "roa"),

    roe: getValue(latestEwi, "roe"),

    nim: getValue(
      latestEwi,
      "nim(ann)"
    ),

    bopo: getValue(latestEwi, "bopo"),

    cir: calculateCir(latestIncomeStatement),

    interestBearingAssetsYield:
      latestInterestBearingAssetsYield,

    interestBearingLiabilityExpenseRate:
      latestInterestBearingLiabilityExpenseRate,

    interestSpread: latestInterestSpread,
  };

  const previousValues: Record<
    MetricConfig["key"],
    number | null
  > = {
    roa: getValue(previousEwi, "roa"),

    roe: getValue(previousEwi, "roe"),

    nim: getValue(
      previousEwi,
      "nim(ann)"
    ),

    bopo: getValue(previousEwi, "bopo"),

    cir: calculateCir(previousIncomeStatement),

    interestBearingAssetsYield:
      previousInterestBearingAssetsYield,

    interestBearingLiabilityExpenseRate:
      previousInterestBearingLiabilityExpenseRate,

    interestSpread: previousInterestSpread,
  };

  const lastEomValues: Record<
  MetricConfig["key"],
  number | null
> = {
  roa: getValue(lastEomEwi, "roa"),

  roe: getValue(lastEomEwi, "roe"),

  nim: getValue(
    lastEomEwi,
    "nim(ann)"
  ),

  bopo: getValue(
    lastEomEwi,
    "bopo"
  ),

  cir: calculateCir(
    lastEomIncomeStatement
  ),

  interestBearingAssetsYield:
    lastEomInterestBearingAssetsYield,

  interestBearingLiabilityExpenseRate:
    lastEomInterestBearingLiabilityExpenseRate,

  interestSpread:
    lastEomInterestSpread,
};

  const metrics: ProfitabilityHealthMetric[] =
    metricConfigs.map((config) => {
      const value =
        latestValues[config.key] ?? null;

      const previousDayValue =
        previousValues[config.key] ?? null;

      const lastEomValue =
        lastEomValues[config.key] ?? null;

      const movement =
        value !== null && previousDayValue !== null
          ? value - previousDayValue
          : null;

      let status: MetricStatus;

      switch (config.key) {
        case "roa":
          status =
            getStatusFromRow(latestEwi, "roa") ??
            calculateStatus(value, config);
          break;

        case "roe":
          status =
            getStatusFromRow(latestEwi, "roe") ??
            calculateStatus(value, config);
          break;

        case "nim":
          status =
            getStatusFromRow(
              latestEwi,
              "nim(ann)"
            ) ??
            calculateStatus(value, config);
          break;

        case "bopo":
          status =
            getStatusFromRow(latestEwi, "bopo") ??
            calculateStatus(value, config);
          break;

        case "cir":
          status = calculateCirStatus(value);
          break;

        default:
          status = calculateStatus(
            value,
            config
          );
          break;
      }

      return {
        key: config.key,
        label: config.label,

        value,

        currentValue: formatPercent(value),

        movement,

        movementLabel: formatMovement(movement),

        targetLabel: config.targetLabel,

        lastEomValue: formatPercent(lastEomValue),

        status,

        progress: calculateProgress(
          value,
          config
        ),

        expenseMetric:
          config.direction === "lower",
      };
    });

  const availableDates = [
    latestEwi,
    latestNim,
    latestIncomeStatement,
  ]
    .map((row) => {
      if (!row) {
        return null;
      }

      const normalized = normalizeRecord(row);
      return parseDate(normalized.date);
    })
    .filter(
      (date): date is Date =>
        date !== null
    );

  const latestDate =
    availableDates.length > 0
      ? availableDates.reduce(
          (latest, current) =>
            current.getTime() > latest.getTime()
              ? current
              : latest
        )
      : new Date();

  return {
  reportingDate: latestDate.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ),

  lastEomDate: formatShortDate(lastEomDate),

  metrics,
};
}