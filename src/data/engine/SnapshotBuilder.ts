import type {PrismSnapshot,} from "../../types/prism";
import type { DatabaseRow } from "../database/DatabaseReader";
import { SchemaRegistry } from "../registry/SchemaRegistry";
import type { SemanticType } from "../schema/types";
import { CreditSnapshotAdapter } from "../adapters/CreditSnapshotAdapter";
import { LiquiditySnapshotAdapter } from "../adapters/LiquiditySnapshotAdapter";
import { TreasurySnapshotAdapter } from "../adapters/TreasurySnapshotAdapter";
import { ProfitabilitySnapshotAdapter } from "../adapters/ProfitabilitySnapshotAdapter";
import { OperationalSnapshotAdapter } from "../adapters/OperationalSnapshotAdapter";
import { BalanceSheetSnapshotAdapter } from "../adapters/BalanceSheetSnapshotAdapter";
import { EarlyWarningSnapshotAdapter } from "../adapters/EarlyWarningSnapshotAdapter";
import { StressTestingSnapshotAdapter } from "../adapters/StressTestingSnapshotAdapter";

export interface SnapshotContext {
  registry: SchemaRegistry;
  ewi: DatabaseRow[];
  nim: DatabaseRow[];
  loan: DatabaseRow[];
  threshold: DatabaseRow[];
}

export class SnapshotBuilder {
  public build(context: SnapshotContext): PrismSnapshot {
    const latestData = this.getLatestData(context);

    return {
      version: 1,
      metadata: {
        databaseVersion: "1.0.0",
        schemaVersion: "1.0.0",
        //engineVersion: 1,
        snapshotDate: new Date(),
        generatedAt: new Date(),
      },

      modules: {
        credit: this.creditAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            loanRows: context.loan,
            thresholdRows: context.threshold,
            }),

        liquidity: this.liquidityAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            }),

        treasury: this.treasuryAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            }),

        profitability: this.profitabilityAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            }),

        operational: this.operationalAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            }),

        balanceSheet: this.balanceSheetAdapter.build({
            registry: context.registry,
            nimRows: context.nim,
            }),

        stressTesting: this.stressTestingAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            }),

        earlyWarningIndicators: this.earlyWarningAdapter.build({
            registry: context.registry,
            ewiRows: context.ewi,
            }),
      },

      dictionaries: {
        metrics: this.buildDictionary(context, latestData, "metric"),
        thresholds: this.buildDictionary(context, latestData, "threshold"),
        statuses: this.buildDictionary(context, latestData, "status"),
        narratives: this.buildDictionary(context, latestData, "narrative"),
      },
    };
  }

  private getLatestData(context: SnapshotContext): DatabaseRow {
    return {
      ...this.getLastValidRow(context.ewi),
      ...this.getLastValidRow(context.nim),
      ...this.getLastValidRow(context.loan),
    };
  }

  private getLastValidRow(rows: DatabaseRow[]): DatabaseRow {
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

  private buildDictionary(
    context: SnapshotContext,
    data: DatabaseRow,
    semanticType: SemanticType
  ): Record<string, unknown> {
    const dictionary: Record<string, unknown> = {};

    const fields = context.registry.find({
      semanticType,
    });

    for (const field of fields) {
      if (field.header in data) {
        dictionary[field.header] = data[field.header];
      }
    }

    return dictionary;
  }

   private readonly creditAdapter = new CreditSnapshotAdapter();

  private readonly liquidityAdapter = new LiquiditySnapshotAdapter();

  private readonly treasuryAdapter = new TreasurySnapshotAdapter();

  private readonly profitabilityAdapter = new ProfitabilitySnapshotAdapter();

  private readonly operationalAdapter = new OperationalSnapshotAdapter();

  private readonly balanceSheetAdapter = new BalanceSheetSnapshotAdapter();

  private readonly earlyWarningAdapter = new EarlyWarningSnapshotAdapter();

  private readonly stressTestingAdapter = new StressTestingSnapshotAdapter();

    
}