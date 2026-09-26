import { createContext, useContext } from 'react';

/** Platform features that are designed but not live yet. */
export type UpcomingFeature = 'projects' | 'builders' | 'teams' | 'account';

export const ComingSoonContext = createContext<((feature: UpcomingFeature) => void) | null>(null);

/** `const openComingSoon = useComingSoon(); openComingSoon('projects')` — needs <ComingSoonProvider>. */
export function useComingSoon() {
  const open = useContext(ComingSoonContext);
  if (!open) throw new Error('useComingSoon must be used inside <ComingSoonProvider>');
  return open;
}
