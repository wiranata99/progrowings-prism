import type { MetricData } from "../types/metric";
import type { WarningData } from "../types/warning";

export const profitabilitySummary: MetricData[] = [
  {
    title: "ROA",
    value: "2.41%",
    trend: "+0.08%",
    target: "> 2.00%",
    status: "Healthy",
  },
  {
    title: "ROE",
    value: "18.72%",
    trend: "+0.65%",
    target: "> 15.00%",
    status: "Healthy",
  },
  {
    title: "NIM",
    value: "6.18%",
    trend: "+0.12%",
    target: "> 5.50%",
    status: "Healthy",
  },
  {
    title: "BOPO",
    value: "73.42%",
    trend: "+0.35%",
    target: "< 80.00%",
    status: "Healthy",
  },
  {
    title: "Cost of Fund",
    value: "3.82%",
    trend: "+0.05%",
    target: "< 4.00%",
    status: "Watch",
  },
  {
    title: "Asset Yield",
    value: "9.76%",
    trend: "+0.14%",
    target: "> 9.50%",
    status: "Healthy",
  },
  {
    title: "Interest Spread",
    value: "5.94%",
    trend: "+0.09%",
    target: "> 5.00%",
    status: "Healthy",
  },
  {
    title: "CIR",
    value: "41.30%",
    trend: "-0.70%",
    target: "< 45.00%",
    status: "Healthy",
  },
];

export interface AssetYieldData {
  product: string;
  outstanding: string;
  yield: string;
  contribution: string;
}

export const assetYieldAnalysis: AssetYieldData[] = [
  {
    product: "Corporate Loan",
    outstanding: "Rp18.4 T",
    yield: "9.82%",
    contribution: "32%",
  },
  {
    product: "Consumer Loan",
    outstanding: "Rp22.8 T",
    yield: "11.76%",
    contribution: "46%",
  },
  {
    product: "SME Loan",
    outstanding: "Rp8.6 T",
    yield: "10.64%",
    contribution: "15%",
  },
  {
    product: "Mortgage",
    outstanding: "Rp5.4 T",
    yield: "8.14%",
    contribution: "7%",
  },
];

export interface CostOfFundData {
  source: string;
  outstanding: string;
  cost: string;
}

export const costOfFundAnalysis: CostOfFundData[] = [
  {
    source: "Current Account",
    outstanding: "Rp8.7 T",
    cost: "0.82%",
  },
  {
    source: "Saving Account",
    outstanding: "Rp17.9 T",
    cost: "2.24%",
  },
  {
    source: "Time Deposit",
    outstanding: "Rp34.6 T",
    cost: "5.91%",
  },
  {
    source: "Interbank",
    outstanding: "Rp2.1 T",
    cost: "6.48%",
  },
];

export interface ProductMarginData {
  product: string;
  yield: string;
  cof: string;
  margin: string;
  status: "Healthy" | "Watch" | "Critical";
}

export const productMarginAnalysis: ProductMarginData[] = [
  {
    product: "Corporate Loan",
    yield: "9.82%",
    cof: "4.24%",
    margin: "5.58%",
    status: "Healthy",
  },
  {
    product: "Consumer Loan",
    yield: "11.76%",
    cof: "4.24%",
    margin: "7.52%",
    status: "Healthy",
  },
  {
    product: "SME Loan",
    yield: "10.64%",
    cof: "4.24%",
    margin: "6.40%",
    status: "Healthy",
  },
  {
    product: "Mortgage",
    yield: "8.14%",
    cof: "4.24%",
    margin: "3.90%",
    status: "Watch",
  },
];

export interface ProfitDriverData {
  factor: string;
  impact: string;
}

export const positiveProfitDriver: ProfitDriverData[] = [
  {
    factor: "CASA Growth",
    impact: "+18 bps",
  },
  {
    factor: "Consumer Loan Yield",
    impact: "+24 bps",
  },
  {
    factor: "Fee Based Income",
    impact: "+8 bps",
  },
];

export const negativeProfitDriver: ProfitDriverData[] = [
  {
    factor: "Cost of Credit",
    impact: "-11 bps",
  },
  {
    factor: "Operating Expense",
    impact: "-7 bps",
  },
  {
    factor: "Corporate Margin",
    impact: "-4 bps",
  },
];



export const profitabilityEarlyWarning: WarningData[] = [
  {
    priority: "High",
    indicator: "BOPO",
    current: "73.6%",
    threshold: "75%",
    impact: "High",
    action: "Monitor",
    
  },
  {
    priority: "Medium",
    indicator: "Cost of Credit",
    current: "1.12%",
    threshold: "1.50%",
    impact: "Medium",
    action: "Review",
    
  },
  {
    priority: "Low",
    indicator: "NIM",
    current: "5.84%",
    threshold: "Corporate Plan",
    impact: "Low",
    action: "Normal",
    
  },
];