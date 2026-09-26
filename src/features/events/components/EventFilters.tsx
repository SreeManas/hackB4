import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { EVENT_CATEGORIES } from '../categories';

interface EventFiltersProps {
  active: string;
  onChange: (category: string) => void;
}

export function EventFilters({ active, onChange }: EventFiltersProps) {
  return (
    <div role="group" aria-label="Filter events by category" className="mb-12 flex flex-wrap gap-2 sm:gap-4">
      {EVENT_CATEGORIES.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(c.id)}
            className={cn(
              'relative z-[1] px-6 py-2 text-xs font-semibold tracking-[0.1em] transition-colors duration-300',
              isActive ? 'text-black' : 'text-white/60 hover:text-white',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-filter"
                className="absolute inset-0 -z-[1] rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
