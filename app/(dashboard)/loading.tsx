import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}
