import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'header' | 'sidebar' | 'footer';
  size?: number;
  className?: string;
}

export default function Logo({ variant = 'header', size, className }: LogoProps) {
  const sizeMap = {
    header: 8,
    sidebar: 10,
    footer: 6,
  };

  const iconSize = size || sizeMap[variant];

  const containerClasses = {
    header: 'bg-primary',
    sidebar: 'bg-primary',
    footer: 'bg-primary',
  };

  const iconClasses = {
    header: 'text-white',
    sidebar: 'text-white',
    footer: 'text-white',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-lg',
        `h-${iconSize} w-${iconSize}`,
        containerClasses[variant]
      )}>
        <span className={cn(
          'material-symbols-outlined',
          iconClasses[variant],
          variant === 'header' ? 'text-[20px]' : variant === 'sidebar' ? 'text-[24px]' : 'text-[16px]'
        )}>
          pets
        </span>
      </div>
      <span className={cn(
        'font-bold tracking-tight',
        variant === 'header' && 'text-xl text-slate-900 dark:text-white',
        variant === 'sidebar' && 'text-lg text-text-main',
        variant === 'footer' && 'text-lg text-slate-900 dark:text-white'
      )}>
        SpendBear
      </span>
    </div>
  );
}
