import type { MetricData } from "../types/metric";

export const treasurySummary: MetricData[] = [
  {
    title: "Portofolio Treasury",
    value: "Rp24.8 T",
    trend: "+2.8%",
    target: "Rencana Bisnis Bank",
    status: "Healthy",
  },
  {
    title: "Yield Portofolio",
    value: "6.84%",
    trend: "+0.17%",
    target: "> 6.50%",
    status: "Healthy",
  },
  {
    title: "Unrealized Gain",
    value: "Rp428 B",
    trend: "+9%",
    target: "Positif",
    status: "Healthy",
  },
  {
    title: "Realized Gain",
    value: "Rp126 B",
    trend: "+11%",
    target: "YTD Plan",
    status: "Healthy",
  },
  {
    title: "Modified Duration",
    value: "3.48",
    trend: "+0.12",
    target: "< 4.00",
    status: "Healthy",
  },
  {
    title: "Average Duration",
    value: "4.10",
    trend: "+0.08",
    target: "< 5.00",
    status: "Healthy",
  },
  {
    title: "HTM Composition",
    value: "62%",
    trend: "+2%",
    target: "Investment Strategy",
    status: "Healthy",
  },
  {
    title: "FVOCI Composition",
    value: "30%",
    trend: "-1%",
    target: "Investment Strategy",
    status: "Healthy",
  },
  {
    title: "FVTPL Composition",
    value: "8%",
    trend: "-1%",
    target: "<10%",
    status: "Healthy",
  },
];

export const treasuryTrend = [
  { day: "D-30", portfolio: 6.25, benchmark: 6.08 },
  { day: "D-25", portfolio: 6.32, benchmark: 6.12 },
  { day: "D-20", portfolio: 6.41, benchmark: 6.18 },
  { day: "D-15", portfolio: 6.58, benchmark: 6.26 },
  { day: "D-10", portfolio: 6.63, benchmark: 6.34 },
  { day: "D-5", portfolio: 6.71, benchmark: 6.43 },
  { day: "Today", portfolio: 6.84, benchmark: 6.55 },
];

export const portfolioComposition = [
  {
    name: "Surat Utang Negara (SUN)",
    value: 62,
    color: "bg-cyan-500",
  },
  {
    name: "SRBI",
    value: 18,
    color: "bg-emerald-500",
  },
  {
    name: "SBSN",
    value: 12,
    color: "bg-amber-400",
  },
  {
    name: "Obligasi Korporasi",
    value: 8,
    color: "bg-violet-500",
  },
];

export const durationAnalysis = [
  {
    bucket: "< 1 Tahun",
    amount: "Rp4.2 T",
    duration: "0.8",
  },
  {
    bucket: "1 - 3 Tahun",
    amount: "Rp8.1 T",
    duration: "2.1",
  },
  {
    bucket: "3 - 5 Tahun",
    amount: "Rp7.3 T",
    duration: "3.8",
  },
  {
    bucket: "> 5 Tahun",
    amount: "Rp5.2 T",
    duration: "6.4",
  },
];