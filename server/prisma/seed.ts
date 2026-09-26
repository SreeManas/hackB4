/**
 * Idempotent seed: company-approved real content only.
 *
 * Source: the frontend mocks `mockServices` and `mockTeam`
 * (src/lib/api/mocks/data.ts). Everything else in the mocks (events, hackathons,
 * ad campaign, projects, builders, team openings, stats, activity) is
 * fictional placeholder data and is intentionally NOT seeded.
 *
 * Idempotency
 * - services: upsert on the unique `title`; a re-run rewrites description/icon/sort_order.
 * - team_members: no natural unique key in the schema, so each row has a fixed
 *   UUID and is upserted on `id`.
 * - sort_order follows the source array order (1-based).
 */
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const services = [
  {
    id: '5e7a0000-0000-4000-8000-000000000001',
    title: 'Hackathons',
    description: 'End-to-end hackathon management, problem statement curation, judging platforms, and live support.',
    icon: 'TerminalSquare',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000002',
    title: 'Corporate Hackathons Organization',
    description: 'Bespoke innovation and hiring challenges tailored for tech enterprises.',
    icon: 'Building2',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000003',
    title: 'Digital Marketing',
    description: 'Pan-India campus outreach, digital community amplification, and targeted student marketing.',
    icon: 'Megaphone',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000004',
    title: 'Organizing Events',
    description: 'Turnkey technical event management, logistics, audio-visual setup, and execution.',
    icon: 'CalendarDays',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000005',
    title: 'Startup Incubation',
    description: 'Mentorship programs, prototype acceleration, and pitch readiness.',
    icon: 'Rocket',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000006',
    title: 'Providing Funding',
    description: 'Connecting vetted startup ideas with angel investors, seed grants, and venture networks.',
    icon: 'CircleDollarSign',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000007',
    title: 'Mentors from Working Professionals',
    description: 'On-demand access to senior engineers and corporate mentors.',
    icon: 'Users',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000008',
    title: 'Internships',
    description: 'Direct placement pipelines connecting hackathon performers with verified startup internships.',
    icon: 'Briefcase',
  },
  {
    id: '5e7a0000-0000-4000-8000-000000000009',
    title: 'Sponsorship',
    description: 'Facilitating brand sponsorships and monetary partnerships for student clubs and colleges.',
    icon: 'Handshake',
  },
  {
    id: '5e7a0000-0000-4000-8000-00000000000a',
    title: 'Goodies & Swag',
    description: 'Custom event t-shirts, badges, stickers, and kit production with pan-India delivery.',
    icon: 'Gift',
  },
  {
    id: '5e7a0000-0000-4000-8000-00000000000b',
    title: 'Placement Drives',
    description: 'Comprehensive recruitment drives, screening tests, and campus placement drives across colleges.',
    icon: 'GraduationCap',
  },
];

const teamMembers = [
  {
    id: '7ea40000-0000-4000-8000-000000000001',
    name: 'Veerapaneni Yashwanth Kumar Chowdary',
    role: 'CEO',
    image: '/assets/team/yashwanth.webp',
  },
  {
    id: '7ea40000-0000-4000-8000-000000000002',
    name: 'Bitla Joshmitha',
    role: 'C.O.O',
    image: '/assets/team/joshmitha.webp',
  },
  {
    id: '7ea40000-0000-4000-8000-000000000003',
    name: 'Telugu Rakesh',
    role: 'C.T.O',
    image: '/assets/team/rakesh.webp',
  },
  {
    id: '7ea40000-0000-4000-8000-000000000004',
    name: 'Panuganti Mythri Sree',
    role: 'Resources Manager',
    image: '/assets/team/mythri.webp',
  },
];

async function main() {
  for (const [i, { id, ...data }] of services.entries()) {
    await prisma.service.upsert({
      where: { title: data.title },
      create: { id, ...data, sortOrder: i + 1 },
      update: { ...data, sortOrder: i + 1 },
    });
  }

  for (const [i, { id, ...data }] of teamMembers.entries()) {
    await prisma.teamMember.upsert({
      where: { id },
      create: { id, ...data, sortOrder: i + 1 },
      update: { ...data, sortOrder: i + 1 },
    });
  }

  const [serviceCount, teamCount] = await Promise.all([prisma.service.count(), prisma.teamMember.count()]);
  console.log(`Seed complete: ${serviceCount} services, ${teamCount} team members in the database.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
