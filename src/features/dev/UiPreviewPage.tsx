import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Checkbox, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState, ErrorState, SuccessState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { Tag, TagList } from '@/components/ui/Tag';
import { useToast } from '@/components/ui/toast-context';
import { FadeIn } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { BuilderCard } from '@/components/product/BuilderCard';
import { HackathonCard } from '@/components/product/HackathonCard';
import { ProjectCard } from '@/components/product/ProjectCard';
import { StatBlock } from '@/components/product/StatBlock';
import { TeamOpeningCard } from '@/components/product/TeamOpeningCard';
import { useComingSoon } from '@/components/product/coming-soon-context';
import {
  useEvents,
  useFeaturedBuilders,
  useFeaturedProjects,
  usePlatformStats,
  useTeamOpenings,
} from '@/lib/api/queries';
import type { Event } from '@/lib/api/types';
import { getEventStatus, type EventStatus } from '@/lib/event-status';

/** Development-only gallery of the design system + product layer (route: /dev/ui). */
export default function UiPreviewPage() {
  const toast = useToast();
  const openComingSoon = useComingSoon();
  const [page, setPage] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crash, setCrash] = useState(false);
  if (crash)
    throw new Error('Test crash from /dev/ui — the page error screen should appear, with the navbar still working.');

  const fakeSubmit = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.success('Inquiry sent', 'Our team will get back to you shortly.');
    }, 1200);
  };

  return (
    <main id="main" className="pt-32 pb-24">
      <Container size="xl" className="flex flex-col gap-24">
        <header>
          <Tag status="closing">Dev only</Tag>
          <h1 className="mt-4 font-display text-3xl uppercase">Design System</h1>
          <p className="mt-2 text-muted">
            UI foundation + product layer (H1). Not included in production builds. The background is the live site
            background.
          </p>
        </header>

        {/* ---------------- PRODUCT LAYER ---------------- */}

        <Section title="Stats">
          <StatsPreview />
        </Section>

        <Section title="Hackathon cards — tabs by status">
          <HackathonsPreview />
        </Section>

        <Section title="Project cards — feature + standard">
          <ProjectsPreview />
        </Section>

        <Section title="Builder cards + team openings">
          <PeoplePreview />
        </Section>

        {/* ---------------- FOUNDATION ---------------- */}

        <Section title="Buttons — hierarchy">
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary" arrow>
              Join HACKB4
            </Button>
            <Button variant="secondary">Explore hackathons</Button>
            <Button variant="tertiary" arrow>
              View projects
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" arrow magnetic>
              Large + magnetic
            </Button>
            <Button variant="secondary" size="sm" arrow>
              Small
            </Button>
            <Button variant="secondary" href="https://devnovate.com" arrow>
              External link
            </Button>
            <Button variant="primary" loading={loading} onClick={fakeSubmit}>
              {loading ? 'Submitting' : 'Loading + toast'}
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </Section>

        <Section title="Tags">
          <div className="flex flex-wrap gap-2">
            {['AI', 'Robotics', 'Cybersecurity', 'Fintech', 'Healthcare', 'Open innovation'].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag status="active">Active</Tag>
            <Tag status="upcoming">Upcoming</Tag>
            <Tag status="closing">Closing soon</Tag>
            <Tag status="completed">Completed</Tag>
            <Tag tone="inverse">Winner</Tag>
            <Tag tone="muted">Online</Tag>
            <Tag tone="muted">24 hours</Tag>
            <Tag tone="muted">Team event</Tag>
          </div>
          <TagList items={['React', 'FastAPI', 'PyTorch']} label="Tech stack" />
        </Section>

        <Section title="Early-access modal (Projects / Builders / Teams / Account)">
          <div className="flex flex-wrap gap-4">
            {(['projects', 'builders', 'teams', 'account'] as const).map((f) => (
              <Button key={f} size="sm" onClick={() => openComingSoon(f)}>
                {f}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Section heading">
          <SectionHeading
            eyebrow="/ 02 — Hackathons"
            title="Build something that matters."
            description="Discover active and upcoming hackathons across AI, fintech, robotics and more."
            action={
              <Button variant="tertiary" arrow>
                View all hackathons
              </Button>
            }
          />
        </Section>

        <Section title="Typography">
          <p className="font-display text-4xl uppercase">Display · Michroma</p>
          <p className="text-2xl font-light">Interface · Inter — navigation, cards, body text.</p>
          <p className="font-mono text-sm tracking-[0.06em] text-white/70">
            TECHNICAL · JETBRAINS MONO — 1,240 BUILDERS · ₹2L · 24H
          </p>
        </Section>

        <Section title="Colours">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['panel', 'bg-panel border border-line'],
              ['surface', 'bg-surface border border-line'],
              ['success · active', 'bg-success'],
              ['info · upcoming', 'bg-info'],
              ['warning · closing', 'bg-warning'],
              ['danger · errors', 'bg-danger'],
            ].map(([name, cls]) => (
              <div key={name}>
                <div className={`h-10 rounded-[3px] ${cls}`} />
                <p className="mt-2 font-mono text-[11px] text-muted">{name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Form fields">
          <form className="grid gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            <TextField label="Full name" name="name" required hint="As it should appear on certificates." />
            <TextField label="Email" name="email" type="email" required error="Enter a valid email address." />
            <SelectField
              label="Service"
              name="service"
              placeholder="Choose a service"
              options={[
                { value: 'hackathons', label: 'Hackathons' },
                { value: 'incubation', label: 'Startup Incubation' },
              ]}
            />
            <TextArea label="Message" name="message" />
            <Checkbox label="I agree to be contacted about this inquiry" name="consent" />
          </form>
        </Section>

        <Section title="Pagination">
          <Pagination page={page} pageCount={20} onChange={setPage} />
        </Section>

        <Section title="Toasts & modal">
          <div className="flex flex-wrap gap-4">
            <Button size="sm" onClick={() => toast.success('Saved', 'Your preferences were updated.')}>
              Success toast
            </Button>
            <Button size="sm" onClick={() => toast.error('Something went wrong', 'Please try again.')}>
              Error toast
            </Button>
            <Button size="sm" onClick={() => toast.info('New hackathon announced')}>
              Info toast
            </Button>
            <Button size="sm" variant="primary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
          </div>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example modal"
            className="rounded-[4px] p-10"
          >
            <p className="text-2xl font-light">Example modal</p>
            <p className="mt-2 text-muted">Escape, outside click or the X closes it. Focus is trapped inside.</p>
          </Modal>
        </Section>

        <Section title="Loading, empty, error, success">
          <div className="flex items-center gap-6">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" label="Loading events" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-40 rounded-[4px]" />
            <Skeleton className="h-40 rounded-[4px]" />
            <Skeleton className="h-40 rounded-[4px]" />
          </div>
          <EmptyState
            title="No hackathons match your filters"
            message="Try another track or clear your search."
            action={<Button size="sm">Clear filters</Button>}
          />
          <ErrorState onRetry={() => toast.info('Retrying…')} />
          <Card>
            <SuccessState title="Inquiry sent" message="Our team will get back to you shortly." />
          </Card>
        </Section>

        <Section title="Motion">
          <Stagger className="grid gap-4 sm:grid-cols-4">
            {['One', 'Two', 'Three', 'Four'].map((t) => (
              <StaggerItem key={t}>
                <Card>Stagger {t}</Card>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn>
            <Card>FadeIn block</Card>
          </FadeIn>
        </Section>

        <Section title="Error screen">
          <div>
            <Button size="sm" onClick={() => setCrash(true)}>
              Crash this page
            </Button>
          </div>
        </Section>
      </Container>
    </main>
  );
}

function StatsPreview() {
  const { data } = usePlatformStats();
  if (!data) return <Skeleton className="h-24" />;
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
      <StatBlock value={data.builders} label="Builders" />
      <StatBlock value={data.hackathons} label="Hackathons" />
      <StatBlock value={data.projects} label="Projects" />
      <StatBlock value={data.countries} label="Countries" suffix="" />
      <StatBlock value={data.submissions} label="Submissions" />
    </div>
  );
}

const statusTabs: { id: EventStatus; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

function HackathonsPreview() {
  const { data = [], isLoading } = useEvents('hackathon');
  const byStatus = (s: EventStatus) => data.filter((e: Event) => getEventStatus(e) === s);
  if (isLoading) return <Skeleton className="h-80" />;
  return (
    <Tabs
      label="Hackathons by status"
      items={statusTabs.map((t) => {
        const list = byStatus(t.id);
        return {
          ...t,
          count: list.length,
          content: (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {list.map((e) => (
                <HackathonCard key={e.id} event={e} />
              ))}
            </div>
          ),
        };
      })}
    />
  );
}

function ProjectsPreview() {
  const { data } = useFeaturedProjects();
  if (!data?.length) return <Skeleton className="h-96" />;
  const [first, ...rest] = data;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <ProjectCard project={first} feature />
      <div className="grid gap-5">
        {rest.slice(0, 2).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

function PeoplePreview() {
  const builders = useFeaturedBuilders().data;
  const openings = useTeamOpenings().data;
  if (!builders || !openings) return <Skeleton className="h-96" />;
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="grid gap-5 sm:grid-cols-2">
        {builders.map((b) => (
          <BuilderCard key={b.id} builder={b} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[11px] tracking-[0.14em] text-white/50">FIND YOUR TEAM</p>
        {openings.map((o) => (
          <TeamOpeningCard key={o.id} opening={o} />
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="border-b border-line pb-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}
