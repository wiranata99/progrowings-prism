export interface PrismMetadata {
  databaseVersion: string;
  schemaVersion: string;
  snapshotDate: Date;
  generatedAt: Date;
}

export interface PrismSnapshot {
  metadata: PrismMetadata;

  credit: Record<string, unknown>;
  liquidity: Record<string, unknown>;
  treasury: Record<string, unknown>;
  profitability: Record<string, unknown>;
  balanceSheet: Record<string, unknown>;
  earlyWarning: Record<string, unknown>;
}