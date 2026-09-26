import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import type { Event } from '@/lib/api';
import { imageUrl } from '@/lib/image';

const attendanceMode = (type: Event['event_type']) =>
  type === 'virtual'
    ? 'https://schema.org/OnlineEventAttendanceMode'
    : type === 'hybrid' || type === 'pan_india'
      ? 'https://schema.org/MixedEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode';

/** Title, social preview and schema.org Event data (enables Google event rich results). */
export function useEventMeta(event: Event | null | undefined) {
  useDocumentMeta(
    event
      ? {
          title: event.title,
          description: event.short_summary,
          image: imageUrl(event.banner_image_url, 1200),
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            description: event.detailed_description,
            startDate: event.start_date,
            endDate: event.end_date,
            image: [imageUrl(event.banner_image_url, 1200)],
            eventAttendanceMode: attendanceMode(event.event_type),
            eventStatus: 'https://schema.org/EventScheduled',
            location:
              event.event_type === 'virtual'
                ? { '@type': 'VirtualLocation', url: event.devnovate_registration_url }
                : { '@type': 'Place', name: event.location, address: event.location },
            organizer: { '@type': 'Organization', name: 'HACKB4', url: 'https://hackb4.com' },
            offers: {
              '@type': 'Offer',
              url: event.devnovate_registration_url,
              availability: 'https://schema.org/InStock',
            },
          },
        }
      : { title: 'Event' },
  );
}
