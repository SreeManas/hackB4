import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-sm bg-surface', className)} />;
}

/** Grid of placeholder cards shown while data loads. */
export function SkeletonGrid({
  count,
  gridClassName,
  itemClassName,
}: {
  count: number;
  gridClassName: string;
  itemClassName: string;
}) {
  return (
    <div className={gridClassName} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={itemClassName} />
      ))}
    </div>
  );
}
