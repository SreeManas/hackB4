import { cn } from '@/lib/cn';

const sizes = { sm: 'size-4 border-2', md: 'size-6 border-2', lg: 'size-10 border-[3px]' } as const;

/** Loading indicator. Pass `label` when it stands alone so screen readers announce it. */
export function Spinner({
  size = 'md',
  label,
  className,
}: {
  size?: keyof typeof sizes;
  label?: string;
  className?: string;
}) {
  return (
    <span role={label ? 'status' : undefined} className={cn('inline-flex', className)}>
      <span
        aria-hidden="true"
        className={cn('animate-spin rounded-full border-current border-r-transparent opacity-80', sizes[size])}
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
