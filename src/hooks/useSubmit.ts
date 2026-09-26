import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Form submission state machine: blocks double submits, surfaces errors, and
 * optionally resets after success. Timers are cleared on unmount (no leaks).
 */
export function useSubmit<T>(
  action: (data: T) => Promise<unknown>,
  { resetAfterMs, onReset }: { resetAfterMs?: number; onReset?: () => void } = {},
) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number>();
  const busy = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = useCallback(
    async (data: T) => {
      if (busy.current) return;
      busy.current = true;
      setStatus('submitting');
      setError(null);
      try {
        await action(data);
        setStatus('success');
        if (resetAfterMs) {
          timer.current = window.setTimeout(() => {
            setStatus('idle');
            onReset?.();
          }, resetAfterMs);
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.');
      } finally {
        busy.current = false;
      }
    },
    [action, resetAfterMs, onReset],
  );

  return { submit, status, error, isSubmitting: status === 'submitting', isSuccess: status === 'success' };
}
