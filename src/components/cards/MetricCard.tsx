import { Card } from '../ui/Card';

export interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card className="kpi-card">
      <p className="kpi-label">{label}</p>
      <h3>{value}</h3>
      <span>{detail}</span>
    </Card>
  );
}
