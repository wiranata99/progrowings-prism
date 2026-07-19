import type { DatabaseRow } from "../../data/database/DatabaseReader";

export interface CreditMomentumPoint {
  date: string;
  month: string;
  timestamp: number;

  totalLoanAmount: number;
  nplAmount: number;
  totalRatio: number;

  consumerOutstanding: number;
  consumerNplAmount: number;
  consumerRatio: number;

  corporateOutstanding: number;
  corporateNplAmount: number;
  corporateRatio: number;
}

export interface CreditSegmentSummary {
  outstanding: number;
  nplAmount: number;
  ratio: number;

  outstandingDelta: number | null;
  nplDelta: number | null;
  ratioDelta: number | null;
}

export interface CreditMomentumData {
  history: CreditMomentumPoint[];
  consumer: CreditSegmentSummary;
  corporate: CreditSegmentSummary;
}

interface ParsedLoanRow {
  date: Date;

  totalLoanAmount: number | null;
  nplAmount: number | null;
  totalRatio: number | null;

  consumerOutstanding: number | null;
  consumerNplAmount: number | null;
  consumerRatio: number | null;

  corporateOutstanding: number | null;
  corporateNplAmount: number | null;
  corporateRatio: number | null;
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeRow(
  row: DatabaseRow
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    result[normalizeKey(key)] = value;
  }

  return result;
}

function getValue(
  row: Record<string, unknown>,
  aliases: string[]
): unknown {
  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);

    if (normalizedAlias in row) {
      return row[normalizedAlias];
    }
  }

  return undefined;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value
    .replace(/,/g, "")
    .replace(/%/g, "")
    .trim();

  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function toRatio(value: unknown): number | null {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return null;
  }

  return Math.abs(numericValue) <= 1
    ? numericValue * 100
    : numericValue;
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (typeof value === "number") {
    const excelEpoch = Date.UTC(1899, 11, 30);

    const date = new Date(
      excelEpoch +
        value * 24 * 60 * 60 * 1000
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const dayFirstMatch = trimmedValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
  );

  if (dayFirstMatch) {
    const [, day, month, year] =
      dayFirstMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  const date = new Date(trimmedValue);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "2-digit",
  });
}

function calculateGrowth(
  current: number | null,
  previous: number | null
): number | null {
  if (
    current === null ||
    previous === null ||
    previous === 0
  ) {
    return null;
  }

  return (current / previous - 1) * 100;
}

function calculateRatioChange(
  current: number | null,
  previous: number | null
): number | null {
  if (
    current === null ||
    previous === null
  ) {
    return null;
  }

  return current - previous;
}

function findPreviousEom(
  rows: ParsedLoanRow[],
  currentDate: Date
): ParsedLoanRow | undefined {
  const previousMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const previousMonth =
    previousMonthDate.getMonth();

  const previousYear =
    previousMonthDate.getFullYear();

  return [...rows]
    .reverse()
    .find(
      (row) =>
        row.date.getFullYear() ===
          previousYear &&
        row.date.getMonth() ===
          previousMonth
    );
}

function sampleLatestPerMonth(
  rows: ParsedLoanRow[]
): ParsedLoanRow[] {
  const latestByMonth = new Map<
    string,
    ParsedLoanRow
  >();

  for (const row of rows) {
    const key = `${row.date.getFullYear()}-${row.date.getMonth()}`;

    const existing =
      latestByMonth.get(key);

    if (
      !existing ||
      row.date.getTime() >
        existing.date.getTime()
    ) {
      latestByMonth.set(key, row);
    }
  }

  return Array.from(
    latestByMonth.values()
  ).sort(
    (a, b) =>
      a.date.getTime() -
      b.date.getTime()
  );
}

export function mapCreditMomentum(
  rows: DatabaseRow[]
): CreditMomentumData {
  const parsedRows: ParsedLoanRow[] = rows
    .map(
      (
        sourceRow
      ): ParsedLoanRow | null => {
        const row =
          normalizeRow(sourceRow);

        const date = parseDate(
          getValue(row, [
            "reporting_date",
            "report_date",
            "date",
            "tanggal",
          ])
        );

        if (!date) {
          return null;
        }

        return {
          date,

          totalLoanAmount: toNumber(
            getValue(row, ["loans_ttl"])
          ),

          nplAmount: toNumber(
            getValue(row, ["loans_npl"])
          ),

          totalRatio: toRatio(
            getValue(row, ["loans_%npl"])
          ),

          consumerOutstanding: toNumber(
            getValue(row, ["consumer_ttl"])
          ),

          consumerNplAmount: toNumber(
            getValue(row, ["consumer_npl"])
          ),

          consumerRatio: toRatio(
            getValue(row, ["consumer_%npl"])
          ),

          corporateOutstanding: toNumber(
            getValue(row, ["corporate_ttl"])
          ),

          corporateNplAmount: toNumber(
            getValue(row, ["corporate_npl"])
          ),

          corporateRatio: toRatio(
            getValue(row, ["corporate_%npl"])
          ),
        };
      }
    )
    .filter(
      (
        row
      ): row is ParsedLoanRow =>
        row !== null
    )
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );

  const latestRow =
    parsedRows.at(-1);

  const previousEomRow =
    latestRow
      ? findPreviousEom(
          parsedRows,
          latestRow.date
        )
      : undefined;

  const monthlyRows =
    sampleLatestPerMonth(parsedRows);

  return {
    history: monthlyRows.map((row) => ({
      date: formatDate(row.date),
      month: formatMonth(row.date),
      timestamp: row.date.getTime(),

      totalLoanAmount:
        row.totalLoanAmount ?? 0,

      nplAmount:
        row.nplAmount ?? 0,

      totalRatio:
        row.totalRatio ?? 0,

      consumerOutstanding:
        row.consumerOutstanding ?? 0,

      consumerNplAmount:
        row.consumerNplAmount ?? 0,

      consumerRatio:
        row.consumerRatio ?? 0,

      corporateOutstanding:
        row.corporateOutstanding ?? 0,

      corporateNplAmount:
        row.corporateNplAmount ?? 0,

      corporateRatio:
        row.corporateRatio ?? 0,
    })),

    consumer: {
      outstanding:
        latestRow
          ?.consumerOutstanding ?? 0,

      nplAmount:
        latestRow
          ?.consumerNplAmount ?? 0,

      ratio:
        latestRow
          ?.consumerRatio ?? 0,

      outstandingDelta:
        calculateGrowth(
          latestRow
            ?.consumerOutstanding ??
            null,
          previousEomRow
            ?.consumerOutstanding ??
            null
        ),

      nplDelta:
        calculateGrowth(
          latestRow
            ?.consumerNplAmount ??
            null,
          previousEomRow
            ?.consumerNplAmount ??
            null
        ),

      ratioDelta:
        calculateRatioChange(
          latestRow
            ?.consumerRatio ?? null,
          previousEomRow
            ?.consumerRatio ?? null
        ),
    },

    corporate: {
      outstanding:
        latestRow
          ?.corporateOutstanding ?? 0,

      nplAmount:
        latestRow
          ?.corporateNplAmount ?? 0,

      ratio:
        latestRow
          ?.corporateRatio ?? 0,

      outstandingDelta:
        calculateGrowth(
          latestRow
            ?.corporateOutstanding ??
            null,
          previousEomRow
            ?.corporateOutstanding ??
            null
        ),

      nplDelta:
        calculateGrowth(
          latestRow
            ?.corporateNplAmount ??
            null,
          previousEomRow
            ?.corporateNplAmount ??
            null
        ),

      ratioDelta:
        calculateRatioChange(
          latestRow
            ?.corporateRatio ?? null,
          previousEomRow
            ?.corporateRatio ?? null
        ),
    },
  };
}