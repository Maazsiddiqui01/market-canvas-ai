import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Unified page header used by every dashboard route.
 * Provides consistent rhythm, hierarchy, and an optional gradient icon chip.
 */
export const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 md:mb-8 animate-fade-in',
        className
      )}
    >
      <div className="flex items-start gap-4 min-w-0">
        {Icon && (
          <div
            className="hidden sm:flex shrink-0 h-12 w-12 items-center justify-center rounded-2xl glass-subtle"
            style={{ background: 'var(--gradient-brand-tint)' }}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
};
