import type { ActivityItem } from '@/lib/api/types';
import { useActivity } from '@/lib/api/queries';
import { timeAgo } from '@/lib/format';
import { community, sectionIds } from '../content';

const verb: Record<ActivityItem['type'], string> = {
  submission: 'submitted',
  team_formed: 'formed a team for',
  award: 'won',
  hackathon_launched: 'launched',
};

function ActivityLine({ item }: { item: ActivityItem }) {
  return (
    <span className="inline-flex items-center gap-2.5 pr-12">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-success/80" />
      <span className="text-white">{item.actor.toUpperCase()}</span>
      <span className="text-white/45">{verb[item.type]}</span>
      <span className="text-white">{item.target.toUpperCase()}</span>
      <span className="text-white/35">· {timeAgo(item.created_at)}</span>
    </span>
  );
}

/**
 * Statement moment (identity): pinned on desktop while each word lights up with scroll (GSAP),
 * followed by a quiet live-activity ticker — community signal without becoming a social feed.
 */
export function Community() {
  const { data: activity } = useActivity();

  return (
    <section id={sectionIds.community} tabIndex={-1} className="community-section home-section relative outline-none">
      <div className="community-pin flex min-h-svh flex-col justify-center py-24">
        <div className="mx-auto w-[92%] max-w-[1400px]">
          <h2 className="editorial-header">{community.eyebrow}</h2>
          <p className="community-statement max-w-[18ch] font-display text-[clamp(2rem,6vw,5.5rem)] leading-[1.08] tracking-[0.02em] uppercase">
            {community.statement.split(' ').map((w, i) => (
              <span key={i} className="community-word inline-block pr-[0.3em]">
                {w}
              </span>
            ))}
          </p>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/55">{community.sub}</p>
        </div>
      </div>

      {activity && activity.length > 0 && (
        <div className="border-y border-white/10 bg-black/40 py-4">
          <div className="mx-auto flex w-[92%] max-w-[1400px] items-center gap-6">
            <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-success/50 [animation-duration:2.4s]" />
                <span className="relative size-2 rounded-full bg-success" />
              </span>
              {community.activityLabel}
            </span>
            <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
              <ul className="sr-only">
                {activity.map((a) => (
                  <li key={a.id}>
                    {a.actor} {verb[a.type]} {a.target}, {timeAgo(a.created_at).toLowerCase()}
                  </li>
                ))}
              </ul>
              <div
                aria-hidden="true"
                className="inline-flex animate-marquee font-mono text-[11px] tracking-[0.08em] whitespace-nowrap [animation-duration:50s] hover:[animation-play-state:paused]"
              >
                {[0, 1].map((half) => (
                  <span key={half} className="inline-flex">
                    {activity.map((a) => (
                      <ActivityLine key={a.id} item={a} />
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
