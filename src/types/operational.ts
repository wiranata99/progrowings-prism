export interface OperationalLossTrendData {
  month: string;
  loss: number;
}

export interface LossEventData {
  category: string;
  total: number;
}

export interface HeatmapData {
  id: string;
  title: string;
  likelihood: number;
  impact: number;
  level: "Low" | "Medium" | "High" | "Extreme";
}

export interface KRIData {
  indicator: string;
  current: string;
  threshold: string;
  trend: string;
  status: "Healthy" | "Watch" | "Critical";
}

export interface RCSAData {
  unit: string;
  inherentRisk: string;
  residualRisk: string;
  control: string;
  reviewDate: string;
}

export interface OperationalIncidentData {
  date: string;
  event: string;
  unit: string;
  impact: string;
  status: "Open" | "In Progress" | "Closed";
}