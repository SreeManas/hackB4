import type { Activity, AdCampaign, Builder, Event, Project, Service, TeamMember, TeamOpening } from '@prisma/client';

/**
 * Explicit DB row -> API shape mappers. The API contract is snake_case and
 * never includes database-only fields (sort_order, timestamps, ...).
 * Types live here until more resources need a shared home.
 */
export interface ServiceDto {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMemberDto {
  id: string;
  name: string;
  role: string;
  image: string;
}

export const toServiceDto = (row: Service): ServiceDto => ({
  id: row.id,
  title: row.title,
  description: row.description,
  icon: row.icon,
});

export const toTeamMemberDto = (row: TeamMember): TeamMemberDto => ({
  id: row.id,
  name: row.name,
  role: row.role,
  image: row.image,
});

/**
 * Public event shape. Optional fields are omitted (not null) when unset, so the
 * frontend's `field?: T` types hold. `status` is deliberately absent: the
 * frontend derives it from start_date / end_date.
 */
export interface EventDto {
  id: string;
  title: string;
  slug: string;
  short_summary: string;
  detailed_description: string;
  banner_image_url: string;
  devnovate_registration_url: string;
  category: string;
  event_type: string;
  location: string;
  start_date: string;
  end_date: string;
  is_featured: boolean;
  tags?: string[];
  duration_hours?: number;
  team_size_min?: number;
  team_size_max?: number;
  participants_count?: number;
  prize_pool_inr?: number;
}

export const toEventDto = (row: Event): EventDto => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  short_summary: row.shortSummary,
  detailed_description: row.detailedDescription,
  banner_image_url: row.bannerImageUrl,
  devnovate_registration_url: row.devnovateRegistrationUrl,
  category: row.category,
  event_type: row.eventType,
  location: row.location,
  start_date: row.startDate.toISOString(),
  end_date: row.endDate.toISOString(),
  is_featured: row.isFeatured,
  // Prisma list columns can be NULL in this schema; an empty list means "not set".
  ...(row.tags?.length ? { tags: row.tags } : {}),
  ...(row.durationHours != null ? { duration_hours: row.durationHours } : {}),
  ...(row.teamSizeMin != null ? { team_size_min: row.teamSizeMin } : {}),
  ...(row.teamSizeMax != null ? { team_size_max: row.teamSizeMax } : {}),
  ...(row.participantsCount != null ? { participants_count: row.participantsCount } : {}),
  ...(row.prizePoolInr != null ? { prize_pool_inr: Number(row.prizePoolInr) } : {}),
});

export interface AdCampaignDto {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  target_page: string;
  scroll_threshold_percent: number;
}

export const toAdCampaignDto = (row: AdCampaign): AdCampaignDto => ({
  id: row.id,
  title: row.title,
  image_url: row.imageUrl,
  destination_url: row.destinationUrl,
  target_page: row.targetPage,
  scroll_threshold_percent: row.scrollThresholdPercent,
});

export interface ProjectDto {
  id: string;
  number: number;
  slug: string;
  title: string;
  tagline: string;
  description?: string;
  categories: string[];
  tech: string[];
  team_name: string;
  hackathon_title?: string;
  award?: string;
}

/** `hackathon_title` is the related event's title. */
export const toProjectDto = (row: Project & { event: Pick<Event, 'title'> | null }): ProjectDto => ({
  id: row.id,
  number: row.number,
  slug: row.slug,
  title: row.title,
  tagline: row.tagline,
  ...(row.description ? { description: row.description } : {}),
  categories: row.categories ?? [],
  tech: row.tech ?? [],
  team_name: row.teamName,
  ...(row.event ? { hackathon_title: row.event.title } : {}),
  ...(row.award ? { award: row.award } : {}),
});

export interface BuilderDto {
  id: string;
  name: string;
  handle: string;
  role: string;
  stack: string[];
  hackathons_count: number;
  projects_count: number;
  city?: string;
  open_to_team: boolean;
}

export const toBuilderDto = (row: Builder): BuilderDto => ({
  id: row.id,
  name: row.name,
  handle: row.handle,
  role: row.role,
  stack: row.stack ?? [],
  hackathons_count: row.hackathonsCount,
  projects_count: row.projectsCount,
  ...(row.city ? { city: row.city } : {}),
  open_to_team: row.openToTeam,
});

export interface TeamOpeningDto {
  id: string;
  team_name: string;
  hackathon_title: string;
  roles: string[];
  members_count: number;
  team_size: number;
}

/** `hackathon_title` is the related event's title. */
export const toTeamOpeningDto = (row: TeamOpening & { event: Pick<Event, 'title'> }): TeamOpeningDto => ({
  id: row.id,
  team_name: row.teamName,
  hackathon_title: row.event.title,
  roles: row.roles ?? [],
  members_count: row.membersCount,
  team_size: row.teamSize,
});

export interface ActivityDto {
  id: string;
  type: string;
  actor: string;
  target: string;
  created_at: string;
}

export const toActivityDto = (row: Activity): ActivityDto => ({
  id: row.id,
  type: row.type,
  actor: row.actor,
  target: row.target,
  created_at: row.createdAt.toISOString(),
});
