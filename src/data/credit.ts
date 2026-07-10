import type { MetricData } from "../types/metric";
import type { WatchlistData } from "../types/warning";

export const creditSummary: MetricData[] = [
  {
    title: "Gross NPL",
    value: "2.42%",
    trend: "-0.08%",
    target: "< 3.00%",
    status: "Healthy",
  },
  {
    title: "Net NPL",
    value: "0.88%",
    trend: "-0.02%",
    target: "< 1.00%",
    status: "Healthy",
  },
  {
    title: "Kolektibilitas 2",
    value: "6.84%",
    trend: "+0.24%",
    target: "< 8.00%",
    status: "Watch",
  },
  {
    title: "CKPN Coverage",
    value: "165%",
    trend: "+5%",
    target: "> 150%",
    status: "Healthy",
  },
  {
    title: "Total Portfolio",
    value: "Rp60.5 T",
    trend: "+3.8% YoY",
    target: "Business Plan",
    status: "Healthy",
  },
];

export const sectorExposure = [
  {
    name: "Construction",
    exposure: "Rp4.2 T",
    npl: "3.81%",
    percentage: 14.6,
    status: "Watch",
  },
  {
    name: "Mining",
    exposure: "Rp5.9 T",
    npl: "1.42%",
    percentage: 9.8,
    status: "Healthy",
  },
  {
    name: "Manufacturing",
    exposure: "Rp8.7 T",
    npl: "2.05%",
    percentage: 18.4,
    status: "Healthy",
  },
  {
    name: "Trading",
    exposure: "Rp6.3 T",
    npl: "2.67%",
    percentage: 11.2,
    status: "Healthy",
  },
  {
    name: "Consumer",
    exposure: "Rp21.4 T",
    npl: "2.18%",
    percentage: 35.3,
    status: "Healthy",
  },
];

export const watchlist: WatchlistData[] = [
  {
    debtor: "PT Alpha Konstruksi",
    exposure: "Rp420 B",
    dpd: 45,
    coll: 2,
    priority: "High",
    action: "Relationship Review",
  },
  {
    debtor: "PT Nusantara Mining",
    exposure: "Rp380 B",
    dpd: 18,
    coll: 2,
    priority: "Medium",
    action: "Monitor Cash Flow",
  },
  {
    debtor: "PT Sinar Infrastruktur",
    exposure: "Rp295 B",
    dpd: 62,
    coll: 3,
    priority: "High",
    action: "Credit Committee",
  },
  {
    debtor: "PT Global Trading",
    exposure: "Rp210 B",
    dpd: 8,
    coll: 1,
    priority: "Low",
    action: "Routine Monitoring",
  },
];

export const portfolioSegmentationTrend = [
  {
    month: "Jul 25",
    totalOutstanding: 186.5,
    totalNplAmount: 5.18,
    totalRatio: 2.78,
  },
  {
    month: "Aug 25",
    totalOutstanding: 188.2,
    totalNplAmount: 5.11,
    totalRatio: 2.71,
  },
  {
    month: "Sep 25",
    totalOutstanding: 190.1,
    totalNplAmount: 5.07,
    totalRatio: 2.67,
  },
  {
    month: "Oct 25",
    totalOutstanding: 193.4,
    totalNplAmount: 5.13,
    totalRatio: 2.65,
  },
  {
    month: "Nov 25",
    totalOutstanding: 196.0,
    totalNplAmount: 5.21,
    totalRatio: 2.63,
  },
  {
    month: "Dec 25",
    totalOutstanding: 198.5,
    totalNplAmount: 5.34,
    totalRatio: 2.69,
  },
  {
    month: "Jan 26",
    totalOutstanding: 200.4,
    totalNplAmount: 5.79,
    totalRatio: 2.89,
  },
  {
    month: "Feb 26",
    totalOutstanding: 199.8,
    totalNplAmount: 5.62,
    totalRatio: 2.74,
  },
  {
    month: "Mar 26",
    totalOutstanding: 201.6,
    totalNplAmount: 5.48,
    totalRatio: 2.63,
  },
  {
    month: "Apr 26",
    totalOutstanding: 204.1,
    totalNplAmount: 5.36,
    totalRatio: 2.55,
  },
  {
    month: "May 26",
    totalOutstanding: 206.3,
    totalNplAmount: 5.22,
    totalRatio: 2.48,
  },
  {
    month: "Jun 26",
    totalOutstanding: 208.0,
    totalNplAmount: 5.03,
    totalRatio: 2.42,
  },
];