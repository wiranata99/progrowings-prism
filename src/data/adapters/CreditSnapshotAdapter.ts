import type { PrismModuleSnapshot } from "../../types/prism";
import type { DatabaseRow } from "../database/DatabaseReader";
import type { SchemaRegistry } from "../registry/SchemaRegistry";

export interface CreditSnapshotContext {
  registry: SchemaRegistry;
  ewiRows: DatabaseRow[];
  loanRows: DatabaseRow[];
  thresholdRows: DatabaseRow[];
}

interface ReportingRows {
  current: DatabaseRow;
  previousDay: DatabaseRow;
  previousEom: DatabaseRow;
}

export class CreditSnapshotAdapter {
  public build(context: CreditSnapshotContext): PrismModuleSnapshot {
    const reportingRows = this.getReportingRows(context.ewiRows);

    const metrics = context.registry.getMetrics("Credit");
    const statuses = context.registry.getStatuses("Credit");
    const narratives = context.registry.getNarratives("Credit");

    const builtThresholds = this.buildThresholds(
      context.thresholdRows
    );

    const currentSummary = this.pickFields(
      reportingRows.current,
      metrics
    );

    const previousDaySummary = this.pickFieldsWithSuffix(
      reportingRows.previousDay,
      metrics,
      "_prev"
    );

    const previousEomSummary = this.pickFieldsWithSuffix(
      reportingRows.previousEom,
      metrics,
      "_prev_eom"
    );

    return {
      executive: this.pickFields(
        reportingRows.current,
        metrics
      ),

      summary: {
        ...currentSummary,
        ...previousDaySummary,
        ...previousEomSummary,
      },

      analytics: {
        history: context.loanRows,
      },

      earlyWarning: {
        thresholds: builtThresholds,
        statuses: this.pickFields(
          reportingRows.current,
          statuses
        ),
      },

      narratives: this.pickFields(
        reportingRows.current,
        narratives
      ),
    };
  }

  private pickFields(
    row: DatabaseRow,
    fields: Array<{ header: string }>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.header in row) {
        result[field.header] = row[field.header];
      }
    }

    return result;
  }

  private pickFieldsWithSuffix(
    row: DatabaseRow,
    fields: Array<{ header: string }>,
    suffix: string
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.header in row) {
        result[`${field.header}${suffix}`] =
          row[field.header];
      }
    }

    return result;
  }

  private getReportingRows(
    rows: DatabaseRow[]
  ): ReportingRows {
    const validRows = rows
      .map((row, originalIndex) => ({
        row,
        date: this.getRowDate(row),
        originalIndex,
      }))
      .filter(({ row }) => this.hasValue(row));

    if (validRows.length === 0) {
      return {
        current: {},
        previousDay: {},
        previousEom: {},
      };
    }

    const datedRows = validRows.filter(
      ({ date }) => date !== null
    );

    /*
     * Preferred method:
     * sort using the actual reporting date.
     */
    if (datedRows.length > 0) {
      datedRows.sort((a, b) => {
        return (
          (a.date?.getTime() ?? 0) -
          (b.date?.getTime() ?? 0)
        );
      });

      const currentItem =
        datedRows[datedRows.length - 1];

      const previousDayItem =
        datedRows.length > 1
          ? datedRows[datedRows.length - 2]
          : undefined;

      const previousEomItem =
        this.findPreviousEom(
          datedRows,
          currentItem.date as Date
        );

      return {
        current: currentItem.row,
        previousDay: previousDayItem?.row ?? {},
        previousEom: previousEomItem?.row ?? {},
      };
    }

    /*
     * Fallback:
     * use workbook row order when no valid date column exists.
     */
    validRows.sort(
      (a, b) => a.originalIndex - b.originalIndex
    );

    return {
      current:
        validRows[validRows.length - 1]?.row ?? {},
      previousDay:
        validRows[validRows.length - 2]?.row ?? {},
      previousEom: {},
    };
  }

  private findPreviousEom(
    rows: Array<{
      row: DatabaseRow;
      date: Date | null;
      originalIndex: number;
    }>,
    currentDate: Date
  ): {
    row: DatabaseRow;
    date: Date | null;
    originalIndex: number;
  } | undefined {
    const previousMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear =
      previousMonthDate.getFullYear();

    /*
     * Rows are already sorted ascending.
     * Reverse search returns the last available
     * reporting date in the previous month.
     */
    return [...rows]
      .reverse()
      .find(({ date }) => {
        if (!date) {
          return false;
        }

        return (
          date.getFullYear() === previousMonthYear &&
          date.getMonth() === previousMonth
        );
      });
  }

  private getRowDate(
    row: DatabaseRow
  ): Date | null {
    const dateHeaders = [
      "reporting_date",
      "reporting date",
      "report_date",
      "report date",
      "date",
      "tanggal",
    ];

    const normalizedRow = Object.entries(row).reduce<
      Record<string, unknown>
    >((result, [key, value]) => {
      result[key.trim().toLowerCase()] = value;
      return result;
    }, {});

    for (const header of dateHeaders) {
      const value = normalizedRow[header];
      const parsedDate = this.parseDate(value);

      if (parsedDate) {
        return parsedDate;
      }
    }

    return null;
  }

  private parseDate(
    value: unknown
  ): Date | null {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime())
        ? null
        : value;
    }

    /*
     * Excel serial date support.
     */
    if (typeof value === "number") {
      const excelEpoch = Date.UTC(1899, 11, 30);
      const milliseconds =
        value * 24 * 60 * 60 * 1000;

      const date = new Date(
        excelEpoch + milliseconds
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

    /*
     * Supports DD/MM/YYYY and DD-MM-YYYY.
     */
    const dayFirstMatch = trimmedValue.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
    );

    if (dayFirstMatch) {
      const [, day, month, year] = dayFirstMatch;

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

  private hasValue(
    row: DatabaseRow
  ): boolean {
    return Object.values(row).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    );
  }

  private buildThresholds(
    rows: DatabaseRow[]
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    const mapping: Record<string, string> = {
      "gross npl ratio": "nplg_t",
      "net npl ratio": "npln_t",
      "loan at risk ratio": "lar_t",
      "ckpn coverage ratio": "ckpn_cov_t",
      "total loan portfolio": "loan_t",
    };

    for (const row of rows) {
      const kpi = String(
        row["kpi"] ??
          row["KPI"] ??
          ""
      )
        .trim()
        .toLowerCase();

      const threshold =
        row["threshold"] ??
        row["Threshold"];

      const key = mapping[kpi];

      if (
        key &&
        threshold !== null &&
        threshold !== undefined &&
        threshold !== ""
      ) {
        result[key] = threshold;
      }
    }

    return result;
  }
}