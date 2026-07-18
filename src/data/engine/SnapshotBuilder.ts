import type {
  PrismModuleSnapshot,
  PrismSnapshot,
} from "../../types/prism";
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

      modules: {
        credit: this.createModule({
          analytics: {
            source: source.loan,
          },
        }),

        liquidity: this.createModule({
          analytics: {
            source: source.ewi,
          },
        }),

        treasury: this.createModule({
          analytics: {
            source: source.ewi,
          },
        }),

        profitability: this.createModule({
          analytics: {
            source: source.ewi,
          },
        }),

        operational: this.createModule(),

        balanceSheet: this.createModule({
          analytics: {
            source: source.nim,
          },
        }),

        stressTesting: this.createModule(),

        earlyWarningIndicators: this.createModule({
          analytics: {
            source: source.ewi,
          },
        }),
      },

      dictionaries: {
        metrics: {},
        thresholds: {},
        statuses: {},
        narratives: {},
      },
    };
  }

  private createModule(
    overrides: Partial<PrismModuleSnapshot> = {}
  ): PrismModuleSnapshot {
    return {
      executive: {},
      summary: {},
      analytics: {},
      earlyWarning: {},
      narratives: {},
      ...overrides,
    };
  }
}