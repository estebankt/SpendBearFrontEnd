import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
  icon?: LucideIcon | string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'text-4xl h-12 w-12',
    title: 'text-base',
    description: 'text-xs',
  },
  md: {
    container: 'py-12',
    icon: 'text-5xl h-16 w-16',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'text-6xl h-20 w-20',
    title: 'text-xl',
    description: 'text-base',
  },
};

/**
 * Empty State Component
 *
 * Features:
 * - Icon support (Lucide icons or emoji string)
 * - Title, description, and action button
 * - Various sizes (sm, md, lg)
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const sizes = sizeClasses[size];
  const isIconString = typeof icon === 'string';
  const IconComponent = !isIconString ? icon : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
    >
      {icon && (
        <div className={cn('mb-4 text-muted-foreground', sizes.icon)}>
          {IconComponent ? <IconComponent /> : <span>{icon as string}</span>}
        </div>
      )}

      <h3 className={cn('font-semibold text-foreground mb-2', sizes.title)}>{title}</h3>

      {description && (
        <p className={cn('text-muted-foreground max-w-sm mb-6', sizes.description)}>
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick} size={size === 'sm' ? 'sm' : 'default'}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
