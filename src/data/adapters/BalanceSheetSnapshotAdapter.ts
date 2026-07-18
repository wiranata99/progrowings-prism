import type { PrismModuleSnapshot } from "../../types/prism";
import type { DatabaseRow } from "../database/DatabaseReader";
import type { SchemaRegistry } from "../registry/SchemaRegistry";

export interface BalanceSheetSnapshotContext {
  registry: SchemaRegistry;
  nimRows: DatabaseRow[];
}

export class BalanceSheetSnapshotAdapter {
  public build(
    context: BalanceSheetSnapshotContext
  ): PrismModuleSnapshot {
    const latestRow = this.getLatestRow(context.nimRows);

    const metrics = context.registry.getMetrics("Balance Sheet");
    const thresholds = context.registry.getThresholds("Balance Sheet");
    const statuses = context.registry.getStatuses("Balance Sheet");
    const narratives = context.registry.getNarratives("Balance Sheet");

    return {
      executive: this.pickFields(latestRow, metrics),

      summary: {
        latest: this.pickFields(latestRow, metrics),
      },

      analytics: {
        history: context.nimRows,
      },

      earlyWarning: {
        thresholds: this.pickFields(latestRow, thresholds),
        statuses: this.pickFields(latestRow, statuses),
      },

      narratives: this.pickFields(latestRow, narratives),
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