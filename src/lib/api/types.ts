/**
 * API contract shared with the backend team.
 * Field names mirror the PostgreSQL schema (snake_case) so responses map 1:1.
 */

export type EventCategory = 'hackathon' | 'placement' | 'workshop';
export type EventType = 'virtual' | 'in_person' | 'hybrid' | 'pan_india';

export interface Event {
  id: string;
  title: string;
  slug: string;
  short_summary: string;
  detailed_description: string;
  banner_image_url: string;
  devnovate_registration_url: string;
  category: EventCategory;
  event_type: EventType;
  location: string;
  /** ISO 8601 */
  start_date: string;
  /** ISO 8601 */
  end_date: string;
  is_featured: boolean;

  // ---- Product-listing fields (optional until the backend ships them; cards hide what is missing) ----
  /** Tracks / themes, e.g. ['AI', 'FINTECH']. */
  tags?: string[];
  duration_hours?: number;
  team_size_min?: number;
  team_size_max?: number;
  participants_count?: number;
  /** Total prize pool in rupees (integer). */
  prize_pool_inr?: number;
}

/** Icon names the frontend knows how to render — see components/ui/Icon.tsx. */
export type ServiceIconName =
  | 'TerminalSquare'
  | 'Building2'
  | 'Megaphone'
  | 'CalendarDays'
  | 'Rocket'
  | 'CircleDollarSign'
  | 'Users'
  | 'Briefcase'
  | 'Handshake'
  | 'Gift'
  | 'GraduationCap';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIconName;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface AdCampaign {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  target_page: string;
  scroll_threshold_percent: number;
}

export interface ServiceInquiry {
  client_name: string;
  organization_name: string;
  organization_type?: string;
  email: string;
  phone?: string;
  service_type: string;
  budget_range?: string;
  message?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface ConversionPayload {
  source: string;
  medium: string;
  campaign?: string;
}

export interface MutationResult {
  success: boolean;
  message?: string;
}

/** Community project that came out of a hackathon. */
export interface Project {
  id: string;
  /** Display number, e.g. 47 → "PROJECT 047". */
  number: number;
  slug: string;
  title: string;
  tagline: string;
  description?: string;
  /** Domains, e.g. ['AI', 'HEALTHCARE']. */
  categories: string[];
  /** Tech stack, e.g. ['FASTAPI', 'REACT']. */
  tech: string[];
  team_name: string;
  hackathon_title?: string;
  /** e.g. 'WINNER', 'FINALIST'. */
  award?: string;
}

/** Public builder profile. */
export interface Builder {
  id: string;
  name: string;
  handle: string;
  /** e.g. 'AI / FULL STACK'. */
  role: string;
  stack: string[];
  hackathons_count: number;
  projects_count: number;
  city?: string;
  open_to_team: boolean;
}

/** A team looking for members for a hackathon. */
export interface TeamOpening {
  id: string;
  team_name: string;
  hackathon_title: string;
  /** Roles wanted, e.g. ['AI ENGINEER', 'UI/UX DESIGNER']. */
  roles: string[];
  members_count: number;
  team_size: number;
}

/** Platform-wide totals for the stats band. */
export interface PlatformStats {
  builders: number;
  hackathons: number;
  projects: number;
  countries: number;
  submissions: number;
}

export type ActivityType = 'submission' | 'team_formed' | 'award' | 'hackathon_launched';

/** One line of the community activity ticker. */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  /** Who did it (builder or team name). */
  actor: string;
  /** What it was about (project or hackathon title). */
  target: string;
  /** ISO 8601 */
  created_at: string;
}
