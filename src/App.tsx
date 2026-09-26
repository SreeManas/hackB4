import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { routes } from '@/app/routes';
import { SmoothScrollProvider } from '@/app/providers/SmoothScroll';
import { scrollToTop, useLenis } from '@/app/providers/lenis';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { Footer } from '@/components/layout/Footer';
import { GlobalBackground } from '@/components/layout/GlobalBackground';
import { Navbar } from '@/components/layout/Navbar';
import { BackToTop, ScrollProgress } from '@/components/layout/ScrollUI';
import { ToastProvider } from '@/components/ui/Toast';
import { ComingSoonProvider } from '@/components/product/ComingSoonProvider';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { queryClient } from '@/lib/api/queries';

function AnimatedRoutes() {
  const location = useLocation();
  const lenis = useLenis();

  return (
    // Scroll resets once the old page has animated out, so the new page always starts at the top.
    <AnimatePresence mode="wait" onExitComplete={() => scrollToTop(lenis)}>
      {/* Keyed by path: a new page gets a fresh boundary, so an error on one page is cleared by navigating. */}
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary variant="fullscreen">
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <SmoothScrollProvider>
              <ToastProvider>
                <ComingSoonProvider>
                  <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
                  >
                    Skip to content
                  </a>
                  <ScrollProgress />
                  <CustomCursor />
                  <GlobalBackground />
                  <Navbar />
                  <AnimatedRoutes />
                  <Footer />
                  <BackToTop />
                  <OfflineBanner />
                </ComingSoonProvider>
              </ToastProvider>
            </SmoothScrollProvider>
          </BrowserRouter>
        </MotionConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
