import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Tag } from '@/components/ui/Tag';
import { ease } from '@/components/motion/presets';
import { cn } from '@/lib/cn';

/**
 * Small animated "product glimpses" for the How-it-works cards. Decorative (aria-hidden):
 * the card text carries the meaning. Each plays once when its card comes into view.
 */

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <motion.div
      aria-hidden="true"
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="relative flex min-h-[240px] flex-col gap-3 rounded-[3px] border border-white/[0.07] bg-black/50 p-5"
    >
      <p className="mb-1 font-mono text-[10px] tracking-[0.16em] text-white/35">{label}</p>
      {children}
    </motion.div>
  );
}

const rows = [
  { title: 'GLOBAL AI CHALLENGE', meta: 'AI × FINTECH · 24H', status: 'active' as const },
  { title: 'SECURE BY DESIGN', meta: 'SECURITY · 36H', status: 'closing' as const },
  { title: 'HEALTHCARE FUTURES', meta: 'HEALTH · 36H', status: 'upcoming' as const },
];

export function Discover() {
  return (
    <Frame label="HACKATHONS / DISCOVER">
      {rows.map((r) => (
        <motion.div
          key={r.title}
          variants={rise}
          className="flex items-center justify-between gap-3 rounded-[2px] border border-white/[0.08] px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-[0.1em] text-white">{r.title}</p>
            <p className="mt-1 font-mono text-[10px] text-white/45">{r.meta}</p>
          </div>
          <Tag status={r.status} size="sm">
            {r.status === 'closing' ? 'Closing' : r.status}
          </Tag>
        </motion.div>
      ))}
    </Frame>
  );
}

const roles = ['AI ENGINEER', 'FRONTEND', 'UI/UX'];

export function TeamUp() {
  return (
    <Frame label="TEAM / QUANTUM CODERS">
      <motion.div variants={rise} className="flex items-center gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { backgroundColor: 'rgba(255,255,255,0)' },
              show: {
                backgroundColor: 'rgba(255,255,255,0.85)',
                transition: { delay: 0.5 + i * 0.35, duration: 0.4 },
              },
            }}
            className="h-10 flex-1 rounded-[2px] border border-white/25"
          />
        ))}
      </motion.div>
      <motion.p variants={rise} className="font-mono text-[10px] tracking-[0.14em] text-white/45">
        LOOKING FOR
      </motion.p>
      <div className="flex flex-wrap gap-1.5">
        {roles.map((r) => (
          <motion.span key={r} variants={rise}>
            <Tag size="sm">{r}</Tag>
          </motion.span>
        ))}
      </div>
      <motion.p variants={rise} className="mt-auto font-mono text-[11px] text-success">
        ● TEAM COMPLETE — 4/4
      </motion.p>
    </Frame>
  );
}

const commits = [
  ['a41f', 'feat: model inference endpoint'],
  ['9c02', 'feat: realtime dashboard'],
  ['e7b3', 'fix: auth token refresh'],
  ['12de', 'chore: deploy to production'],
];

export function Build() {
  return (
    <Frame label="REPO / MAIN">
      {commits.map(([hash, msg], i) => (
        <motion.p key={hash} variants={rise} className="flex gap-3 font-mono text-[11px] leading-relaxed">
          <span className="text-white/35">{hash}</span>
          <span className={cn(i === commits.length - 1 ? 'text-success' : 'text-white/75')}>{msg}</span>
        </motion.p>
      ))}
      <motion.div variants={rise} className="mt-auto flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10">
          <motion.span
            className="block h-px origin-left bg-white/70"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.6, ease, delay: 0.4 } } }}
          />
        </span>
        <span className="font-mono text-[10px] text-white/45">BUILD PASSING</span>
      </motion.div>
    </Frame>
  );
}

export function Showcase() {
  return (
    <Frame label="PROJECTS / FEATURED">
      <motion.div variants={rise} className="flex flex-1 flex-col rounded-[2px] border border-white/15 bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/40">PROJECT 047</span>
          <motion.span
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1, transition: { delay: 0.9, duration: 0.4, ease } },
            }}
          >
            <Tag tone="inverse" size="sm">
              Winner
            </Tag>
          </motion.span>
        </div>
        <p className="mt-5 font-display text-sm tracking-[0.06em] text-white">AURA HEALTH</p>
        <p className="mt-1 text-xs text-white/55">Digital twin healthcare platform</p>
        <p className="mt-auto pt-4 font-mono text-[10px] text-white/45">→ INCUBATION · SEED FUNDING</p>
      </motion.div>
    </Frame>
  );
}
