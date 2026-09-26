import { Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InfoRow } from '@/components/ui/InfoRow';
import { api, type Event } from '@/lib/api';
import { formatDateRange, humanize } from '@/lib/format';

const UTM = { source: 'platform', medium: 'events_page', campaign: 'hackathon_2026' } as const;

/** Outbound registration link with UTM attribution (per the platform spec). */
function registrationUrl(event: Event) {
  try {
    const url = new URL(event.devnovate_registration_url);
    url.searchParams.set('utm_source', UTM.source);
    url.searchParams.set('utm_medium', UTM.medium);
    url.searchParams.set('utm_campaign', UTM.campaign);
    return url.toString();
  } catch {
    // A malformed URL from the backend must not crash the detail page; link to it as-is.
    return event.devnovate_registration_url;
  }
}

export function EventInfoPanel({ event }: { event: Event }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-surface p-8 lg:sticky lg:top-28">
      <InfoRow icon={Calendar} label="Date">
        <time dateTime={event.start_date}>{formatDateRange(event.start_date, event.end_date)}</time>
      </InfoRow>
      <InfoRow icon={MapPin} label="Location">
        {event.location}
      </InfoRow>
      <InfoRow icon={Tag} label="Format">
        <span className="capitalize">{humanize(event.event_type)}</span>
      </InfoRow>
      <Button
        href={registrationUrl(event)}
        onClick={() => api.trackConversion(event.id, UTM)}
        variant="primary"
        arrow
        fullWidth
        className="mt-4"
      >
        / REGISTER NOW
      </Button>
    </div>
  );
}
