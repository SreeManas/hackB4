/** Home page copy. Section ids double as anchor targets for the Explore words and the section rail. */

export const sectionIds = {
  explore: 'explore',
  platform: 'platform',
  hackathons: 'hackathons',
  process: 'how-it-works',
  projects: 'projects',
  people: 'people',
  tech: 'tech',
  community: 'community',
  organizations: 'organizations',
} as const;

/** Left-edge section rail (large screens). */
export const railItems = [
  { id: sectionIds.explore, label: 'Explore' },
  { id: sectionIds.hackathons, label: 'Hackathons' },
  { id: sectionIds.process, label: 'Process' },
  { id: sectionIds.projects, label: 'Projects' },
  { id: sectionIds.people, label: 'People' },
  { id: sectionIds.tech, label: 'Tech' },
  { id: sectionIds.community, label: 'Community' },
  { id: sectionIds.organizations, label: 'Partner' },
] as const;

export const hero = {
  corners: {
    topLeft: ['IDEAS', 'PEOPLE', 'TECH', 'IMPACT'],
    topRight: ['EXPLORE', 'BUILD', 'BELONG'],
    bottomLeft: ['A GLOBAL', 'BUILDER', 'COMMUNITY'],
    bottomRight: ['CREATE', 'COLLABORATE', 'INNOVATE', 'REPEAT'],
  },
  headline: 'IDEAS. PEOPLE. TECH.',
  statement:
    'A global platform where builders discover hackathons, form teams, build ideas and create what comes next.',
  primary: { label: 'Explore hackathons', to: '/events' },
  secondary: { label: 'Explore platform' },
};

export const marqueeItems = ['AI', 'FINTECH', 'ROBOTICS', 'CYBERSECURITY', 'HEALTHCARE', 'CLIMATE', 'OPEN INNOVATION'];

export const explore = {
  eyebrow: '01 // EXPLORE',
  /** Each word answers one question and jumps to the section that answers it. */
  words: [
    { word: 'IDEAS', question: 'What can I build?', target: sectionIds.hackathons },
    { word: 'PEOPLE', question: 'Who can I build with?', target: sectionIds.people },
    { word: 'TECH', question: 'What can I build with?', target: sectionIds.tech },
    { word: 'IMPACT', question: 'What came out of it?', target: sectionIds.projects },
  ],
};

export const stats = {
  lead: 'One platform for the whole journey — from the first idea to the team, the build and what happens after.',
  // TODO(content): labels match PlatformStats; numbers come from the API (placeholders in mocks).
  items: [
    { key: 'builders', label: 'Builders', suffix: '+' },
    { key: 'hackathons', label: 'Hackathons', suffix: '+' },
    { key: 'projects', label: 'Projects', suffix: '+' },
    { key: 'countries', label: 'Countries', suffix: '' },
    { key: 'submissions', label: 'Submissions', suffix: '+' },
  ],
} as const;

export const hackathons = {
  eyebrow: '02 // HACKATHONS',
  title: 'Build something that matters.',
  description: 'Active, upcoming and past hackathons across AI, fintech, robotics, security and more.',
  viewAll: { label: 'View all hackathons', to: '/events' },
  empty: {
    active: 'No hackathons are live right now — the next ones are under Upcoming.',
    upcoming: 'New hackathons are announced every month. Subscribe below to hear first.',
    completed: 'Past hackathons will appear here.',
  },
};

export const process = {
  eyebrow: '03 // HOW IT WORKS',
  title: 'From idea to impact, in four steps.',
  steps: [
    {
      tag: 'Discover',
      title: 'Find your challenge',
      text: 'Browse hackathons by track, format and prize. Every listing shows exactly what you’re signing up for.',
      link: { label: 'Explore hackathons', to: '/events' },
    },
    {
      tag: 'Team up',
      title: 'Build the right team',
      text: 'Post the roles you need or join a team that needs you — engineers, designers, founders and mentors.',
      link: { label: 'Find a team', feature: 'teams' },
    },
    {
      tag: 'Build',
      title: 'Ship something real',
      text: 'Mentors, APIs and cloud credits while you build. Judged on what works, not what’s promised.',
      link: { label: 'See the tools', anchor: 'tech' },
    },
    {
      tag: 'Showcase',
      title: 'Take it further',
      text: 'Projects live on after the hackathon — with incubation, funding and hiring paths for the best ones.',
      link: { label: 'View projects', anchor: 'projects' },
    },
  ],
} as const;

export const projects = {
  eyebrow: '04 // PROJECTS',
  title: 'From idea to impact.',
  description: 'What the community built — and kept building after the hackathon ended.',
  viewAll: 'View all projects',
  empty: 'Featured projects will appear here as the community ships them.',
};

export const people = {
  eyebrow: '05 // PEOPLE',
  title: 'Find the people to build with.',
  description: 'Developers, designers, founders and mentors — with the track record to prove it.',
  teamsTitle: 'Find your team',
  teamsText: 'Teams looking for members right now.',
  postTeam: 'Post your team',
  viewAll: 'Browse builders',
  emptyBuilders: 'Featured builder profiles will appear here soon.',
  emptyTeams: 'No teams are looking for members right now.',
};

export const tech = {
  eyebrow: '06 // TECH',
  title: 'Tools for builders.',
  description: 'Everything you need to go from zero to demo in a weekend.',
  rows: [
    {
      title: 'AI & Machine Learning',
      text: 'Model APIs, GPU credits and mentors who ship ML in production.',
      tags: ['LLMs', 'Vision', 'Speech', 'Agents'],
    },
    {
      title: 'APIs & Data',
      text: 'Curated public datasets and partner APIs, with keys issued for every hackathon.',
      tags: ['Payments', 'Maps', 'Open data', 'Health'],
    },
    {
      title: 'Cloud & Infrastructure',
      text: 'Deploy in minutes with credits for compute, databases and hosting.',
      tags: ['Compute', 'Serverless', 'Postgres', 'Storage'],
    },
    {
      title: 'Developer Resources',
      text: 'Starter kits, workshops and templates so you spend the weekend building, not configuring.',
      tags: ['Starter kits', 'Workshops', 'Templates', 'Docs'],
    },
  ],
  // TODO(content): technologies commonly used at HACKB4 events — not partnerships. Replace with partner logos when confirmed.
  stackLabel: 'Built with',
  stack: ['PYTHON', 'REACT', 'PYTORCH', 'NODE.JS', 'POSTGRES', 'KUBERNETES', 'FLUTTER', 'RUST', 'FASTAPI', 'NEXT.JS'],
};

export const community = {
  eyebrow: '07 // COMMUNITY',
  statement: 'A network of people building the future.',
  sub: 'A collective of creators, dreamers and engineers — across campuses, cities and countries.',
  activityLabel: 'Live on HACKB4',
};

export const organizations = {
  eyebrow: '08 // FOR ORGANIZATIONS',
  title: 'Bring HACKB4 to your organization.',
  description: 'Hackathons, hiring and innovation programmes — delivered across India.',
  columns: [
    {
      audience: 'Colleges',
      title: 'Host a hackathon',
      points: ['End-to-end event management', 'Problem statements & judging', 'Campus outreach'],
      service: 'Hackathons',
    },
    {
      audience: 'Corporates',
      title: 'Hire & innovate',
      points: ['Corporate hackathons', 'Placement drives', 'Innovation challenges'],
      service: 'Corporate Hackathons Organization',
    },
    {
      audience: 'Sponsors',
      title: 'Reach builders',
      points: ['Brand partnerships', 'Track & prize sponsorship', 'Developer relations'],
      service: 'Sponsorship',
    },
  ],
  allServices: { label: 'All 11 services', to: '/services' },
};

export const finalCta = {
  title: ['BUILD', 'WHAT’S', 'NEXT.'],
  primary: 'Join HACKB4',
  secondary: { label: 'Explore hackathons', to: '/events' },
};
