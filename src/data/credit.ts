import type { MetricData } from "../types/metric";
import type { WatchlistData } from "../types/warning";

export const creditSummary: MetricData[] = [
  {
    title: "Total Portfolio",
    value: "Rp60.5 T",
    trend: "+3.8% YoY",
    target: "Business Plan",
    status: "Healthy",
  },
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
];

export const portfolioTrend = [
  { month: "Jan", npl: 2.91 },
  { month: "Feb", npl: 2.82 },
  { month: "Mar", npl: 2.76 },
  { month: "Apr", npl: 2.63 },
  { month: "May", npl: 2.51 },
  { month: "Jun", npl: 2.42 },
];

export const sectorExposure = [
  {
    name: "Construction",
    exposure: "Rp8.6 T",
    percentage: 34,
    npl: "3.48%",
    status: "Watch",
  },
  {
    name: "Trading",
    exposure: "Rp7.1 T",
    percentage: 28,
    npl: "2.85%",
    status: "Healthy",
  },
  {
    name: "Manufacturing",
    exposure: "Rp6.3 T",
    percentage: 21,
    npl: "1.92%",
    status: "Healthy",
  },
  {
    name: "Agriculture",
    exposure: "Rp3.8 T",
    percentage: 17,
    npl: "0.95%",
    status: "Healthy",
  },
];

export const watchlist: WatchlistData[] = [
  {
    priority: "High",
    debtor: "PT Nusantara Konstruksi",
    exposure: "Rp1.28 T",
    dpd: 97,
    coll: 2,
    action: "Review Required",
  },
  {
    priority: "Medium",
    debtor: "PT Maju Trading Indonesia",
    exposure: "Rp845 B",
    dpd: 18,
    coll: 1,
    action: "Enhanced Monitoring",
  },
  {
    priority: "Medium",
    debtor: "PT Agro Makmur",
    exposure: "Rp610 B",
    dpd: 7,
    coll: 2,
    action: "Collateral Update",
  },
];