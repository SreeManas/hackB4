import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageRange } from '@/lib/pagination';
import { cn } from '@/lib/cn';

interface PaginationProps {
  /** 1-based. */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}

const btn =
  'inline-flex size-10 items-center justify-center rounded-full text-sm transition-colors disabled:pointer-events-none disabled:opacity-30';

export function Pagination({ page, pageCount, onChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;
  const items = getPageRange(page, pageCount);

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(btn, 'text-muted hover:bg-surface-2 hover:text-white')}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`gap-${i}`} aria-hidden="true" className="w-6 text-center text-faint">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              btn,
              item === page ? 'bg-white font-semibold text-black' : 'text-muted hover:bg-surface-2 hover:text-white',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        className={cn(btn, 'text-muted hover:bg-surface-2 hover:text-white')}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
