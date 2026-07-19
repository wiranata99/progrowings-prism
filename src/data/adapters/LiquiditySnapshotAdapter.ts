import type { PrismModuleSnapshot } from "../../types/prism";
import type { DatabaseRow } from "../database/DatabaseReader";
import type { SchemaRegistry } from "../registry/SchemaRegistry";

export interface LiquiditySnapshotContext {
  registry: SchemaRegistry;
  ewiRows: DatabaseRow[];
}

interface DatedRow {
  row: DatabaseRow;
  date: Date;
  originalIndex: number;
}

export class LiquiditySnapshotAdapter {
  public build(context: LiquiditySnapshotContext): PrismModuleSnapshot {
    const metrics =
      context.registry.getMetrics("Liquidity");

    const thresholds =
      context.registry.getThresholds("Liquidity");

    const statuses =
      context.registry.getStatuses("Liquidity");

    const narratives =
      context.registry.getNarratives("Liquidity");

    const reportingRows =
      this.getReportingRows(context.ewiRows);

    const latestEntry =
      reportingRows.at(-1);

    const previousDayEntry =
      reportingRows.at(-2);

    const previousEomEntry =
      latestEntry
        ? this.getPreviousMonthEndRow(
            reportingRows,
            latestEntry.date
          )
        : undefined;

    const latestRow =
      latestEntry?.row ?? {};

    const previousDayRow =
      previousDayEntry?.row ?? {};

    const previousEomRow =
      previousEomEntry?.row ?? {};

    return {
      executive:
        this.pickFields(
          latestRow,
          metrics
        ),

      summary: {
        latest:
          this.pickFields(
            latestRow,
            metrics
          ),

        previousDay:
          this.pickFields(
            previousDayRow,
            metrics
          ),

        previousEom:
          this.pickFields(
            previousEomRow,
            metrics
          ),

        dates: {
          latest:
            this.formatDate(
              latestEntry?.date
            ),

          previousDay:
            this.formatDate(
              previousDayEntry?.date
            ),

          previousEom:
            this.formatDate(
              previousEomEntry?.date
            ),
        },
      },

      analytics: {
        history: context.ewiRows,
      },

      earlyWarning: {
        thresholds:
          this.pickFields(
            latestRow,
            thresholds
          ),

        statuses:
          this.pickFields(
            latestRow,
            statuses
          ),
      },

      narratives:
        this.pickFields(
          latestRow,
          narratives
        ),
    };
  }

  private pickFields(
    row: DatabaseRow,
    fields: Array<{ header: string }>
  ): Record<string, unknown> {
    const normalizedRow =
      this.normalizeRecord(row);

    const result:
      Record<string, unknown> = {};

    for (const field of fields) {
      const normalizedHeader =
        this.normalizeKey(
          field.header
        );

      if (
        normalizedHeader in
        normalizedRow
      ) {
        /*
         * Keep the schema header as output key.
         * This ensures mapper keys remain aligned
         * with the schema definition.
         */
        result[field.header] =
          normalizedRow[
            normalizedHeader
          ];
      }
    }

    return result;
  }

  private getReportingRows(
    rows: DatabaseRow[]
  ): DatedRow[] {
    return rows
      .map(
        (
          row,
          originalIndex
        ): DatedRow | null => {
          if (!this.hasValue(row)) {
            return null;
          }

          const date =
            this.getRowDate(row);

          if (!date) {
            return null;
          }

          return {
            row,
            date,
            originalIndex,
          };
        }
      )
      .filter(
        (
          entry
        ): entry is DatedRow =>
          entry !== null
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

  private getPreviousMonthEndRow(
    rows: DatedRow[],
    latestDate: Date
  ): DatedRow | undefined {
    const latestYear =
      latestDate.getFullYear();

    const latestMonth =
      latestDate.getMonth();

    const previousMonthRows =
      rows.filter((entry) => {
        const year =
          entry.date.getFullYear();

        const month =
          entry.date.getMonth();

        return (
          year < latestYear ||
          (
            year === latestYear &&
            month < latestMonth
          )
        );
      });

    return previousMonthRows.at(-1);
  }

  private getRowDate(
    row: DatabaseRow
  ): Date | null {
    const normalizedRow =
      this.normalizeRecord(row);

    const rawDate =
      normalizedRow.date ??
      normalizedRow.reporting_date ??
      normalizedRow.report_date ??
      normalizedRow.snapshot_date ??
      normalizedRow.tanggal;

    return this.parseDate(rawDate);
  }

  private parseDate(
    value: unknown
  ): Date | null {
    if (value instanceof Date) {
      return Number.isNaN(
        value.getTime()
      )
        ? null
        : value;
    }

    if (
      typeof value === "number"
    ) {
      const excelEpoch =
        Date.UTC(
          1899,
          11,
          30
        );

      const parsedDate =
        new Date(
          excelEpoch +
            value *
              24 *
              60 *
              60 *
              1000
        );

      return Number.isNaN(
        parsedDate.getTime()
      )
        ? null
        : parsedDate;
    }

    if (
      typeof value !== "string"
    ) {
      return null;
    }

    const trimmed =
      value.trim();

    if (!trimmed) {
      return null;
    }

    /*
     * Supports:
     * DD/MM/YYYY
     * DD-MM-YYYY
     */
    const dayFirstMatch =
      trimmed.match(
        /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
      );

    if (dayFirstMatch) {
      const [
        ,
        day,
        month,
        year,
      ] = dayFirstMatch;

      const parsedDate =
        new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );

      return Number.isNaN(
        parsedDate.getTime()
      )
        ? null
        : parsedDate;
    }

    const parsedDate =
      new Date(trimmed);

    return Number.isNaN(
      parsedDate.getTime()
    )
      ? null
      : parsedDate;
  }

  private hasValue(
    row: DatabaseRow
  ): boolean {
    return Object.values(
      row
    ).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    );
  }

  private normalizeRecord(
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
          this.normalizeKey(key)
        ] = value;

        return result;
      },
      {}
    );
  }

  private normalizeKey(
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

  private formatDate(
    date: Date | undefined
  ): string | null {
    if (!date) {
      return null;
    }

    return date.toISOString().slice(
      0,
      10
    );
  }
}