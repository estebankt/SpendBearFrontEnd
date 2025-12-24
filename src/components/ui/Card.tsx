import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({ children, className, hoverEffect = false }: CardProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-xl p-6',
        hoverEffect && 'transition-transform hover:-translate-y-1 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
