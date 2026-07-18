import type { PrismModuleSnapshot } from "../../types/prism";
import type { DatabaseRow } from "../database/DatabaseReader";
import type { SchemaRegistry } from "../registry/SchemaRegistry";

export interface CreditSnapshotContext {
  registry: SchemaRegistry;
  ewiRows: DatabaseRow[];
  loanRows: DatabaseRow[];
}

export class CreditSnapshotAdapter {
  public build(context: CreditSnapshotContext): PrismModuleSnapshot {
    const latestEwi = this.getLatestRow(context.ewiRows);
    const latestLoan = this.getLatestRow(context.loanRows);

    const metrics = context.registry.getMetrics("Credit");
    const thresholds = context.registry.getThresholds("Credit");
    const statuses = context.registry.getStatuses("Credit");
    const narratives = context.registry.getNarratives("Credit");

    return {
      executive: this.pickFields(latestEwi, metrics),
      summary: this.pickFields(latestLoan, metrics),

      analytics: {
        history: context.loanRows,
      },

      earlyWarning: {
        thresholds: this.pickFields(latestEwi, thresholds),
        statuses: this.pickFields(latestEwi, statuses),
      },

      narratives: this.pickFields(latestEwi, narratives),
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

  private getLatestRow(rows: DatabaseRow[]): DatabaseRow {
    for (let index = rows.length - 1; index >= 0; index -= 1) {
      const row = rows[index];

      const hasValue = Object.values(row).some(
        (value) => value !== null && value !== undefined && value !== ""
      );

      if (hasValue) {
        return row;
      }
    }

    return {};
  }
}