import type {
  PrismModuleSnapshot,
  PrismModules,
} from "../../types/prism";

type GenericRecord = Record<string, unknown>;

type ModuleName =
  | "credit"
  | "liquidity"
  | "treasury"
  | "profitability"
  | "operational";

type CompositeRiskLevel =
  | "Within Limit"
  | "Watch"
  | "Heightened Risk"
  | "Outside Appetite";

type ModuleRiskStatus =
  | "Healthy"
  | "Watch"
  | "Warning"
  | "Critical";

export interface ExecutiveHeaderViewModel {
  reportingDate: string;
  lastRefresh: string;
  portfolio: string;
  riskAppetite: CompositeRiskLevel;
  riskAppetiteClassName: string;
}

const MONITORED_MODULES: ModuleName[] = [
  "credit",
  "liquidity",
  "treasury",
  "profitability",
  "operational",
];

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRecord(
  record: GenericRecord
): GenericRecord {
  return Object.entries(record).reduce<GenericRecord>(
    (result, [key, value]) => {
      result[normalizeKey(key)] = value;
      return result;
    },
    {}
  );
}

function toNumber(value: unknown): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .replace(/^rp/i, "")
    .replace(/%$/, "");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    const excelEpoch = Date.UTC(1899, 11, 30);

    const parsed = new Date(
      excelEpoch + value * 86_400_000
    );

    return Number.isNaN(parsed.getTime())
      ? null
      : parsed;
  }

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  const trimmed = value.trim();

  const parsed = new Date(trimmed);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
}

function isDateField(key: string): boolean {
  const normalized = normalizeKey(key);

  return (
    normalized === "date" ||
    normalized === "reporting_date" ||
    normalized === "reportingdate" ||
    normalized === "as_of_date" ||
    normalized === "asofdate" ||
    normalized === "snapshot_date" ||
    normalized === "snapshotdate"
  );
}

function collectDatabaseDates(
  value: unknown,
  parentKey = ""
): Date[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      collectDatabaseDates(item, parentKey)
    );
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    if (!isDateField(parentKey)) {
      return [];
    }

    const date = parseDate(value);

    return date ? [date] : [];
  }

  return Object.entries(
    value as GenericRecord
  ).flatMap(([key, nestedValue]) => {
    if (isDateField(key)) {
      const date = parseDate(nestedValue);

      return date ? [date] : [];
    }

    if (
      nestedValue &&
      typeof nestedValue === "object"
    ) {
      return collectDatabaseDates(
        nestedValue,
        key
      );
    }

    return [];
  });
}

function getLatestDatabaseDate(
  modules: PrismModules
): Date | null {
  const dates = MONITORED_MODULES.flatMap(
    (moduleName) =>
      collectDatabaseDates(
        modules[moduleName]
      )
  );

  if (dates.length === 0) {
    return null;
  }

  return dates.reduce(
    (latest, current) =>
      current.getTime() > latest.getTime()
        ? current
        : latest
  );
}

function formatReportingDate(
  date: Date | null
): string {
  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getNimHistory(
  profitability: PrismModuleSnapshot
): GenericRecord[] {
  const analytics =
    profitability.analytics as GenericRecord;

  const nim =
    analytics.nim as GenericRecord | undefined;

  if (!nim || !Array.isArray(nim.history)) {
    return [];
  }

  return nim.history.filter(
    (row): row is GenericRecord =>
      Boolean(row) &&
      typeof row === "object" &&
      !Array.isArray(row)
  );
}

function getLatestTotalAssets(
  profitability: PrismModuleSnapshot
): number | null {
  const candidates = getNimHistory(
    profitability
  )
    .map((row, index) => {
      const normalized =
        normalizeRecord(row);

      const notes = String(
        normalized.notes ?? ""
      )
        .trim()
        .toLowerCase();

      const date = parseDate(
        normalized.date
      );

      const totalAssets = toNumber(
        normalized.total_assets
      );

      return {
        index,
        notes,
        date,
        totalAssets,
      };
    })
    .filter(
      (entry) =>
        entry.date !== null &&
        entry.totalAssets !== null &&
        (
          entry.notes === "os" ||
          entry.notes === "outstanding" ||
          entry.notes === ""
        )
    )
    .sort((a, b) => {
      const dateDifference =
        (a.date as Date).getTime() -
        (b.date as Date).getTime();

      return dateDifference !== 0
        ? dateDifference
        : a.index - b.index;
    });

  return candidates.at(-1)?.totalAssets ?? null;
}

function formatPortfolio(
  value: number | null
): string {
  if (value === null) {
    return "-";
  }

  /*
   * DB_NIM saat ini menggunakan satuan Rp juta:
   * 1,000,000 = Rp1 Trillion.
   */
  const trillion = value / 1_000_000;

  return `Rp${trillion.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }
  )} Trillion`;
}

function normalizeStatus(
  value: unknown
): ModuleRiskStatus | null {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "healthy" ||
    normalized === "within limit" ||
    normalized === "within appetite" ||
    normalized === "low"
  ) {
    return "Healthy";
  }

  if (
    normalized === "watch" ||
    normalized === "monitor" ||
    normalized === "adequate" ||
    normalized === "moderate"
  ) {
    return "Watch";
  }

  if (
    normalized === "warning" ||
    normalized === "heightened" ||
    normalized === "pressured"
  ) {
    return "Warning";
  }

  if (
    normalized === "critical" ||
    normalized === "outside appetite" ||
    normalized === "breach" ||
    normalized === "high"
  ) {
    return "Critical";
  }

  return null;
}

function collectStatuses(
  value: unknown,
  parentKey = ""
): ModuleRiskStatus[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      collectStatuses(item, parentKey)
    );
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    const normalizedKey =
      normalizeKey(parentKey);

    const isStatusField =
      normalizedKey === "status" ||
      normalizedKey.endsWith("_status") ||
      normalizedKey === "risk_level" ||
      normalizedKey === "risk_status" ||
      normalizedKey === "assessment";

    if (!isStatusField) {
      return [];
    }

    const status = normalizeStatus(value);

    return status ? [status] : [];
  }

  return Object.entries(
    value as GenericRecord
  ).flatMap(([key, nestedValue]) =>
    collectStatuses(nestedValue, key)
  );
}

function getModuleRiskStatus(
  module: PrismModuleSnapshot
): ModuleRiskStatus {
  const executiveStatuses =
    collectStatuses(module.executive);

  const summaryStatuses =
    collectStatuses(module.summary);

  const statuses = [
    ...executiveStatuses,
    ...summaryStatuses,
  ];

  if (statuses.includes("Critical")) {
    return "Critical";
  }

  if (statuses.includes("Warning")) {
    return "Warning";
  }

  if (statuses.includes("Watch")) {
    return "Watch";
  }

  return "Healthy";
}

function calculateCompositeRisk(
  modules: PrismModules
): {
  level: CompositeRiskLevel;
  className: string;
} {
  const statuses = MONITORED_MODULES.map(
    (moduleName) =>
      getModuleRiskStatus(
        modules[moduleName]
      )
  );

  const criticalCount = statuses.filter(
    (status) => status === "Critical"
  ).length;

  const warningCount = statuses.filter(
    (status) => status === "Warning"
  ).length;

  const watchCount = statuses.filter(
    (status) => status === "Watch"
  ).length;

  if (criticalCount > 0) {
    return {
      level: "Outside Appetite",
      className: "text-rose-400",
    };
  }

  if (
    warningCount >= 2 ||
    (
      warningCount === 1 &&
      watchCount >= 1
    )
  ) {
    return {
      level: "Heightened Risk",
      className: "text-orange-400",
    };
  }

  if (
    warningCount === 1 ||
    watchCount >= 2
  ) {
    return {
      level: "Watch",
      className: "text-amber-400",
    };
  }

  return {
    level: "Within Limit",
    className: "text-emerald-400",
  };
}

export function mapExecutiveHeader(
  modules: PrismModules
): ExecutiveHeaderViewModel {
  const reportingDate =
    getLatestDatabaseDate(modules);

  const totalAssets =
    getLatestTotalAssets(
      modules.profitability
    );

  const compositeRisk =
    calculateCompositeRisk(modules);

  return {
    reportingDate:
      formatReportingDate(reportingDate),

    lastRefresh: "08:00 WIB",

    portfolio:
      formatPortfolio(totalAssets),

    riskAppetite:
      compositeRisk.level,

    riskAppetiteClassName:
      compositeRisk.className,
  };
}