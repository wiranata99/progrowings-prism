import type { MetricData } from "../types/metric";
import type { WarningData } from "../types/warning";

export const liquiditySummary: MetricData[] = [
  {
    title: "AL / DPK",
    value: "16.42%",
    trend: "+0.55%",
    target: "≥ 10%",
    status: "Healthy",
  },
  {
    title: "LCR",
    value: "152%",
    trend: "+8%",
    target: "≥ 100%",
    status: "Healthy",
  },
  {
    title: "NSFR Daily",
    value: "126%",
    trend: "+2%",
    target: "≥ 100%",
    status: "Healthy",
  },
  {
    title: "NSFR Projection",
    value: "118%",
    trend: "-1%",
    target: "≥ 100%",
    status: "Healthy",
  },
  {
    title: "Liquidity Buffer",
    value: "Rp4.82 T",
    trend: "+0.35 T",
    target: "> 0",
    status: "Healthy",
  },
  {
    title: "7 Days Ratio",
    value: "-0.8%",
    trend: "+0.4%",
    target: "≥ -2%",
    status: "Healthy",
  },
  {
    title: "3 Months Ratio",
    value: "92%",
    trend: "+3%",
    target: "≥ 85%",
    status: "Healthy",
  },
  {
    title: "CASA Ratio",
    value: "41.6%",
    trend: "+0.8%",
    target: "Corporate Plan",
    status: "Healthy",
  },
  {
    title: "DPK Net Flow",
    value: "-2.3%",
    trend: "3 Days",
    target: "< 10%",
    status: "Watch",
  },
];

export interface LiquidityTrendData {
  day: string;
  value: number;
}

export const liquidityTrend = [
   { day: "D-29", value: 145 },
  { day: "D-28", value: 146 },
  { day: "D-27", value: 145 },
  { day: "D-26", value: 147 },
  { day: "D-25", value: 146 },
  { day: "D-24", value: 148 },
  { day: "D-23", value: 149 },
  { day: "D-22", value: 148 },
  { day: "D-21", value: 150 },
  { day: "D-20", value: 151 },
  { day: "D-19", value: 150 },
  { day: "D-18", value: 149 },
  { day: "D-17", value: 151 },
  { day: "D-16", value: 152 },
  { day: "D-15", value: 151 },
  { day: "D-14", value: 150 },
  { day: "D-13", value: 151 },
  { day: "D-12", value: 152 },
  { day: "D-11", value: 153 },
  { day: "D-10", value: 152 },
  { day: "D-9", value: 151 },
  { day: "D-8", value: 152 },
  { day: "D-7", value: 153 },
  { day: "D-6", value: 154 },
  { day: "D-5", value: 153 },
  { day: "D-4", value: 152 },
  { day: "D-3", value: 153 },
  { day: "D-2", value: 154 },
  { day: "D-1", value: 153 },
  { day: "Today", value: 152 },
] satisfies LiquidityTrendData[];

export interface FundingCompositionData {
  name: string;
  value: number;
  amount: string;
  
}

export const fundingComposition = [
  {
    name: "Current Account",
    value: 14,
    amount: "Rp8.5 T",
    
  },
  {
    name: "Saving Account",
    value: 28,
    amount: "Rp16.9 T",
    
  },
  {
    name: "Time Deposit",
    value: 58,
    amount: "Rp35.1 T",
    
  },
] satisfies FundingCompositionData[];

export interface LiquidityGapData {
  bucket: string;
  gap: string;
  status: "Healthy" | "Watch" | "Critical";
  
}

export const liquidityGap = [
  {
    bucket: "Overnight",
    gap: "+Rp2.35 T",
    status: "Healthy",
    
  },
  {
    bucket: "2 - 7 Days",
    gap: "+Rp1.42 T",
    status: "Healthy",
    
  },
  {
    bucket: "8 - 30 Days",
    gap: "-Rp0.68 T",
    status: "Watch",
    },
    
  {
    bucket: "1 - 3 Months",
    gap: "+Rp1.94 T",
    status: "Healthy",
    
  },
  {
    bucket: "> 3 Months",
    gap: "+Rp5.83 T",
    status: "Healthy",
    
  },
] satisfies LiquidityGapData[];


export const liquidityEarlyWarning: WarningData[] = [
  {
    priority: "High",
    indicator: "DPK Net Outflow",
    current: "-11.8%",
    threshold: "-10%",
    impact: "High",
    action: "Escalate",
    
  },
  {
    priority: "Medium",
    indicator: "CASA Ratio",
    current: "41.6%",
    threshold: "45%",
    impact: "Medium",
    action: "Monitor",
    
  },
  {
    priority: "Low",
    indicator: "LCR",
    current: "152%",
    threshold: ">100%",
    impact: "Low",
    action: "Normal",
    
  },
] satisfies WarningData[];