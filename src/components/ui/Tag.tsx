import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Compact technical label. Colour is reserved for *status*; categories and tech stay monochrome.
 *   <Tag>AI</Tag>   <Tag status="active">Active</Tag>   <Tag tone="inverse">Winner</Tag>
 */
const tones = {
  default: 'border-white/15 bg-white/[0.03] text-white/75',
  muted: 'border-white/10 text-white/50',
  inverse: 'border-white bg-white text-black',
} as const;

export type TagStatus = 'active' | 'upcoming' | 'closing' | 'completed';

const statusStyles: Record<TagStatus, { text: string; dot: string }> = {
  active: {
    text: 'text-success border-success/30 bg-success/[0.06]',
    dot: 'bg-success shadow-[0_0_8px] shadow-success/60',
  },
  upcoming: { text: 'text-info border-info/30 bg-info/[0.06]', dot: 'bg-info' },
  closing: { text: 'text-warning border-warning/30 bg-warning/[0.06]', dot: 'bg-warning' },
  completed: { text: 'text-white/45 border-white/10', dot: 'bg-white/35' },
};

const sizes = { sm: 'h-5 px-1.5 text-[10px]', md: 'h-6 px-2 text-[11px]' } as const;

interface TagProps {
  children: ReactNode;
  tone?: keyof typeof tones;
  /** Status tags get a coloured dot and override `tone`. */
  status?: TagStatus;
  size?: keyof typeof sizes;
  className?: string;
}

export function Tag({ children, tone = 'default', status, size = 'md', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[2px] border font-mono leading-none tracking-[0.06em] whitespace-nowrap uppercase',
        'transition-colors duration-300',
        // Plain tags brighten slightly when their product card is hovered; status colours never change.
        status ? statusStyles[status].text : [tones[tone], 'group-hover/card:border-white/25'].join(' '),
        sizes[size],
        className,
      )}
    >
      {status && <span aria-hidden="true" className={cn('size-1.5 rounded-full', statusStyles[status].dot)} />}
      {children}
    </span>
  );
}

/** A row of tags, e.g. tech stack. Renders as a list for screen readers. */
export function TagList({
  items,
  size = 'sm',
  label,
  className,
}: {
  items: readonly string[];
  size?: TagProps['size'];
  /** Accessible name, e.g. "Tech stack". */
  label?: string;
  className?: string;
}) {
  return (
    <ul aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((t) => (
        <li key={t}>
          <Tag size={size}>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}
