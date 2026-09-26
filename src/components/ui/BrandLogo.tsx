import { cn } from '@/lib/cn';

/** "HACKB4" wordmark with the signature inverted A (rendered as a flipped V). */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center font-display tracking-[0.1em] uppercase', className)}>
      <span className="sr-only">HACKB4</span>
      <span aria-hidden="true">
        H<span className="inline-block -scale-y-100">V</span>CKB4
      </span>
    </span>
  );
}
