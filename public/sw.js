/* HACKB4 service worker: shows Web Push notifications and opens the site when one is clicked.
   No caching and no fetch handling - it exists only for push. */

const DEFAULT_URL = '/events';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }
  const title = typeof data.title === 'string' && data.title ? data.title : 'HACKB4';
  const options = {
    body: typeof data.body === 'string' ? data.body : '',
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png',
    data: { url: data.url },
  };
  // Browsers require every push to show a notification, so this always does.
  event.waitUntil(self.registration.showNotification(title, options));
});

// Only same-site paths ("/events"), never "//host" or absolute URLs.
function targetUrl(url) {
  const path = typeof url === 'string' && /^\/(?!\/)/.test(url) ? url : DEFAULT_URL;
  return new URL(path, self.location.origin).href;
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = targetUrl(event.notification.data && event.notification.data.url);
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (open) return open.focus().then((w) => (w || open).navigate(target));
      return self.clients.openWindow(target);
    }),
  );
});
