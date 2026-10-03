import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { env } from '@/config/env';
import { api } from '@/lib/api';
import { useStorage } from '@/hooks/useStorage';
import { PushError, createPushSubscription, type PushFailure } from './webPush';

const btn = 'rounded-md px-4 py-2 text-xs font-semibold transition';

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const MESSAGES: Record<'idle' | 'error' | PushFailure, string> = {
  idle: 'Get notified about upcoming hackathons & placement drives.',
  error: 'Could not subscribe right now. Please try again.',
  denied: 'Notifications are blocked for this site. Allow them in your browser settings, then try again.',
  dismissed: 'Notification permission was not granted. Tap Enable to try again.',
  unavailable: 'Notifications are not available right now. Please try again later.',
  unsupported: IS_IOS
    ? 'On iPhone and iPad, add HACKB4 to your Home Screen first, then enable notifications from the app.'
    : 'This browser does not support push notifications.',
};

/**
 * With no backend and no VAPID key (plain mock-data development) there is nothing real to subscribe to,
 * so a clearly fake subscription goes to the mock API. Whenever a backend is configured, the real
 * browser Push API is always used - never a fake.
 */
const SIMULATE_PUSH = !env.apiBaseUrl && !env.vapidPublicKey;

const simulatedSubscription = () => ({
  endpoint: `https://fcm.googleapis.com/mock/${crypto.randomUUID()}`,
  keys: { p256dh: 'mock', auth: 'mock' },
});

/** Bottom-left prompt to subscribe to event notifications. Remembers the visitor's choice. */
export function PushOptIn() {
  const [interacted, setInteracted] = useStorage('push_optin_interacted', false);
  const [visible, setVisible] = useState(!interacted);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | PushFailure>('idle');
  // Blocks a second request while one is in flight, even before the button re-renders as disabled.
  const busy = useRef(false);

  const dismiss = () => {
    setInteracted(true);
    setVisible(false);
  };

  const subscribe = async () => {
    if (busy.current) return;
    busy.current = true;
    setStatus('loading');
    try {
      // The browser hands back the same subscription on every call, so a retry or a second "Enable" is
      // idempotent end-to-end (the API upserts on the endpoint).
      const subscription = SIMULATE_PUSH ? simulatedSubscription() : await createPushSubscription(env.vapidPublicKey);
      await api.subscribeNotification(subscription);
      dismiss();
    } catch (err) {
      setStatus(err instanceof PushError ? err.reason : 'error');
    } finally {
      busy.current = false;
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
            <p className="mb-4 text-xs leading-snug text-muted">{MESSAGES[status === 'loading' ? 'idle' : status]}</p>
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
