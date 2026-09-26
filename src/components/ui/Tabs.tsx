import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Optional count shown after the label, e.g. ACTIVE 03. */
  count?: number;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  /** Controlled active tab id. Omit to let Tabs manage it. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the tab list. */
  label: string;
  className?: string;
  listClassName?: string;
}

/**
 * Accessible tabs (WAI-ARIA pattern): arrow keys / Home / End move between tabs,
 * only the active tab is in the tab order, and the pill slides between tabs.
 */
export function Tabs({ items, value, defaultValue, onChange, label, className, listClassName }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const baseId = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === active);
    const next = {
      ArrowRight: (i + 1) % items.length,
      ArrowLeft: (i - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const id = items[next].id;
    select(id);
    refs.current[id]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          'flex max-w-full [scrollbar-width:none] gap-8 overflow-x-auto border-b border-line [&::-webkit-scrollbar]:hidden',
          listClassName,
        )}
      >
        {items.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2 pt-1 pb-4 text-xs font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-300',
                selected ? 'text-white' : 'text-white/45 hover:text-white/80',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-white"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {t.label}
              {t.count !== undefined && (
                <span className="font-mono text-[10px] tracking-normal text-white/40 tabular-nums">
                  {String(t.count).padStart(2, '0')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="mt-8 focus-visible:outline-offset-8"
        >
          {t.id === active && t.content}
        </div>
      ))}
    </div>
  );
}
