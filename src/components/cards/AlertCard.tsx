import { Card } from '../ui/Card';

export interface AlertCardProps {
  title: string;
  alerts: string[];
}

export function AlertCard({ title, alerts }: AlertCardProps) {
  return (
    <Card className="panel-card panel-card--alerts">
      <div className="panel-header">
        <h3>{title}</h3>
        <span>{alerts.length} active</span>
      </div>
      <ul className="alert-list">
        {alerts.map((alert) => (
          <li key={alert}>
            <span className="alert-dot" />
            {alert}
          </li>
        ))}
      </ul>
    </Card>
  );
}
