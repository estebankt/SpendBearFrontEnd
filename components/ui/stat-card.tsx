import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './card';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    label?: string;
  };
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
}

/**
 * Stat Card Component
 *
 * Features:
 * - Label, value, and change indicator
 * - Icon support
 * - Loading skeleton variant
 * - Positive/negative change styling
 */
export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  loading = false,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>

            {change && (
              <div className="flex items-center gap-1 text-sm">
                {isPositive && <TrendingUp className="h-4 w-4 text-success" />}
                {isNegative && <TrendingDown className="h-4 w-4 text-destructive" />}
                <span
                  className={cn(
                    'font-medium',
                    isPositive && 'text-success',
                    isNegative && 'text-destructive',
                    !isPositive && !isNegative && 'text-muted-foreground'
                  )}
                >
                  {isPositive && '+'}
                  {change.value}%
                </span>
                {change.label && (
                  <span className="text-muted-foreground">{change.label}</span>
                )}
              </div>
            )}
          </div>

          {Icon && (
            <div className="rounded-full bg-primary/10 p-3">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
