import type { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return <div className="main-content">{children}</div>;
}
