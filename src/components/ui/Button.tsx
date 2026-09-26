import { useRef, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

/**
 * Three-level CTA hierarchy:
 *  primary   — off-white surface, the one action per view   (JOIN HACKB4 →)
 *  secondary — hairline border on the background           (EXPLORE HACKATHONS)
 *  tertiary  — text + arrow, for in-card and inline links   (VIEW PROJECTS →)
 */
const variants = {
  primary:
    'border border-white bg-[#f2f2ef] text-black hover:bg-white hover:shadow-[0_0_28px_-6px_rgba(255,255,255,0.45)]',
  secondary:
    'border border-white/25 bg-white/[0.02] text-white hover:border-white/60 hover:bg-white/[0.06] hover:shadow-[0_0_24px_-8px_rgba(255,255,255,0.25)]',
  tertiary: 'text-white/75 hover:text-white',
} as const;

const sizes = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-12 px-6 text-xs',
  lg: 'h-14 px-8 text-[13px]',
} as const;

export type ButtonVariant = keyof typeof variants;

type Common = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  /** Trailing arrow that nudges on hover. External links get ↗ automatically. */
  arrow?: boolean;
  fullWidth?: boolean;
  /** Magnetic follow-the-cursor effect (desktop only). Reserve for cinematic moments: hero + final CTA. */
  magnetic?: boolean;
  className?: string;
};

type ButtonProps = Common &
  (
    | { to: string; href?: never; type?: never; onClick?: () => void; disabled?: never; loading?: never }
    | { href: string; to?: never; type?: never; onClick?: () => void; disabled?: never; loading?: never }
    | {
        to?: never;
        href?: never;
        type?: 'button' | 'submit';
        onClick?: () => void;
        disabled?: boolean;
        /** Shows a spinner and blocks clicks (e.g. while a form submits). */
        loading?: boolean;
      }
  );

/**
 * One button for the whole site: renders a <button>, router <Link> or external <a>.
 * The magnetic motion lives on a wrapper and uses motion values, so it never re-renders React.
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  arrow = false,
  fullWidth,
  magnetic = false,
  className,
  ...props
}: ButtonProps) {
  const finePointer = useFinePointer();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });
  const active = magnetic && finePointer;

  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.2);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const external = 'href' in props && !!props.href;
  const tertiary = variant === 'tertiary';

  const classes = cn(
    'group/btn relative inline-flex items-center justify-center gap-3 rounded-[3px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase',
    'transition-[background-color,border-color,color,box-shadow] duration-300 ease-cinematic',
    'disabled:pointer-events-none disabled:opacity-40',
    tertiary ? 'h-auto px-0 text-xs' : sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {/* Hairline highlight along the top edge that lights up on hover. */}
      {!tertiary && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-3 -top-px h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100',
            variant === 'primary' ? 'via-white' : 'via-white/80',
          )}
        />
      )}
      {'loading' in props && props.loading && <Spinner size="sm" />}
      <span className="relative">{children}</span>
      {arrow &&
        (external ? (
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        ) : (
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        ))}
    </>
  );

  let el: ReactNode;
  if ('to' in props && props.to) {
    el = (
      <Link to={props.to} onClick={props.onClick} className={classes}>
        {content}
      </Link>
    );
  } else if (external) {
    el = (
      <a href={props.href} onClick={props.onClick} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  } else {
    const {
      type = 'button',
      onClick,
      disabled,
      loading,
    } = props as { type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean; loading?: boolean };
    el = (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={classes}
      >
        {content}
      </button>
    );
  }

  if (!active) return el;

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', fullWidth && 'w-full')}
    >
      {el}
    </motion.span>
  );
}
