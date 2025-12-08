import { cn } from '@/lib/utils/cn';

export interface CategoryBadgeProps {
  name: string;
  isSystemCategory?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * Category Badge Component
 *
 * Features:
 * - Display category name with icon/indicator
 * - Compact variant for lists
 * - Different styling for system vs user categories
 */
export function CategoryBadge({
  name,
  isSystemCategory = false,
  variant = 'default',
  className,
}: CategoryBadgeProps) {
  const isCompact = variant === 'compact';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        isCompact
          ? 'px-2 py-0.5 text-xs'
          : 'px-3 py-1 text-sm',
        isSystemCategory
          ? 'bg-primary/10 text-primary'
          : 'bg-accent/10 text-accent-foreground',
        className
      )}
    >
      {isSystemCategory && (
        <span className={cn('shrink-0', isCompact ? 'text-[10px]' : 'text-xs')}>
          🏷️
        </span>
      )}
      <span className="truncate">{name}</span>
    </span>
  );
}
