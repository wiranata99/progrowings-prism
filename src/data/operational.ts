import type { MetricData } from "../types/metric";

export const operationalSummary: MetricData[] = [
  {
    title: "Operational Loss",
    value: "Rp2.84 B",
    trend: "-12%",
    target: "< Rp3.50 B",
    status: "Healthy",
  },
  {
    title: "Loss Event",
    value: "42",
    trend: "-6",
    target: "< 50",
    status: "Healthy",
  },
  {
    title: "High Risk Process",
    value: "6",
    trend: "+1",
    target: "< 8",
    status: "Watch",
  },
  {
    title: "KRI Breached",
    value: "8",
    trend: "-2",
    target: "< 10",
    status: "Healthy",
  },
  {
    title: "Control Effectiveness",
    value: "93.4%",
    trend: "+1.4%",
    target: "> 90%",
    status: "Healthy",
  },
  {
    title: "Open Incident",
    value: "17",
    trend: "-5",
    target: "< 20",
    status: "Healthy",
  },
  {
    title: "Recovery Rate",
    value: "86%",
    trend: "+3%",
    target: "> 80%",
    status: "Healthy",
  },
  {
    title: "Residual Risk",
    value: "Medium",
    trend: "Stable",
    target: "Risk Appetite",
    status: "Watch",
  },
];

export const operationalLossTrend = [
  { month: "Jan", loss: 4.2 },
  { month: "Feb", loss: 3.9 },
  { month: "Mar", loss: 3.7 },
  { month: "Apr", loss: 3.4 },
  { month: "May", loss: 3.1 },
  { month: "Jun", loss: 2.84 },
];

export const kriMonitoring = [
  {
    indicator: "System Downtime",
    current: "2.4 Hours",
    threshold: "2 Hours",
    trend: "▲",
    status: "Watch",
  },
  {
    indicator: "Fraud Attempt",
    current: "12 Cases",
    threshold: "20 Cases",
    trend: "▼",
    status: "Healthy",
  },
  {
    indicator: "Failed Transaction",
    current: "0.42%",
    threshold: "1%",
    trend: "▼",
    status: "Healthy",
  },
  {
    indicator: "Manual Override",
    current: "31 Cases",
    threshold: "25 Cases",
    trend: "▲",
    status: "Critical",
  },
];