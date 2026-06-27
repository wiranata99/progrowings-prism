import { Card } from '../ui/Card';

export interface InsightCardProps {
  title: string;
  updated: string;
  description: string;
}

export function InsightCard({ title, updated, description }: InsightCardProps) {
  return (
    <Card className="panel-card panel-card--large">
      <div className="panel-header">
        <h3>{title}</h3>
        <span>{updated}</span>
      </div>
      <p>{description}</p>
    </Card>
  );
}
