import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ToastContext, type ToastApi, type ToastOptions, type ToastVariant } from './toast-context';

interface ToastRecord extends Required<Omit<ToastOptions, 'description'>> {
  id: number;
  description?: string;
}

const MAX_VISIBLE = 3;

const styles: Record<ToastVariant, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-success' },
  error: { icon: XCircle, className: 'text-danger' },
  info: { icon: Info, className: 'text-info' },
};

/** Renders toasts bottom-right (bottom-center on phones). Mount once near the app root. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const show = useCallback((opts: ToastOptions) => {
    const variant = opts.variant ?? 'info';
    const toast: ToastRecord = {
      id: ++nextId.current,
      title: opts.title,
      description: opts.description,
      variant,
      duration: opts.duration ?? (variant === 'error' ? 8000 : 5000),
    };
    setToasts((all) => [...all, toast].slice(-MAX_VISIBLE));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, description) => show({ title, description, variant: 'success' }),
      error: (title, description) => show({ title, description, variant: 'error' }),
      info: (title, description) => show({ title, description, variant: 'info' }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-relevant="additions"
          className="pointer-events-none fixed inset-x-4 bottom-4 z-[100001] flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        >
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <ToastView key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const { icon: Icon, className } = styles[toast.variant];

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [paused, toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      role={toast.variant === 'error' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line-strong bg-panel/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-md"
    >
      <Icon size={20} aria-hidden="true" className={cn('mt-0.5 shrink-0', className)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.description && <p className="mt-1 text-sm text-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-m-1 rounded-full p-1 text-faint transition hover:text-white"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
