import { useCallback, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SuccessState } from '@/components/ui/States';
import { Tag } from '@/components/ui/Tag';
import { useSubmit } from '@/hooks/useSubmit';
import { api } from '@/lib/api';
import { ComingSoonContext, type UpcomingFeature } from './coming-soon-context';

const copy: Record<UpcomingFeature, { title: string; text: string }> = {
  projects: {
    title: 'Project pages are coming',
    text: 'Explore everything built at HACKB4 hackathons — the idea, the stack and the team behind it.',
  },
  builders: {
    title: 'Builder profiles are coming',
    text: 'A professional profile for your hackathons, projects and stack — so the right teams can find you.',
  },
  teams: {
    title: 'Team finder is coming',
    text: 'Find teammates by role and hackathon, or post the roles your team still needs.',
  },
  account: {
    title: 'HACKB4 accounts are coming',
    text: 'One account for hackathons, teams, projects and your builder profile.',
  },
};

/**
 * "Early access" modal for features that aren't live yet (D4 decision: collect interest instead of
 * dead links). Emails go to the newsletter list. Mount once near the app root.
 */
export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const [feature, setFeature] = useState<UpcomingFeature | null>(null);
  const close = useCallback(() => setFeature(null), []);

  return (
    <ComingSoonContext.Provider value={setFeature}>
      {children}
      <Modal
        open={!!feature}
        onClose={close}
        title={feature ? copy[feature].title : 'Early access'}
        className="rounded-[4px] p-8 sm:p-12"
      >
        {/* Keyed so each open starts with a fresh form. */}
        {feature && <EarlyAccessForm key={feature} feature={feature} />}
      </Modal>
    </ComingSoonContext.Provider>
  );
}

function EarlyAccessForm({ feature }: { feature: UpcomingFeature }) {
  const subscribe = useCallback(
    (email: string) => api.subscribeNewsletter(email, `early_access:${feature}`),
    [feature],
  );
  const { submit, isSubmitting, isSuccess, error } = useSubmit(subscribe);
  const { title, text } = copy[feature];

  if (isSuccess) {
    return <SuccessState title="You're on the list" message="We'll email you the moment it goes live." />;
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(String(new FormData(e.currentTarget).get('email') ?? '').trim());
  };

  return (
    <div>
      <Tag status="upcoming" size="sm">
        Early access
      </Tag>
      <p className="mt-6 font-display text-xl leading-snug tracking-[0.06em] uppercase sm:text-2xl">{title}</p>
      <p className="mt-4 max-w-md leading-relaxed text-muted">{text}</p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="you@college.edu"
          error={error ?? undefined}
        />
        <Button type="submit" variant="primary" arrow loading={isSubmitting} fullWidth>
          Get early access
        </Button>
      </form>
    </div>
  );
}
