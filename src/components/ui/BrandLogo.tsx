import { cn } from '@/lib/cn';

/**
 * "HACKB4" wordmark with the signature inverted A (rendered as a flipped V).
 *
 * The flip's default transform-origin (the box center) sits above the glyph's own ink center for
 * this font, because Michroma's ascent/descent metrics are asymmetric around the cap-height box
 * used at `line-height: 1` — left at the default, the flipped "A" floats above the baseline instead
 * of sitting flush with H/C/K/B/4. `origin-[50%_56%]` re-centers the flip on the glyph's actual ink,
 * so the A's peak and feet land exactly where H's cap-height and baseline do.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center font-display tracking-[0.1em] uppercase', className)}>
      <span className="sr-only">HACKB4</span>
      <span aria-hidden="true">
        H<span className="inline-block origin-[50%_56%] -scale-y-100">V</span>CKB4
      </span>
    </span>
  );
}
