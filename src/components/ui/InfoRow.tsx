import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  /** "badge" = icon in a round badge (contact); "plain" = bare icon (event details). */
  variant?: 'badge' | 'plain';
  className?: string;
}

/** Icon + small uppercase label + value. */
export function InfoRow({ icon: Icon, label, children, variant = 'plain', className }: InfoRowProps) {
  return (
    <div className={cn('flex gap-4', variant === 'badge' ? 'items-center gap-6' : 'items-start', className)}>
      {variant === 'badge' ? (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-2">
          <Icon size={20} aria-hidden="true" />
        </span>
      ) : (
        <Icon size={22} className="mt-0.5 shrink-0 text-white/60" aria-hidden="true" />
      )}
      <div>
        <div className="text-xs tracking-[0.1em] text-subtle uppercase">{label}</div>
        <div className="font-semibold">{children}</div>
      </div>
    </div>
  );
}
