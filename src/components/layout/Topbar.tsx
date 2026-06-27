import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export interface TopbarProps {
  title: string;
  tag: string;
}

export function Topbar({ title, tag }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-tag">{tag}</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <Button type="button" aria-label="Search">
          <Search size={18} />
        </Button>
        <Button type="button" aria-label="Notifications">
          <Bell size={18} />
        </Button>
      </div>
    </header>
  );
}
