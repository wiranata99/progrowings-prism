export interface PrismMetadata {
  databaseVersion: string;
  schemaVersion: string;
  snapshotDate: Date;
  generatedAt: Date;
}

export type PrismModuleSection = Record<string, unknown>;

export interface PrismModuleSnapshot {
  executive: PrismModuleSection;
  summary: PrismModuleSection;
  analytics: PrismModuleSection;
  earlyWarning: PrismModuleSection;
  narratives: PrismModuleSection;
}

export interface PrismModules {
  credit: PrismModuleSnapshot;
  liquidity: PrismModuleSnapshot;
  treasury: PrismModuleSnapshot;
  profitability: PrismModuleSnapshot;
  operational: PrismModuleSnapshot;
  balanceSheet: PrismModuleSnapshot;
  stressTesting: PrismModuleSnapshot;
  earlyWarningIndicators: PrismModuleSnapshot;
}

export interface PrismDictionaries {
  metrics: Record<string, unknown>;
  thresholds: Record<string, unknown>;
  statuses: Record<string, unknown>;
  narratives: Record<string, unknown>;
}

export interface PrismSnapshot {
  metadata: PrismMetadata;
  modules: PrismModules;
  dictionaries: PrismDictionaries;
}