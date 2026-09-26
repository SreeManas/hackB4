import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, SearchX, type LucideIcon } from 'lucide-react';

/** Shown when a list has nothing to show (no events, no search results …). */
export function EmptyState({
  title,
  message,
  icon: Icon = SearchX,
  action,
}: {
  title: string;
  message?: string;
  icon?: LucideIcon;
  /** Optional button, e.g. "Clear filters". */
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
      <Icon size={36} strokeWidth={1.5} aria-hidden="true" className="text-faint" />
      <p className="text-lg text-white">{title}</p>
      {message && <p className="max-w-md text-muted">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Error message with an optional retry action (for failed data loads). */
export function ErrorState({
  message = 'Something went wrong while loading this content.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-16 text-center"
    >
      <p className="text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-white/30 px-6 py-2 text-sm tracking-widest transition hover:bg-white hover:text-black"
        >
          TRY AGAIN
        </button>
      )}
    </div>
  );
}

/** Confirmation shown after a successful form submission. */
export function SuccessState({ title, message }: { title: string; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="status"
      className="flex h-full flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-surface-2">
        <Check size={40} strokeWidth={2} />
      </div>
      <h3 className="mb-4 text-2xl sm:text-3xl">{title}</h3>
      <p className="text-lg text-subtle">{message}</p>
    </motion.div>
  );
}
