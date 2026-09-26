import { useEffect, useRef, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/toast-context';
import { useSubmit } from '@/hooks/useSubmit';
import { api } from '@/lib/api';
import { contact, footer, site, socialLinks } from '@/content/site';

const linkClass = 'text-sm text-white/60 transition-colors hover:text-white';

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-6 text-xs font-semibold tracking-[0.15em] text-white">{title}</h2>
      <ul className="flex flex-col gap-4">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black px-4 pt-20 pb-[env(safe-area-inset-bottom)] sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex max-w-[420px] flex-col gap-8">
          <Link to="/" className="inline-block self-start text-4xl text-white">
            <BrandLogo />
          </Link>
          <p className="text-sm leading-relaxed text-white/60">{footer.blurb}</p>
          <Newsletter />
        </div>

        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
          <Column title="PLATFORM">
            {footer.platform.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="SERVICES">
            {footer.services.map((label) => (
              <li key={label}>
                <Link to="/services" className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="inline-flex items-center gap-1 text-sm text-white hover:underline">
                All 11 services <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
          </Column>
          <Column title="CONNECT">
            <li>
              <a href={`mailto:${contact.email}`} className={`${linkClass} inline-flex items-center gap-2`}>
                <Mail size={14} aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <Phone size={14} aria-hidden="true" />
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-3 pt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
                >
                  <SocialIcon name={s.icon} size={16} />
                </a>
              ))}
            </li>
          </Column>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1400px] flex-col gap-4 border-t border-line py-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between sm:pr-20">
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <ul className="flex gap-8">
          {footer.legal.map((l) => (
            <li key={l.label}>
              {l.to ? (
                <Link to={l.to} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              ) : (
                l.label
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

const subscribeFromFooter = (email: string) => api.subscribeNewsletter(email, 'footer');

function Newsletter() {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { submit, status, error, isSubmitting } = useSubmit(subscribeFromFooter);

  useEffect(() => {
    if (status === 'success') {
      formRef.current?.reset();
      toast.success("You're subscribed", 'We’ll email you when new events go live.');
    } else if (status === 'error') {
      toast.error('Could not subscribe', error ?? undefined);
    }
  }, [status, error, toast]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(String(new FormData(e.currentTarget).get('email') ?? '').trim());
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} aria-labelledby="newsletter-title">
      <p id="newsletter-title" className="mb-2 text-xs font-semibold tracking-[0.15em] text-white">
        {footer.newsletter.title}
      </p>
      <p className="mb-4 text-sm text-white/50">{footer.newsletter.text}</p>
      <div className="flex rounded-full border border-white/15 bg-white/5 p-1 focus-within:border-white/50">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="you@college.edu"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-60"
        >
          {isSubmitting ? <Spinner size="sm" /> : <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}
