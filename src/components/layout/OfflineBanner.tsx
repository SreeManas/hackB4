import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
};

/** Slim notice while the device is offline (common on mobile data), so failed loads make sense. */
export function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          role="status"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-[9500] flex -translate-x-1/2 items-center gap-2 rounded-full border border-warning/30 bg-panel/95 px-5 py-2.5 text-sm text-warning backdrop-blur-md"
        >
          <WifiOff size={16} aria-hidden="true" />
          You're offline — some content may not load.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
