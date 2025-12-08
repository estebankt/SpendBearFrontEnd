'use client';

import * as React from 'react';
import { Progress } from './progress';
import { cn } from '@/lib/utils/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

/**
 * Progress Bar Component
 *
 * Features:
 * - Percentage display
 * - Color variants (default, success, warning, danger)
 * - Animation on mount
 * - Label support
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  // Determine variant based on percentage if not explicitly set
  const effectiveVariant = React.useMemo(() => {
    if (variant !== 'default') return variant;

    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'default';
    return 'success';
  }, [percentage, variant]);

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}

      <div className="relative">
        <Progress value={percentage} className="h-2">
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out rounded-full',
              variantClasses[effectiveVariant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </Progress>
      </div>
    </div>
  );
}
