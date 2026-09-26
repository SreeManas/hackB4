import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { useComingSoon } from '@/components/product/coming-soon-context';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { useScrollLock } from '@/app/providers/lenis';
import { contact, navAccount, navLinks, socialLinks } from '@/content/site';
import { ease } from '@/components/motion/presets';
import { cn } from '@/lib/cn';

/** Past this scroll depth the bar hides on scroll-down and returns on scroll-up. */
const HIDE_AFTER = 400;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const openComingSoon = useComingSoon();
  useScrollLock(menuOpen);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 50);
    setHidden(y > HIDE_AFTER && y > prev);
  });

  // Close the menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden && !menuOpen ? '-100%' : 0 }}
        transition={{ duration: 0.5, ease }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color] duration-300',
          solid
            ? 'border-b border-white/10 bg-black/60 py-4 backdrop-blur-md'
            : 'border-b border-transparent py-6 sm:py-8',
        )}
      >
        <nav aria-label="Main" className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-8">
          <Link to="/" className="text-2xl text-white sm:text-[1.8rem]">
            <BrandLogo />
          </Link>

          <ul className="hidden gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  // Only Home needs an exact match; /events stays active on /events/:slug.
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group relative text-xs font-semibold tracking-[0.1em] transition-colors',
                      isActive ? 'text-white' : 'text-white/60 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute right-0 -bottom-2 left-0 h-px bg-white"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="absolute right-0 -bottom-2 left-0 h-px origin-left scale-x-0 bg-white/50 transition-transform duration-300 group-hover:scale-x-100"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-6 lg:flex">
              <button
                type="button"
                onClick={() => openComingSoon('account')}
                className="text-xs font-semibold tracking-[0.14em] text-white/60 transition-colors hover:text-white"
              >
                {navAccount.login}
              </button>
              <Button variant="secondary" size="sm" arrow onClick={() => openComingSoon('account')}>
                {navAccount.join}
              </Button>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="-mr-2 p-2 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed overlay inside the bar. */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            onNavigate={() => setMenuOpen(false)}
            onAccount={() => {
              setMenuOpen(false);
              openComingSoon('account');
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const list = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function MobileMenu({ onNavigate, onAccount }: { onNavigate: () => void; onAccount: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => firstLink.current?.focus(), []);

  return (
    <motion.div
      id="mobile-menu"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black/95 px-6 pt-28 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <motion.ul variants={list} initial="hidden" animate="show" className="flex flex-col">
        {navLinks.map((link, i) => (
          <motion.li key={link.to} variants={item} className="border-b border-white/10">
            <NavLink
              ref={i === 0 ? firstLink : undefined}
              to={link.to}
              end={link.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-baseline gap-4 py-5 font-display text-2xl tracking-[0.08em]',
                  isActive ? 'text-white' : 'text-white/50',
                )
              }
            >
              <span className="font-sans text-xs text-faint">0{i + 1}</span>
              {link.label}
            </NavLink>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div variants={item} initial="hidden" animate="show" className="mt-auto flex flex-col gap-6 pt-10">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onAccount} fullWidth>
            {navAccount.login}
          </Button>
          <Button variant="primary" arrow onClick={onAccount} fullWidth>
            {navAccount.join}
          </Button>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <a href={`mailto:${contact.email}`} className="hover:text-white">
            {contact.email}
          </a>
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="hover:text-white"
              >
                <SocialIcon name={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
