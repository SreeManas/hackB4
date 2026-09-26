import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/** Single-select filter row (toggle buttons). Scrolls sideways on its own on narrow screens. */
export function FilterChips({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible group name, e.g. "Filter projects by domain". */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex max-w-full [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={cn(
              'relative isolate h-8 shrink-0 rounded-[2px] border px-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors duration-300',
              active
                ? 'border-white text-black'
                : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white',
            )}
          >
            {active && (
              <motion.span
                layoutId={`chip-${label}`}
                aria-hidden="true"
                className="absolute inset-0 -z-[1] bg-white"
                transition={{ type: 'spring', stiffness: 400, damping: 36 }}
              />
            )}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
