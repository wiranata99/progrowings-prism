import type { PrismSnapshot } from "../../types/prism";
import type { DatabaseRow } from "../database/DatabaseReader";

export interface SnapshotSource {
  ewi: DatabaseRow[];
  nim: DatabaseRow[];
  loan: DatabaseRow[];
}

export class SnapshotBuilder {
  public build(source: SnapshotSource): PrismSnapshot {
    return {
      metadata: {
        databaseVersion: "1.0.0",
        schemaVersion: "1.0.0",
        snapshotDate: new Date(),
        generatedAt: new Date(),
      },

      credit: {
        source: source.loan,
      },

      liquidity: {
        source: source.ewi,
      },

      treasury: {
        source: source.ewi,
      },

      profitability: {
        source: source.ewi,
      },

      balanceSheet: {
        source: source.nim,
      },

      earlyWarning: {
        source: source.ewi,
      },
    };
  }
}