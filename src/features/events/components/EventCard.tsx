import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag } from 'lucide-react';
import type { Event } from '@/lib/api';
import { formatDate, humanize } from '@/lib/format';
import { imageSrcSet, imageUrl } from '@/lib/image';

/** Mouse-follow spotlight via CSS variables — no React state, no re-renders. */
const trackSpotlight = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export function EventCard({ event }: { event: Event }) {
  const meta = [
    { icon: Calendar, text: formatDate(event.start_date) },
    { icon: MapPin, text: event.location },
    { icon: Tag, text: humanize(event.event_type) },
  ];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onMouseMove={trackSpotlight}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(600px circle at var(--mx) var(--my), rgba(255,255,255,0.1), transparent 40%)',
        }}
      />

      <div className="relative h-[200px] overflow-hidden">
        <img
          src={imageUrl(event.banner_image_url, 800)}
          srcSet={imageSrcSet(event.banner_image_url, [400, 800, 1200])}
          sizes="(max-width: 768px) 100vw, 33vw"
          alt=""
          width={800}
          height={400}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold uppercase backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      <div className="relative z-[1] flex flex-1 flex-col p-8">
        <h3 className="mb-4 text-2xl font-semibold tracking-[0.05em]">{event.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">{event.short_summary}</p>

        <ul className="mb-8 flex flex-col gap-2 text-xs text-white/80">
          {meta.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 capitalize">
              <Icon size={14} aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        <Link
          to={`/events/${event.slug}`}
          className="block rounded-lg border border-white/20 bg-white/10 p-3 text-center font-semibold tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
        >
          VIEW DETAILS<span className="sr-only">: {event.title}</span>
        </Link>
      </div>
    </motion.article>
  );
}
