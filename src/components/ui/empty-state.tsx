import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => (
  <div
    className={cn(
      'glass-subtle rounded-2xl p-10 md:p-14 text-center flex flex-col items-center gap-4 animate-fade-in',
      className
    )}
  >
    {Icon && (
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center glass"
        style={{ background: 'var(--gradient-brand-tint)' }}
        aria-hidden="true"
      >
        <Icon className="h-7 w-7 text-primary" />
      </div>
    )}
    <div className="space-y-1.5 max-w-md">
      <h3 className="text-lg font-display font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);
