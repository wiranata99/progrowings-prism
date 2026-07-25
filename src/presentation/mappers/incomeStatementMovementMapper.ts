import type { DatabaseRow } from "../../data/database/DatabaseReader";
import type { PrismModuleSnapshot } from "../../types/prism";

export type IncomeStatementMovementColumnKey =
  | "previousEoy"
  | "previousEom"
  | "latest"
  | "dtd"
  | "wtd"
  | "mtd";

export type IncomeStatementRowKind =
  | "section"
  | "detail"
  | "subtotal"
  | "total";

export interface IncomeStatementMovementValue {
  raw: number | null;
  formatted: string;
}

export interface IncomeStatementMovementRow {
  key: string;
  label: string;
  kind: IncomeStatementRowKind;
  indent: 0 | 1;
  values: Record<
    IncomeStatementMovementColumnKey,
    IncomeStatementMovementValue
  >;
}

export interface IncomeStatementMovementViewModel {
  reportingDate: string;
  latestDateLabel: string;
  previousEomDate: string;
  previousEoyDate: string;
  weekStartDate: string;
  rows: IncomeStatementMovementRow[];
}

interface DatedRow {
  source: DatabaseRow;
  normalized: Record<string, unknown>;
  date: Date;
  originalIndex: number;
}

interface RowDefinition {
  key: string;
  label: string;
  kind: IncomeStatementRowKind;
  indent: 0 | 1;
  aliases: string[];
}

const rowDefinitions: RowDefinition[] = [
  {
    key: "interestIncome",
    label: "Interest Income",
    kind: "section",
    indent: 0,
    aliases: [
      "interest_income",
      "total_interest_income",
    ],
  },
  {
    key: "securities",
    label: "Securities",
    kind: "detail",
    indent: 1,
    aliases: [
      "securities",
      "interest_income_securities",
      "securities_income",
    ],
  },
  {
    key: "consumerLoan",
    label: "Consumer Loan",
    kind: "detail",
    indent: 1,
    aliases: [
      "consumer_loan",
      "interest_income_consumer_loan",
      "consumer_loan_income",
    ],
  },
  {
    key: "corporateLoan",
    label: "Corporate Loan",
    kind: "detail",
    indent: 1,
    aliases: [
      "corporate_loan",
      "interest_income_corporate_loan",
      "corporate_loan_income",
    ],
  },
  {
    key: "interestIncomeOthers",
    label: "Others",
    kind: "detail",
    indent: 1,
    aliases: [
      "interest_income_others",
      "other_interest_income",
      "interest_income_other",
    ],
  },
  {
    key: "interestExpense",
    label: "Interest Expense",
    kind: "section",
    indent: 0,
    aliases: [
      "interest_expense",
      "total_interest_expense",
    ],
  },
  {
    key: "casa",
    label: "CASA",
    kind: "detail",
    indent: 1,
    aliases: [
      "casa",
      "interest_expense_casa",
      "casa_expense",
    ],
  },
  {
    key: "tdid",
    label: "TDID",
    kind: "detail",
    indent: 1,
    aliases: [
      "tdid",
      "interest_expense_tdid",
      "time_deposit_idr",
      "time_deposit",
    ],
  },
  {
    key: "interbankBorrowing",
    label: "Interbank Borrowing",
    kind: "detail",
    indent: 1,
    aliases: [
      "borrowing",
      "interbank_borrowing",
      "interbank_expense",
    ],
  },
  {
    key: "interestExpenseOthers",
    label: "Others",
    kind: "detail",
    indent: 1,
    aliases: [
      "interest_expense_others",
      "other_interest_expense",
      "interest_expense_other",
    ],
  },
  {
    key: "netInterestIncome",
    label: "Net Interest Income",
    kind: "subtotal",
    indent: 0,
    aliases: [
      "net_interest_income",
      "nii",
    ],
  },
  {
    key: "operatingIncome",
    label: "Operating Income",
    kind: "section",
    indent: 0,
    aliases: [
      "operating_income",
      "total_operating_income",
    ],
  },
  {
    key: "marketableSecuritiesAndLoans",
    label: "Marketable Securities & Loans",
    kind: "detail",
    indent: 1,
    aliases: [
      "marketable_securities_and_loans",
      "marketable_securities_loans",
      "operating_income_marketable_securities_and_loans",
    ],
  },
  {
    key: "commission",
    label: "Commission",
    kind: "detail",
    indent: 1,
    aliases: [
      "commission",
      "commission_income",
      "operating_income_commission",
    ],
  },
  {
    key: "operatingIncomeOthers",
    label: "Others",
    kind: "detail",
    indent: 1,
    aliases: [
      "operating_income_others",
      "other_operating_income",
      "operating_income_other",
    ],
  },
  {
    key: "operatingExpense",
    label: "Operating Expense",
    kind: "section",
    indent: 0,
    aliases: [
      "operating_expense",
      "total_operating_expense",
    ],
  },
  {
    key: "eclCkpn",
    label: "ECL / CKPN",
    kind: "detail",
    indent: 1,
    aliases: [
      "ecl_ckpn",
      "ecl",
      "ckpn",
      "operating_expense_ecl_ckpn",
    ],
  },
  {
    key: "operatingExpenseOthers",
    label: "Others",
    kind: "detail",
    indent: 1,
    aliases: [
      "operating_expense_others",
      "other_operating_expense",
      "operating_expense_other",
    ],
  },
  {
    key: "operationalIncome",
    label: "Operational Income",
    kind: "subtotal",
    indent: 0,
    aliases: [
      "operational_income",
      "operating_profit",
    ],
  },
  {
    key: "nonOperatingIncome",
    label: "Non Operating Income",
    kind: "section",
    indent: 0,
    aliases: [
      "non_operating_income",
      "nonoperating_income",
    ],
  },
  {
    key: "nonOperatingExpense",
    label: "Non Operating Expense",
    kind: "section",
    indent: 0,
    aliases: [
      "non_operating_expense",
      "nonoperating_expense",
    ],
  },
  {
    key: "ebt",
    label: "EBT",
    kind: "subtotal",
    indent: 0,
    aliases: [
      "ebt",
      "earnings_before_tax",
      "profit_before_tax",
    ],
  },
  {
    key: "tax",
    label: "Tax",
    kind: "section",
    indent: 0,
    aliases: [
      "tax",
      "income_tax",
    ],
  },
  {
    key: "deferredTax",
    label: "Deferred Tax",
    kind: "section",
    indent: 0,
    aliases: [
  "defered_tax_expense_and_income",
  "deferred_tax_expense_and_income",
  "deferred_tax",
],
  },
  {
    key: "netProfit",
    label: "Net Profit",
    kind: "total",
    indent: 0,
    aliases: [
      "net_profit",
      "profit_after_tax",
      "pat",
    ],
  },
];

function normalizeKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[&/]+/g, "_")
    .replace(/[\s()-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
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

function parseDate(
  value: unknown
): Date | null {
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

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const dayFirstMatch = trimmed.match(
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

  const parsedDate = new Date(trimmed);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

function getRowDate(
  row: Record<string, unknown>
): Date | null {
  return parseDate(
    row.date ??
      row.reporting_date ??
      row.report_date ??
      row.snapshot_date ??
      row.tanggal
  );
}

function getHistory(
  snapshot: PrismModuleSnapshot
): DatabaseRow[] {
  const analytics =
    snapshot.analytics as Record<
      string,
      unknown
    >;

  const incomeStatement =
    analytics.incomeStatement;

  const nestedHistory =
    typeof incomeStatement === "object" &&
    incomeStatement !== null &&
    !Array.isArray(incomeStatement)
      ? (incomeStatement as Record<string, unknown>).history
      : undefined;

  // Backward compatibility for snapshots created before
  // analytics.incomeStatement.history was introduced.
  const history =
    Array.isArray(nestedHistory)
      ? nestedHistory
      : analytics.history;

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

function getDatedRows(
  rows: DatabaseRow[]
): DatedRow[] {
  return rows
    .map(
      (
        source,
        originalIndex
      ): DatedRow | null => {
        const normalized =
          normalizeRecord(source);

        const date =
          getRowDate(normalized);

        if (!date) {
          return null;
        }

        return {
          source,
          normalized,
          date,
          originalIndex,
        };
      }
    )
    .filter(
      (
        row
      ): row is DatedRow =>
        row !== null
    )
    .sort((a, b) => {
      const dateDifference =
        a.date.getTime() -
        b.date.getTime();

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return (
        a.originalIndex -
        b.originalIndex
      );
    });
}

function toNumber(
  value: unknown
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace(/[,\s]/g, "")
    .replace(/[()]/g, (match) =>
      match === "(" ? "-" : ""
    )
    .trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function getValue(
  row: DatedRow | undefined,
  aliases: string[]
): number | null {
  if (!row) {
    return null;
  }

  for (const alias of aliases) {
    const value =
      row.normalized[
        normalizeKey(alias)
      ];

    const numericValue =
      toNumber(value);

    if (numericValue !== null) {
      return numericValue;
    }
  }

  return null;
}

function subtract(
  current: number | null,
  base: number | null
): number | null {
  if (
    current === null ||
    base === null
  ) {
    return null;
  }

  return current - base;
}

function formatAmount(
  value: number | null
): string {
  if (value === null) {
    return "-";
  }

  return value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  );
}

function buildValue(
  value: number | null
): IncomeStatementMovementValue {
  return {
    raw: value,
    formatted: formatAmount(value),
  };
}

function formatDate(
  date: Date | undefined
): string {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function formatShortDate(
  date: Date | undefined
): string {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
    }
  ).format(date);
}

function getPreviousMonthEndRow(
  rows: DatedRow[],
  latestDate: Date
): DatedRow | undefined {
  return rows
    .filter((row) => {
      const year =
        row.date.getFullYear();

      const month =
        row.date.getMonth();

      return (
        year < latestDate.getFullYear() ||
        (
          year === latestDate.getFullYear() &&
          month < latestDate.getMonth()
        )
      );
    })
    .at(-1);
}

function getPreviousYearEndRow(
  rows: DatedRow[],
  latestDate: Date
): DatedRow | undefined {
  const previousYear =
    latestDate.getFullYear() - 1;

  return rows
    .filter(
      (row) =>
        row.date.getFullYear() ===
        previousYear
    )
    .at(-1);
}

function getWeekBaseRow(
  rows: DatedRow[],
  latestDate: Date
): DatedRow | undefined {
  const dayOfWeek =
    latestDate.getDay();

  const daysSinceMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1;

  const monday =
    new Date(latestDate);

  monday.setHours(0, 0, 0, 0);
  monday.setDate(
    latestDate.getDate() -
      daysSinceMonday
  );

  return rows
    .filter(
      (row) =>
        row.date.getTime() <
        monday.getTime()
    )
    .at(-1);
}

export function mapIncomeStatementMovement(
  profitability:
    | PrismModuleSnapshot
    | undefined
): IncomeStatementMovementViewModel | null {
  if (!profitability) {
    return null;
  }

  const rows =
    getDatedRows(
      getHistory(profitability)
    );

  const latest =
    rows.at(-1);

  if (!latest) {
    return null;
  }

  const previousDay =
    rows.at(-2);

  const previousEom =
    getPreviousMonthEndRow(
      rows,
      latest.date
    );

  const previousEoy =
    getPreviousYearEndRow(
      rows,
      latest.date
    );

  const weekBase =
    getWeekBaseRow(
      rows,
      latest.date
    );

  const mappedRows =
    rowDefinitions.map(
      (
        definition
      ): IncomeStatementMovementRow => {
        const latestValue =
          getValue(
            latest,
            definition.aliases
          );

        const previousDayValue =
          getValue(
            previousDay,
            definition.aliases
          );

        const previousEomValue =
          getValue(
            previousEom,
            definition.aliases
          );

        const previousEoyValue =
          getValue(
            previousEoy,
            definition.aliases
          );

        const weekBaseValue =
          getValue(
            weekBase,
            definition.aliases
          );

        return {
          key: definition.key,
          label: definition.label,
          kind: definition.kind,
          indent: definition.indent,

          values: {
            previousEoy:
              buildValue(
                previousEoyValue
              ),

            previousEom:
              buildValue(
                previousEomValue
              ),

            latest:
              buildValue(
                latestValue
              ),

            dtd:
              buildValue(
                subtract(
                  latestValue,
                  previousDayValue
                )
              ),

            wtd:
              buildValue(
                subtract(
                  latestValue,
                  weekBaseValue
                )
              ),

            mtd:
              buildValue(
                subtract(
                  latestValue,
                  previousEomValue
                )
              ),
          },
        };
      }
    );

  return {
    reportingDate:
      formatDate(
        latest.date
      ),

    latestDateLabel:
      formatShortDate(
        latest.date
      ),

    previousEomDate:
      formatDate(
        previousEom?.date
      ),

    previousEoyDate:
      formatDate(
        previousEoy?.date
      ),

    weekStartDate:
      formatDate(
        weekBase?.date
      ),

    rows:
      mappedRows,
  };
}
