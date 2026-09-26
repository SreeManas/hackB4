import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { GlitchCode } from '@/components/ui/GlitchCode';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const suggestions = [
  { label: 'Upcoming events', to: '/events' },
  { label: 'Our services', to: '/services' },
  { label: 'Contact us', to: '/contact' },
];

export default function NotFoundPage() {
  useDocumentMeta({ title: 'Page not found', noindex: true });

  return (
    <PageTransition>
      <div className="flex min-h-[80vh] items-center justify-center px-8 text-center">
        <div className="max-w-[600px]">
          <GlitchCode code="404" />

          <h1 className="mt-8 mb-4 text-2xl tracking-[0.2em] sm:text-3xl">
            <span className="sr-only">404 — </span>SYSTEM MALFUNCTION
          </h1>
          <p className="mb-12 text-lg leading-relaxed text-muted">
            The sector you're looking for has been moved, deleted, or possibly never existed.
          </p>
          <Button to="/">/ RETURN TO BASE</Button>

          <nav aria-label="Suggested pages" className="mt-12">
            <p className="mb-4 text-xs tracking-[0.2em] text-faint">OR TRY</p>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {suggestions.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-muted underline-offset-4 hover:text-white hover:underline">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </PageTransition>
  );
}
