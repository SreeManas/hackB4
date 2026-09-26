import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useStorage } from '@/hooks/useStorage';

const btn = 'rounded-md px-4 py-2 text-xs font-semibold transition';

/** Bottom-left prompt to subscribe to event notifications. Remembers the visitor's choice. */
export function PushOptIn() {
  const [interacted, setInteracted] = useStorage('push_optin_interacted', false);
  const [visible, setVisible] = useState(!interacted);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const dismiss = () => {
    setInteracted(true);
    setVisible(false);
  };

  const subscribe = async () => {
    setStatus('loading');
    try {
      // TODO(backend): replace with the real FCM / OneSignal token once push is configured.
      const token = `fcm-token-${crypto.randomUUID()}`;
      await api.subscribeNotification(token);
      dismiss();
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Notification opt-in"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 2 }}
          className="fixed right-4 bottom-4 left-4 z-[9999] flex items-start gap-4 rounded-xl border border-white/10 bg-[rgba(20,20,20,0.92)] p-6 shadow-2xl backdrop-blur-md sm:right-auto sm:bottom-8 sm:left-8 sm:max-w-[350px]"
        >
          <span className="rounded-full bg-white/10 p-2">
            <Bell size={20} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="mb-2 text-sm font-semibold">Stay Updated</h2>
            <p className="mb-4 text-xs leading-snug text-muted">
              {status === 'error'
                ? 'Could not subscribe right now. Please try again.'
                : 'Get notified about upcoming hackathons & placement drives.'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={subscribe}
                disabled={status === 'loading'}
                className={`${btn} bg-white text-black disabled:opacity-60`}
              >
                {status === 'loading' ? 'Subscribing…' : 'Enable'}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className={`${btn} border border-white/20 text-white/60 hover:text-white`}
              >
                Not Now
              </button>
            </div>
          </div>
          <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-white/40 hover:text-white">
            <X size={16} />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
