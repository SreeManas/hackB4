import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Cursor position → CSS vars for the spotlight. No React state, so no re-renders. */
const trackSpotlight = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

/**
 * Frame for every product listing (hackathons, projects, builders, teams).
 * Hover: lifts 4px, hairline border brightens, a soft light follows the cursor, corner brackets close in,
 * the action arrow nudges.
 * The whole card is clickable through <CardAction> (a single stretched link — one tab stop per card).
 */
export function ProductCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <article
      onMouseMove={trackSpotlight}
      className={cn(
        'group/card relative flex flex-col rounded-[4px] border border-white/[0.09] bg-black/55 p-6 backdrop-blur-[3px]',
        'transition-[transform,border-color,background-color] duration-500 ease-cinematic',
        'hover:-translate-y-1 hover:border-white/25 hover:bg-[rgb(12_12_12/0.7)]',
        // Keyboard focus lands on the stretched action; outline the whole card instead.
        'has-[:focus-visible]:border-white/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-white',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.055), transparent 60%)',
        }}
      />
      <CornerBrackets />
      {children}
    </article>
  );
}

const bracket =
  'pointer-events-none absolute size-2.5 border-white/70 opacity-0 transition-[opacity,translate] duration-500 ease-cinematic group-hover/card:translate-0 group-hover/card:opacity-100';

/** Four L-shaped corner marks — the "technical instrument" detail, only visible on hover. */
function CornerBrackets() {
  return (
    <span aria-hidden="true">
      <span className={cn(bracket, '-top-px -left-px translate-1 border-t border-l')} />
      <span className={cn(bracket, '-top-px -right-px -translate-x-1 translate-y-1 border-t border-r')} />
      <span className={cn(bracket, '-bottom-px -left-px translate-x-1 -translate-y-1 border-b border-l')} />
      <span className={cn(bracket, '-right-px -bottom-px -translate-1 border-r border-b')} />
    </span>
  );
}

type CardActionProps = {
  /** Visible label, e.g. "EXPLORE". */
  children: ReactNode;
  /** Screen-reader context, e.g. the card title → "Explore: HACKB4 Global AI Challenge". */
  srLabel: string;
  className?: string;
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never });

/** The card's primary action. Its ::after covers the whole card, so clicking anywhere triggers it. */
export function CardAction({ children, srLabel, className, ...props }: CardActionProps) {
  const classes = cn(
    'inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-white/75 uppercase transition-colors duration-300 group-hover/card:text-white',
    'after:absolute after:inset-0 after:rounded-[4px] after:content-[""] focus-visible:outline-none',
    className,
  );
  const inner = (
    <>
      {children}
      <span className="sr-only">: {srLabel}</span>
      <ArrowRight
        size={14}
        aria-hidden="true"
        className="transition-transform duration-300 ease-cinematic group-hover/card:translate-x-1"
      />
    </>
  );
  return props.to ? (
    <Link to={props.to} className={classes}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={props.onClick} className={classes}>
      {inner}
    </button>
  );
}

/** Value-over-label pair for card footers ("1,240 / BUILDERS"). Use inside a <dl>. */
export function CardStat({ value, label, className }: { value: ReactNode; label: string; className?: string }) {
  return (
    // dt must precede dd in the markup; flex-col-reverse puts the value on top visually.
    <div className={cn('flex flex-col-reverse gap-1', className)}>
      <dt className="text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">{label}</dt>
      <dd className="font-mono text-sm text-white tabular-nums">{value}</dd>
    </div>
  );
}
