import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

export interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Page Header Component
 *
 * Features:
 * - Title and description
 * - Optional back button
 * - Actions slot for buttons/controls
 */
export function PageHeader({
  title,
  description,
  backHref,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 pb-4 border-b', className)}>
      {backHref && (
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={backHref}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
