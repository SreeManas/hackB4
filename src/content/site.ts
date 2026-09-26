/**
 * Site-wide content & configuration. Keep user-facing copy here (not in JSX) so it can be
 * edited in one place and later moved to a CMS or translation files without touching components.
 */
export const site = {
  name: 'HACKB4',
  tagline: 'NO BORDERS JUST BUILDERS',
  description:
    'HACKB4 is a global builder community running hackathons, placement drives, workshops and open-source sprints for students, startups and enterprises.',
  ogImage: '/og-image.jpg',
  locale: 'en_US',
} as const;

export const navLinks = [
  { label: 'HOME', to: '/' },
  { label: 'EVENTS', to: '/events' },
  { label: 'SERVICES', to: '/services' },
  { label: 'TEAM', to: '/our-team' },
  { label: 'CONTACT', to: '/contact' },
] as const;

export const contact = {
  email: 'info@hackb4.com',
  phone: '+91 7799776199',
  // TODO(content): confirm HQ — the phone is Indian but the address says San Francisco.
  headquarters: ['San Francisco, CA', 'Virtual Worldwide'],
} as const;

/** Navbar account actions. Accounts aren't live yet, so both open the early-access modal (decision D4). */
export const navAccount = { join: 'JOIN HACKB4', login: 'LOGIN' } as const;

export type SocialIcon = 'x' | 'discord' | 'linkedin' | 'instagram';

export const socialLinks: ReadonlyArray<{ label: string; href: string; icon: SocialIcon }> = [
  // TODO(content): replace with the real HACKB4 profile URLs.
  { label: 'Twitter / X', href: 'https://twitter.com', icon: 'x' },
  { label: 'Discord', href: 'https://discord.com', icon: 'discord' },
];

export const footer = {
  blurb:
    'A global collective of creators, dreamers, and engineers redefining the future of technology through borderless innovation.',
  platform: [
    { label: 'Events', to: '/events' },
    { label: 'Services', to: '/services' },
    { label: 'Our Team', to: '/our-team' },
    { label: 'Contact', to: '/contact' },
  ],
  /** Most-requested services; the full list of 11 lives on /services. */
  services: ['Hackathons', 'Corporate Hackathons', 'Startup Incubation', 'Placement Drives', 'Sponsorship'],
  newsletter: {
    title: 'STAY IN THE LOOP',
    text: 'New hackathons, placement drives and workshops — straight to your inbox. No spam.',
  },
  // Pages are built in Phase 5 (Legal). Entries without `to` render as plain text until then.
  legal: [{ label: 'Privacy Policy' }, { label: 'Terms of Service' }] as ReadonlyArray<{ label: string; to?: string }>,
} as const;
