import type { PrismModuleSnapshot } from "../../types/prism";

type DriverAssessment = "Positive" | "Monitor" | "Negative" | "Unavailable";
type DataAvailability = "READY" | "PARTIAL" | "UNAVAILABLE";

interface RawRow extends Record<string, unknown> {}

interface DatedRow {
  row: RawRow;
  date: Date;
}

export interface StrategicIntelligenceCard {
  key: string;
  title: string;
  value: string;
  details?: string[];
  change: string;
  assessment: DriverAssessment;
}

export interface StrategicIntelligenceDriver {
  key: string;
  factor: string;
  trend: string;
  impact: string;
  assessment: DriverAssessment;
}

export interface StrategicIntelligenceViewModel {
  availability: DataAvailability;
  reportingDate: string;
  executiveAssessment: string;
  cards: StrategicIntelligenceCard[];
  drivers: StrategicIntelligenceDriver[];
  conclusion: string;
}

interface MetricResult {
  latest: number | null;
  previous: number | null;
  changePercent: number | null;
  changeAbsolute: number | null;
}

interface MetricWithDate {
  result: MetricResult;
  latestDate: Date | null;
}

const EMPTY_VIEW_MODEL: StrategicIntelligenceViewModel = {
  availability: "UNAVAILABLE",
  reportingDate: "-",
  executiveAssessment: "Waiting for profitability data",
  cards: [],
  drivers: [],
  conclusion:
    "Strategic intelligence is not available because DB_NIM and DB_IS data have not been loaded.",
};

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRow(row: RawRow): RawRow {
  return Object.entries(row).reduce<RawRow>((result, [key, value]) => {
    result[normalizeKey(key)] = value;
    return result;
  }, {});
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/,/g, "").replace(/%/g, "").trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const parsed = new Date(Date.UTC(1899, 11, 30) + value * 86_400_000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDatedRows(rows: unknown[]): DatedRow[] {
  return rows
    .filter((row): row is RawRow => Boolean(row) && typeof row === "object")
    .map((row) => {
      const normalized = normalizeRow(row);
      const date = parseDate(normalized.date);
      return date ? { row: normalized, date } : null;
    })
    .filter((entry): entry is DatedRow => entry !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getHistory(
  profitability: PrismModuleSnapshot | undefined,
  section: "nim" | "incomeStatement"
): unknown[] {
  const analytics = profitability?.analytics as Record<string, unknown> | undefined;
  const sectionData = analytics?.[section];

  if (!sectionData || typeof sectionData !== "object") {
    return [];
  }

  const history = (sectionData as Record<string, unknown>).history;
  return Array.isArray(history) ? history : [];
}

function getPreviousEom(rows: DatedRow[], latestDate: Date): DatedRow | undefined {
  return rows
    .filter(
      (entry) =>
        entry.date.getFullYear() < latestDate.getFullYear() ||
        (entry.date.getFullYear() === latestDate.getFullYear() &&
          entry.date.getMonth() < latestDate.getMonth())
    )
    .at(-1);
}

function getValue(row: RawRow | undefined, header: string): number | null {
  if (!row) {
    return null;
  }

  return toNumber(row[normalizeKey(header)]);
}

function sumValues(
  row: RawRow | undefined,
  headers: readonly string[]
): number | null {
  if (!row) {
    return null;
  }

  const values = headers.map((header) => getValue(row, header));
  return values.some((value) => value === null)
    ? null
    : values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function calculateChange(
  latest: number | null,
  previous: number | null
): MetricResult {
  if (latest === null || previous === null) {
    return {
      latest,
      previous,
      changePercent: null,
      changeAbsolute: null,
    };
  }

  return {
    latest,
    previous,
    changePercent:
      previous === 0 ? null : ((latest - previous) / Math.abs(previous)) * 100,
    changeAbsolute: latest - previous,
  };
}

function getNimMetric(
  rows: DatedRow[],
  note: "OS" | "Rate",
  headers: readonly string[]
): MetricWithDate {
  const filtered = rows.filter(
    (entry) =>
      String(entry.row.notes ?? "").trim().toLowerCase() === note.toLowerCase()
  );

  const latest = filtered.at(-1);
  const previous = latest ? getPreviousEom(filtered, latest.date) : undefined;

  return {
    result: calculateChange(
      sumValues(latest?.row, headers),
      sumValues(previous?.row, headers)
    ),
    latestDate: latest?.date ?? null,
  };
}

function getIncomeMetric(rows: DatedRow[], header: string): MetricWithDate {
  const latest = rows.at(-1);
  const previous = latest ? getPreviousEom(rows, latest.date) : undefined;

  return {
    result: calculateChange(
      getValue(latest?.row, header),
      getValue(previous?.row, header)
    ),
    latestDate: latest?.date ?? null,
  };
}

function formatPercent(value: number | null): string {
  return value === null ? "-" : `${(value * 100).toFixed(2)}%`;
}

function formatGrowthValue(value: number | null): string {
  if (value === null) {
    return "-";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatGrowth(value: number | null): string {
  if (value === null) {
    return "Previous EOM unavailable";
  }

  return `${formatGrowthValue(value)} vs previous EOM`;
}

function formatBasisPointChange(value: number | null): string {
  if (value === null) {
    return "Previous EOM unavailable";
  }

  const basisPoints = value * 10_000;
  const sign = basisPoints > 0 ? "+" : "";
  return `${sign}${basisPoints.toFixed(0)} bps vs previous EOM`;
}

function formatAmount(value: number | null): string {
  if (value === null) {
    return "-";
  }

  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(2)} T`;
  }

  if (absolute >= 1_000) {
    return `Rp${(value / 1_000).toFixed(2)} Bio`;
  }

  return `Rp${value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })} Mio`;
}

function assessGrowth(change: number | null): DriverAssessment {
  if (change === null) return "Unavailable";
  if (change > 0.5) return "Positive";
  if (change >= -0.5) return "Monitor";
  return "Negative";
}

function assessRate(
  change: number | null,
  lowerIsBetter: boolean
): DriverAssessment {
  if (change === null) return "Unavailable";

  const basisPoints = change * 10_000;
  if (Math.abs(basisPoints) < 5) return "Monitor";

  const favourable = lowerIsBetter ? basisPoints < 0 : basisPoints > 0;
  return favourable ? "Positive" : "Negative";
}

function buildTrend(
  result: MetricResult,
  assessment: DriverAssessment,
  rateMetric = false
): string {
  if (result.changeAbsolute === null) {
    return "• Data unavailable";
  }

  const direction =
    result.changeAbsolute > 0 ? "▲" : result.changeAbsolute < 0 ? "▼" : "•";
  const label =
    assessment === "Positive"
      ? "Favourable"
      : assessment === "Negative"
        ? "Adverse"
        : "Stable";

  return rateMetric
    ? `${direction} ${label} (${formatBasisPointChange(result.changeAbsolute)})`
    : `${direction} ${label} (${formatGrowth(result.changePercent)})`;
}

function formatDate(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "-";
}

function buildConclusion(
  assessments: DriverAssessment[],
  availability: DataAvailability
): string {
  if (availability === "UNAVAILABLE") {
    return EMPTY_VIEW_MODEL.conclusion;
  }

  const positive = assessments.filter((value) => value === "Positive").length;
  const negative = assessments.filter((value) => value === "Negative").length;

  if (negative >= 3) {
    return "Profitability momentum is under pressure. Management should protect margin through disciplined asset pricing, stronger low-cost funding mobilisation, and tighter control over adverse earnings drivers.";
  }

  if (positive >= 4 && negative === 0) {
    return "Profitability momentum remains resilient, supported by favourable business growth, asset yield, funding dynamics, and net profit development. Management should preserve pricing discipline and sustain low-cost funding growth.";
  }

  return "Profitability remains broadly stable but the driver mix is uneven. Management should strengthen loan and deposit growth while monitoring asset yield, deposit expense, overall funding cost, and net profit delivery.";
}

export function mapStrategicIntelligence(
  profitability: PrismModuleSnapshot | undefined
): StrategicIntelligenceViewModel {
  if (!profitability) {
    return EMPTY_VIEW_MODEL;
  }

  const nimRows = getDatedRows(getHistory(profitability, "nim"));
  const incomeRows = getDatedRows(
    getHistory(profitability, "incomeStatement")
  );

  const loanGrowth = getNimMetric(nimRows, "OS", ["Total Loans"]);
  const corporateLoanGrowth = getNimMetric(nimRows, "OS", [
    "Productive/Corporate Loans",
  ]);
  const consumerLoanGrowth = getNimMetric(nimRows, "OS", [
    "Consumptive Loans",
  ]);

  const loanYield = getNimMetric(nimRows, "Rate", ["Total Loans"]);
  const corporateLoanYield = getNimMetric(nimRows, "Rate", [
    "Productive/Corporate Loans",
  ]);
  const consumerLoanYield = getNimMetric(nimRows, "Rate", [
    "Consumptive Loans",
  ]);

  const depositGrowth = getNimMetric(nimRows, "OS", ["Deposit"]);
  const casaGrowth = getNimMetric(nimRows, "OS", [
    "Current Deposits",
    "Saving Deposits",
  ]);
  const tdidGrowth = getNimMetric(nimRows, "OS", [
    "Installment Deposits",
    "Time Deposits",
  ]);

  const depositExpense = getNimMetric(nimRows, "Rate", ["Deposit"]);
  const currentAccountExpense = getNimMetric(nimRows, "Rate", [
    "Current Deposits",
  ]);
  const savingAccountExpense = getNimMetric(nimRows, "Rate", [
    "Saving Deposits",
  ]);
  const timeDepositExpense = getNimMetric(nimRows, "Rate", ["Time Deposits"]);

  const fundingCostExCapital = getNimMetric(nimRows, "Rate", [
    "Interest Bearing Liability",
  ]);
  const fundingCostIncludeCapital = getNimMetric(nimRows, "Rate", [
    "TOTAL LIABILITIES + CAPITAL",
  ]);

  const netProfit = getIncomeMetric(incomeRows, "NET PROFIT");
  const ebt = getIncomeMetric(incomeRows, "EBT");

  const loanGrowthAssessment = assessGrowth(loanGrowth.result.changePercent);
  const loanYieldAssessment = assessRate(
    loanYield.result.changeAbsolute,
    false
  );
  const depositGrowthAssessment = assessGrowth(
    depositGrowth.result.changePercent
  );
  const depositExpenseAssessment = assessRate(
    depositExpense.result.changeAbsolute,
    true
  );
  const fundingCostAssessment = assessRate(
    fundingCostExCapital.result.changeAbsolute,
    true
  );
  const profitAssessment = assessGrowth(netProfit.result.changePercent);

  const cards: StrategicIntelligenceCard[] = [
    {
      key: "loanGrowth",
      title: "Loan Growth",
      value: formatGrowthValue(loanGrowth.result.changePercent),
      details: [
        `Corporate ${formatGrowthValue(corporateLoanGrowth.result.changePercent)}`,
        `Consumer ${formatGrowthValue(consumerLoanGrowth.result.changePercent)}`,
      ],
      change: formatGrowth(loanGrowth.result.changePercent),
      assessment: loanGrowthAssessment,
    },
    {
      key: "loanYield",
      title: "Loan Yield",
      value: formatPercent(loanYield.result.latest),
      details: [
        `Corporate ${formatPercent(corporateLoanYield.result.latest)}`,
        `Consumer ${formatPercent(consumerLoanYield.result.latest)}`,
      ],
      change: formatBasisPointChange(loanYield.result.changeAbsolute),
      assessment: loanYieldAssessment,
    },
    {
      key: "depositGrowth",
      title: "Deposit Growth",
      value: formatGrowthValue(depositGrowth.result.changePercent),
      details: [
        `CASA ${formatGrowthValue(casaGrowth.result.changePercent)}`,
        `TDID ${formatGrowthValue(tdidGrowth.result.changePercent)}`,
      ],
      change: formatGrowth(depositGrowth.result.changePercent),
      assessment: depositGrowthAssessment,
    },
    {
      key: "depositExpense",
      title: "Deposit Expense",
      value: formatPercent(depositExpense.result.latest),
      details: [
        `CA ${formatPercent(currentAccountExpense.result.latest)}`,
        `SA ${formatPercent(savingAccountExpense.result.latest)}`,
        `TD ${formatPercent(timeDepositExpense.result.latest)}`,
      ],
      change: formatBasisPointChange(depositExpense.result.changeAbsolute),
      assessment: depositExpenseAssessment,
    },
    {
      key: "fundingCostExCapital",
      title: "Funding Cost (Exclude Capital)",
      value: formatPercent(fundingCostExCapital.result.latest),
      details: [
        `Include Capital ${formatPercent(fundingCostIncludeCapital.result.latest)}`,
      ],
      change: formatBasisPointChange(
        fundingCostExCapital.result.changeAbsolute
      ),
      assessment: fundingCostAssessment,
    },
    {
      key: "netProfit",
      title: "Net Profit",
      value: formatAmount(netProfit.result.latest),
      details: [`EBT ${formatAmount(ebt.result.latest)}`],
      change: formatGrowth(netProfit.result.changePercent),
      assessment: profitAssessment,
    },
  ];

  const drivers: StrategicIntelligenceDriver[] = [
    {
      key: "loanGrowth",
      factor: "Loan Growth",
      trend: buildTrend(loanGrowth.result, loanGrowthAssessment),
      impact:
        loanGrowthAssessment === "Positive"
          ? "Growth in earning assets supports interest income and earnings capacity."
          : "Weak or declining loan momentum may limit interest income growth.",
      assessment: loanGrowthAssessment,
    },
    {
      key: "loanYield",
      factor: "Loan Yield",
      trend: buildTrend(loanYield.result, loanYieldAssessment, true),
      impact:
        loanYieldAssessment === "Positive"
          ? "Improving loan yield supports asset-side margin and recurring interest income."
          : "Lower loan yield may compress margin unless offset by cheaper funding or stronger volume.",
      assessment: loanYieldAssessment,
    },
    {
      key: "depositGrowth",
      factor: "Deposit Growth",
      trend: buildTrend(depositGrowth.result, depositGrowthAssessment),
      impact:
        depositGrowthAssessment === "Positive"
          ? "Deposit growth strengthens funding capacity and supports balance-sheet expansion."
          : "Weak deposit momentum may constrain lending capacity or increase wholesale funding reliance.",
      assessment: depositGrowthAssessment,
    },
    {
      key: "depositExpense",
      factor: "Deposit Expense",
      trend: buildTrend(
        depositExpense.result,
        depositExpenseAssessment,
        true
      ),
      impact:
        depositExpenseAssessment === "Positive"
          ? "Lower deposit expense supports funding efficiency and margin resilience."
          : "Higher deposit expense creates direct pressure on net interest margin.",
      assessment: depositExpenseAssessment,
    },
    {
      key: "fundingCostExCapital",
      factor: "Funding Cost (Exclude Capital)",
      trend: buildTrend(
        fundingCostExCapital.result,
        fundingCostAssessment,
        true
      ),
      impact:
        fundingCostAssessment === "Positive"
          ? "Lower interest-bearing funding cost improves spread and core earnings quality."
          : "Higher funding cost requires stronger pricing discipline and funding-mix optimisation.",
      assessment: fundingCostAssessment,
    },
    {
      key: "netProfit",
      factor: "Net Profit",
      trend: buildTrend(netProfit.result, profitAssessment),
      impact:
        profitAssessment === "Positive"
          ? "Positive net profit momentum strengthens capital generation and shareholder value."
          : "Weak net profit momentum indicates pressure across income, cost, or provisioning drivers.",
      assessment: profitAssessment,
    },
  ];

  const availableCount = cards.filter(
    (card) => card.assessment !== "Unavailable"
  ).length;
  const availability: DataAvailability =
    availableCount === cards.length
      ? "READY"
      : availableCount > 0
        ? "PARTIAL"
        : "UNAVAILABLE";

  const assessments = cards.map((card) => card.assessment);
  const positiveCount = assessments.filter(
    (value) => value === "Positive"
  ).length;
  const negativeCount = assessments.filter(
    (value) => value === "Negative"
  ).length;

  const executiveAssessment =
    availability === "PARTIAL"
      ? "Partial Data"
      : negativeCount >= 3
        ? "Management Attention"
        : positiveCount >= 4
          ? "Positive Outlook"
          : "Balanced Outlook";

  const latestDate = [
    loanGrowth.latestDate,
    loanYield.latestDate,
    depositGrowth.latestDate,
    depositExpense.latestDate,
    fundingCostExCapital.latestDate,
    netProfit.latestDate,
  ]
    .filter((date): date is Date => date !== null)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

  return {
    availability,
    reportingDate: formatDate(latestDate),
    executiveAssessment,
    cards,
    drivers,
    conclusion: buildConclusion(assessments, availability),
  };
}