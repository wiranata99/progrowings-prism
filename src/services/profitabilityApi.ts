import { API_BASE_URL } from "../config/api";
import type { MetricStatus } from "../types/metric";
import type { ProfitabilityHealthScoreViewModel } from "../presentation/mappers/profitabilityHealthScoreMapper";
import type { IncomeStatementMovementViewModel } from "../presentation/mappers/incomeStatementMovementMapper";
import type { StrategicIntelligenceViewModel } from "../presentation/mappers/strategicIntelligenceMapper";
import type { ProfitabilityExecutiveViewModel } from "../presentation/mappers/profitabilityExecutiveMapper";

interface ApiResponse<T> { success: boolean; message: string; data: T; }
interface HealthResponse {
  reportingDate: string;
  metrics: Array<{ key: string; label: string; value: number; movement: number | null; target: number | null; status: MetricStatus; expenseMetric: boolean; }>;
}
interface MovementResponse {
  reportingDate: string;
  items: Array<{ key: string; label: string; expense: boolean; previousEom: number | null; latest: number | null; dtd: number | null; wtd: number | null; mtd: number | null; }>;
}
export interface ProfitabilityDriver { factor: string; impactBps: number; }
export interface ProfitabilityDriversViewModel { reportingDate: string; positive: ProfitabilityDriver[]; negative: ProfitabilityDriver[]; }
export interface ProfitabilityAlert { priority: "High" | "Medium" | "Low"; indicator: string; current: number; threshold: number; action: string; status: MetricStatus; }
export interface ProfitabilityEarlyWarningViewModel { reportingDate: string; alerts: ProfitabilityAlert[]; }
interface StrategicResponse { reportingDate: string; assessment: string; drivers: Array<{ code: string; value: number | null; movement: number | null; }>; conclusion: string; }
interface ExecutiveResponse { reportingDate: string; summary: string; attention: string[]; recommendations: string[]; assessment: string; status: string; }

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/intelligence/profitability/${path}`);
  if (!response.ok) throw new Error(`Failed to fetch Profitability ${path}: ${response.status}`);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) throw new Error(payload.message || `Failed to fetch Profitability ${path}.`);
  return payload.data;
}

function dateLabel(value: string, short = false) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB", short ? { day: "2-digit", month: "short" } : { day: "2-digit", month: "short", year: "numeric" });
}
function amount(value: number | null) { return value === null ? "-" : `Rp${(value / 1_000).toFixed(2)} T`; }
function signed(value: number | null, suffix = "") { if (value === null) return "-"; return `${value > 0 ? "+" : ""}${value.toFixed(2)}${suffix}`; }

export async function getProfitabilityHealthScore(): Promise<ProfitabilityHealthScoreViewModel> {
  const data = await get<HealthResponse>("health-score");
  return {
    reportingDate: dateLabel(data.reportingDate),
    lastEomDate: "30 Jun",
    metrics: data.metrics.map((metric) => ({
      key: metric.key,
      label: metric.label,
      value: metric.value / 100,
      currentValue: `${metric.value.toFixed(2)}%`,
      movement: metric.movement,
      movementLabel: signed(metric.movement, "%"),
      targetLabel: metric.target === null ? "-" : `${metric.expenseMetric ? "<" : ">"} ${metric.target.toFixed(2)}%`,
      lastEomValue: "-",
      status: metric.status,
      progress: Math.min(100, metric.status === "Healthy" ? 92 : metric.status === "Watch" ? 75 : metric.status === "Warning" ? 55 : 30),
      expenseMetric: metric.expenseMetric,
    })),
  };
}

export async function getProfitabilityMovement(): Promise<IncomeStatementMovementViewModel> {
  const data = await get<MovementResponse>("income-statement-movement");
  const value = (raw: number | null) => ({ raw, formatted: amount(raw) });
  return {
    reportingDate: dateLabel(data.reportingDate),
    latestDateLabel: dateLabel(data.reportingDate, true),
    previousEomDate: "30 Jun 2026",
    previousEoyDate: "-",
    weekStartDate: "24 Jul 2026",
    rows: data.items.map((item) => ({
      key: item.key.toLowerCase().replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
      label: item.label,
      kind: item.key === "NET_PROFIT" ? "total" : item.key.includes("INCOME") || item.key.includes("EXPENSE") ? "section" : "detail",
      indent: 0,
      values: { previousEoy: value(null), previousEom: value(item.previousEom), latest: value(item.latest), dtd: value(item.dtd), wtd: value(item.wtd), mtd: value(item.mtd) },
    })),
  };
}

const strategicLabels: Record<string, string> = { LOAN_GROWTH: "Loan Growth", ASSET_YIELD: "Asset Yield", CASA_GROWTH: "CASA Growth", COST_OF_FUND: "Cost of Fund", NET_PROFIT: "Net Profit" };
export async function getProfitabilityStrategic(): Promise<StrategicIntelligenceViewModel> {
  const data = await get<StrategicResponse>("strategic-intelligence");
  const cards = data.drivers.map((driver) => {
    const expense = driver.code === "COST_OF_FUND";
    const favourable = driver.movement === null ? "Unavailable" : expense ? driver.movement <= 0 : driver.movement >= 0;
    const assessment = favourable === "Unavailable" ? "Unavailable" : favourable ? "Positive" : "Negative";
    return { key: driver.code, title: strategicLabels[driver.code] ?? driver.code, value: driver.code === "NET_PROFIT" ? amount(driver.value) : driver.value === null ? "-" : `${driver.value.toFixed(2)}%`, change: signed(driver.movement, driver.code === "NET_PROFIT" ? " B" : "%"), assessment } as const;
  });
  return {
    availability: "READY",
    reportingDate: dateLabel(data.reportingDate),
    executiveAssessment: data.assessment,
    cards,
    drivers: cards.map((card) => ({ key: card.key, factor: card.title, trend: `${card.change} latest movement`, impact: card.assessment === "Positive" ? "Supports sustainable profitability and earnings quality." : "Requires closer monitoring and management action.", assessment: card.assessment })),
    conclusion: data.conclusion,
  };
}

export async function getProfitabilityExecutive(): Promise<ProfitabilityExecutiveViewModel> {
  const data = await get<ExecutiveResponse>("executive-intelligence");
  return { reportingDate: dateLabel(data.reportingDate), status: data.status.toLowerCase().includes("attention") ? "Watch" : "Healthy", executiveSummary: data.summary, managementAttention: data.attention, recommendedActions: data.recommendations, assessmentTitle: data.status, assessmentNarrative: data.assessment, profitabilityLevel: "HEALTHY", earningsTrend: "IMPROVING", monitoringStatus: "DAILY" };
}

export const getProfitabilityDrivers = () => get<ProfitabilityDriversViewModel>("profit-drivers");
export const getProfitabilityEarlyWarning = () => get<ProfitabilityEarlyWarningViewModel>("early-warning");

export async function getProfitabilityDashboard() {
  const [health, movement, drivers, earlyWarning, strategic, executive] = await Promise.all([getProfitabilityHealthScore(), getProfitabilityMovement(), getProfitabilityDrivers(), getProfitabilityEarlyWarning(), getProfitabilityStrategic(), getProfitabilityExecutive()]);
  return { health, movement, drivers, earlyWarning, strategic, executive };
}
