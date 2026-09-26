import { marqueeItems } from '../content';

/** Seamless infinite ticker of hackathon tracks: the track holds two identical halves and slides by -50%. */
export function Marquee() {
  const run = Array.from({ length: 3 }, () => marqueeItems)
    .flat()
    .map((item) => `${item} • `)
    .join('');
  return (
    <div
      className="group relative z-30 overflow-hidden bg-white/50 py-4 whitespace-nowrap text-black"
      aria-label={`Tracks: ${marqueeItems.join(', ')}`}
    >
      <div
        className="inline-flex animate-marquee text-lg font-semibold tracking-[0.2em] will-change-transform group-hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        <span className="pr-4">{run}</span>
        <span className="pr-4">{run}</span>
      </div>
    </div>
  );
}
