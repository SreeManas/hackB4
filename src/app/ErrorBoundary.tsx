import { Component, type ErrorInfo, type ReactNode } from 'react';
import { GlitchCode } from '@/components/ui/GlitchCode';

interface Props {
  children: ReactNode;
  /** `page`: fits inside the layout (nav + footer stay). `fullscreen`: last-resort app-level screen. */
  variant?: 'page' | 'fullscreen';
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors (incl. failed lazy chunk loads after a deploy) and offers recovery.
 * Used twice: around each route (so one broken page keeps the nav working) and around the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook point for Sentry / LogRocket etc.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return <ErrorScreen error={error} onRetry={this.reset} fullscreen={this.props.variant === 'fullscreen'} />;
  }
}

function ErrorScreen({ error, onRetry, fullscreen }: { error: Error; onRetry: () => void; fullscreen: boolean }) {
  const btn =
    'rounded-full border border-white/30 px-8 py-3 text-sm tracking-widest transition hover:bg-white hover:text-black';
  return (
    <main
      id="main"
      role="alert"
      className={`flex flex-col items-center justify-center gap-6 px-6 text-center ${fullscreen ? 'min-h-screen' : 'min-h-[80vh] pt-24'}`}
    >
      <GlitchCode code="500" />
      <h1 className="text-2xl font-light tracking-[0.2em] sm:text-3xl">
        <span className="sr-only">Error — </span>SOMETHING WENT WRONG
      </h1>
      <p className="max-w-md text-muted">
        An unexpected error occurred on our side. Try again, or head back to the home page.
      </p>
      {import.meta.env.DEV && (
        <pre className="max-w-full overflow-x-auto rounded-lg border border-danger/30 bg-danger/5 p-4 text-left text-xs text-danger">
          {error.message}
        </pre>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {/* Full reload: the app-level boundary sits outside the router, and a reload also fetches fresh chunks. */}
        <button type="button" onClick={fullscreen ? () => window.location.reload() : onRetry} className={btn}>
          TRY AGAIN
        </button>
        <a href="/" className={`${btn} bg-white text-black hover:bg-white/80`}>
          GO HOME
        </a>
      </div>
    </main>
  );
}
