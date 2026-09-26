import { keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import { api } from './index';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});

/** Central query keys — keeps cache invalidation predictable as the app grows. */
export const queryKeys = {
  events: (category: string) => ['events', category] as const,
  event: (slug: string) => ['event', slug] as const,
  services: ['services'] as const,
  team: ['team'] as const,
  adCampaign: (page: string) => ['ad-campaign', page] as const,
  stats: ['stats'] as const,
  featuredProjects: ['projects', 'featured'] as const,
  featuredBuilders: ['builders', 'featured'] as const,
  teamOpenings: ['team-openings'] as const,
  activity: ['activity'] as const,
};

export const useEvents = (category: string) =>
  useQuery({
    queryKey: queryKeys.events(category),
    queryFn: ({ signal }) => api.getEvents(category, { signal }),
    // Keep showing the current list while the next filter loads (no flash of skeletons).
    placeholderData: keepPreviousData,
  });

export const useEvent = (slug: string) =>
  useQuery({ queryKey: queryKeys.event(slug), queryFn: ({ signal }) => api.getEventBySlug(slug, { signal }) });

export const useServices = () =>
  useQuery({ queryKey: queryKeys.services, queryFn: ({ signal }) => api.getServices({ signal }) });

export const useTeam = () =>
  useQuery({ queryKey: queryKeys.team, queryFn: ({ signal }) => api.getTeamMembers({ signal }) });

export const useAdCampaign = (page: string) =>
  useQuery({
    queryKey: queryKeys.adCampaign(page),
    queryFn: ({ signal }) => api.getActiveAdCampaign(page, { signal }),
  });

// ---- Product layer (home page) ----

export const usePlatformStats = () =>
  useQuery({ queryKey: queryKeys.stats, queryFn: ({ signal }) => api.getPlatformStats({ signal }) });

export const useFeaturedProjects = () =>
  useQuery({ queryKey: queryKeys.featuredProjects, queryFn: ({ signal }) => api.getFeaturedProjects({ signal }) });

export const useFeaturedBuilders = () =>
  useQuery({ queryKey: queryKeys.featuredBuilders, queryFn: ({ signal }) => api.getFeaturedBuilders({ signal }) });

export const useTeamOpenings = () =>
  useQuery({ queryKey: queryKeys.teamOpenings, queryFn: ({ signal }) => api.getTeamOpenings({ signal }) });

export const useActivity = () =>
  useQuery({
    queryKey: queryKeys.activity,
    queryFn: ({ signal }) => api.getActivity({ signal }),
    staleTime: 60_000,
  });
