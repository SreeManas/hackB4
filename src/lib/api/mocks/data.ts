import type { AdCampaign, Event, Service, TeamMember } from '../types';
import { mockHackathons } from './product';

const DAY = 1000 * 60 * 60 * 24;
const fromNow = (days: number) => new Date(Date.now() + DAY * days).toISOString();

export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'Global Web3 Hackathon',
    slug: 'global-web3-hackathon',
    short_summary: 'Build the next generation of decentralized applications.',
    detailed_description:
      'Join thousands of builders globally to innovate on Web3 technologies. This hackathon features top-tier judges, massive bounties, and direct mentorship from industry leaders.',
    banner_image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
    devnovate_registration_url: 'https://devnovate.com/register/global-web3',
    category: 'hackathon',
    event_type: 'virtual',
    location: 'Global (Online)',
    start_date: fromNow(14),
    end_date: fromNow(17),
    is_featured: true,
  },
  {
    id: 'evt-002',
    title: 'AI Innovators Placement Drive',
    slug: 'ai-innovators-placement',
    short_summary: 'Exclusive placement drive for top AI and ML talent.',
    detailed_description:
      'Connect with leading AI startups and enterprises looking to hire immediately. Open to all students and fresh graduates with a strong portfolio in machine learning and data science.',
    banner_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    devnovate_registration_url: 'https://devnovate.com/register/ai-placement',
    category: 'placement',
    event_type: 'pan_india',
    location: 'Bangalore / Virtual',
    start_date: fromNow(30),
    end_date: fromNow(32),
    is_featured: true,
  },
  {
    id: 'evt-003',
    title: 'Open Source Contribution Sprint',
    slug: 'open-source-sprint',
    short_summary: 'Contribute to core open source projects and win swag.',
    detailed_description:
      'A month-long sprint focused on making meaningful contributions to open-source protocols. Mentors will be available to help beginners make their first pull requests.',
    banner_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    devnovate_registration_url: 'https://devnovate.com/register/oss-sprint',
    category: 'workshop',
    event_type: 'virtual',
    location: 'Online',
    start_date: fromNow(5),
    end_date: fromNow(35),
    is_featured: false,
  },
  ...mockHackathons,
];

export const mockServices: Service[] = [
  {
    id: 'srv-01',
    title: 'Hackathons',
    description: 'End-to-end hackathon management, problem statement curation, judging platforms, and live support.',
    icon: 'TerminalSquare',
  },
  {
    id: 'srv-02',
    title: 'Corporate Hackathons Organization',
    description: 'Bespoke innovation and hiring challenges tailored for tech enterprises.',
    icon: 'Building2',
  },
  {
    id: 'srv-03',
    title: 'Digital Marketing',
    description: 'Pan-India campus outreach, digital community amplification, and targeted student marketing.',
    icon: 'Megaphone',
  },
  {
    id: 'srv-04',
    title: 'Organizing Events',
    description: 'Turnkey technical event management, logistics, audio-visual setup, and execution.',
    icon: 'CalendarDays',
  },
  {
    id: 'srv-05',
    title: 'Startup Incubation',
    description: 'Mentorship programs, prototype acceleration, and pitch readiness.',
    icon: 'Rocket',
  },
  {
    id: 'srv-06',
    title: 'Providing Funding',
    description: 'Connecting vetted startup ideas with angel investors, seed grants, and venture networks.',
    icon: 'CircleDollarSign',
  },
  {
    id: 'srv-07',
    title: 'Mentors from Working Professionals',
    description: 'On-demand access to senior engineers and corporate mentors.',
    icon: 'Users',
  },
  {
    id: 'srv-08',
    title: 'Internships',
    description: 'Direct placement pipelines connecting hackathon performers with verified startup internships.',
    icon: 'Briefcase',
  },
  {
    id: 'srv-09',
    title: 'Sponsorship',
    description: 'Facilitating brand sponsorships and monetary partnerships for student clubs and colleges.',
    icon: 'Handshake',
  },
  {
    id: 'srv-10',
    title: 'Goodies & Swag',
    description: 'Custom event t-shirts, badges, stickers, and kit production with pan-India delivery.',
    icon: 'Gift',
  },
  {
    id: 'srv-11',
    title: 'Placement Drives',
    description: 'Comprehensive recruitment drives, screening tests, and campus placement drives across colleges.',
    icon: 'GraduationCap',
  },
];

export const mockTeam: TeamMember[] = [
  { id: 'team-01', name: 'Veerapaneni Yashwanth Kumar Chowdary', role: 'CEO', image: '/assets/team/yashwanth.webp' },
  { id: 'team-02', name: 'Bitla Joshmitha', role: 'C.O.O', image: '/assets/team/joshmitha.webp' },
  { id: 'team-03', name: 'Telugu Rakesh', role: 'C.T.O', image: '/assets/team/rakesh.webp' },
  { id: 'team-04', name: 'Panuganti Mythri Sree', role: 'Resources Manager', image: '/assets/team/mythri.webp' },
];

export const mockAdCampaign: AdCampaign = {
  id: 'ad-001',
  title: 'Join the Next Gen Builders Cohort',
  image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  destination_url: 'https://devnovate.com/cohort',
  target_page: '/events',
  scroll_threshold_percent: 50,
};
