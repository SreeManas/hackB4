import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Floating control back to the events list. Fixed (not scoped to the hero) so it stays reachable
 * however far the visitor has scrolled into the event's content, mirroring `BackToTop`'s pattern.
 * Positioned to clear the fixed Navbar at both breakpoints (same offset `PageTransition` uses).
 */
export function EventBackButton() {
  return (
    <Link
      to="/events"
      aria-label="Back to events"
      className="fixed top-24 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-md transition-colors hover:bg-white hover:text-black sm:top-28 sm:left-8"
    >
      <ArrowLeft size={20} aria-hidden="true" />
    </Link>
  );
}
