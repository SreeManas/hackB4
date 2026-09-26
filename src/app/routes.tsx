import { lazy, type ComponentType } from 'react';

/**
 * Lazy route with retry: if a chunk fails to load (e.g. a new deploy replaced it),
 * reload once to fetch the fresh build instead of showing a broken page.
 */
function page(loader: () => Promise<{ default: ComponentType }>) {
  return lazy(() =>
    loader().catch((err) => {
      const key = 'hb4_chunk_reload';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
      }
      throw err;
    }),
  );
}

const HomePage = page(() => import('@/features/home/HomePage'));
const EventsPage = page(() => import('@/features/events/EventsPage'));
const EventDetailPage = page(() => import('@/features/events/EventDetailPage'));
const ServicesPage = page(() => import('@/features/services/ServicesPage'));
const TeamPage = page(() => import('@/features/team/TeamPage'));
const ContactPage = page(() => import('@/features/contact/ContactPage'));
// Dev-only component gallery; the import is dropped from production builds.
const UiPreviewPage = import.meta.env.DEV ? page(() => import('@/features/dev/UiPreviewPage')) : null;
const NotFoundPage = page(() => import('@/features/not-found/NotFoundPage'));

export const routes = [
  { path: '/', Component: HomePage },
  { path: '/events', Component: EventsPage },
  { path: '/events/:slug', Component: EventDetailPage },
  { path: '/services', Component: ServicesPage },
  { path: '/our-team', Component: TeamPage },
  { path: '/contact', Component: ContactPage },
  ...(UiPreviewPage ? [{ path: '/dev/ui', Component: UiPreviewPage }] : []),
  { path: '*', Component: NotFoundPage },
];
