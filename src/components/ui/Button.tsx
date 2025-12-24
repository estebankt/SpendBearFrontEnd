import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-bold transition-all';

  const variantClasses = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5',
    secondary: 'border border-slate-200 dark:border-white/10 bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 dark:text-text-main dark:hover:text-white',
  };

  const sizeClasses = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
