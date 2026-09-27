import { env } from '@/config/env';
import { request } from './client';
import { mockAdCampaign, mockEvents, mockServices, mockTeam } from './mocks/data';
import { mockActivity, mockBuilders, mockPlatformStats, mockProjects, mockTeamOpenings } from './mocks/product';
import type {
  ActivityItem,
  Builder,
  PlatformStats,
  Project,
  TeamOpening,
  AdCampaign,
  ContactMessage,
  ConversionPayload,
  Event,
  EventCategory,
  MutationResult,
  Service,
  ServiceInquiry,
  TeamMember,
} from './types';

export * from './types';
export { ApiError, GENERIC_ERROR_MESSAGE, get, getErrorMessage, post } from './client';
export type { ApiErrorKind, RequestOptions } from './client';

type Opts = { signal?: AbortSignal };

/** Every backend call the frontend makes. See docs/API_CONTRACT.md. */
export interface Api {
  getEvents(category?: string, opts?: Opts): Promise<Event[]>;
  getEventBySlug(slug: string, opts?: Opts): Promise<Event | null>;
  getServices(opts?: Opts): Promise<Service[]>;
  getTeamMembers(opts?: Opts): Promise<TeamMember[]>;
  getActiveAdCampaign(page: string, opts?: Opts): Promise<AdCampaign | null>;
  submitServiceInquiry(data: ServiceInquiry): Promise<MutationResult>;
  submitContactForm(data: ContactMessage): Promise<MutationResult>;
  subscribeNotification(token: string): Promise<MutationResult>;
  /** `source` tells the backend where the sign-up came from, e.g. 'footer' or 'early_access:teams'. */
  subscribeNewsletter(email: string, source?: string): Promise<MutationResult>;
  trackConversion(eventId: string, payload: ConversionPayload): Promise<void>;
  // Product layer (home page)
  getPlatformStats(opts?: Opts): Promise<PlatformStats>;
  getFeaturedProjects(opts?: Opts): Promise<Project[]>;
  getFeaturedBuilders(opts?: Opts): Promise<Builder[]>;
  getTeamOpenings(opts?: Opts): Promise<TeamOpening[]>;
  getActivity(opts?: Opts): Promise<ActivityItem[]>;
}

const EVENT_CATEGORIES: readonly EventCategory[] = ['hackathon', 'placement', 'workshop'];
const isEventCategory = (value: string | undefined): value is EventCategory =>
  value !== undefined && (EVENT_CATEGORIES as readonly string[]).includes(value);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CONVERSION_DEDUPE_MS = 3000;
const recentConversions = new Map<string, number>();

const httpApi: Api = {
  getPlatformStats: (opts) => request<PlatformStats>('/stats', opts),
  getFeaturedProjects: (opts) => request<Project[]>('/projects?featured=true', opts),
  getFeaturedBuilders: (opts) => request<Builder[]>('/builders?featured=true', opts),
  getTeamOpenings: (opts) => request<TeamOpening[]>('/team-openings?limit=3', opts),
  getActivity: (opts) => request<ActivityItem[]>('/activity?limit=10', opts),
  getEvents: (category, opts) => {
    // Only the categories the backend accepts are ever sent ('all' or anything unknown means no filter).
    const qs = isEventCategory(category) ? `?category=${category}` : '';
    return request<Event[]>(`/events${qs}`, opts);
  },
  getEventBySlug: async (slug, opts) => {
    try {
      return await request<Event>(`/events/${encodeURIComponent(slug)}`, opts);
    } catch (err) {
      if ((err as { status?: number }).status === 404) return null;
      throw err;
    }
  },
  getServices: (opts) => request<Service[]>('/services', opts),
  getTeamMembers: (opts) => request<TeamMember[]>('/team', opts),
  getActiveAdCampaign: (page, opts) =>
    request<AdCampaign | null>(`/ad-campaigns/active?page=${encodeURIComponent(page)}`, opts),
  submitServiceInquiry: (data) => request('/service-inquiries', { method: 'POST', body: data }),
  submitContactForm: (data) => request('/contact', { method: 'POST', body: data }),
  subscribeNotification: (token) => request('/notifications/subscribe', { method: 'POST', body: { token } }),
  subscribeNewsletter: (email, source) => request('/newsletter/subscribe', { method: 'POST', body: { email, source } }),
  trackConversion: async (eventId, payload) => {
    // Only real events are tracked: the API-provided UUID, never a slug or placeholder id.
    if (!UUID_PATTERN.test(eventId)) return;
    // An accidental double-click must not count twice.
    const now = Date.now();
    if (now - (recentConversions.get(eventId) ?? 0) < CONVERSION_DEDUPE_MS) return;
    recentConversions.set(eventId, now);
    // Fire-and-forget: analytics must never block navigation.
    await request(`/events/${eventId}/conversions`, {
      method: 'POST',
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  },
};

/** Resolves after `ms`, or rejects if the signal aborts first — mirrors real network behaviour. */
const latency = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t);
        reject(signal.reason);
      },
      { once: true },
    );
  });

const mockApi: Api = {
  async getPlatformStats(opts) {
    await latency(200, opts?.signal);
    return { ...mockPlatformStats };
  },
  async getFeaturedProjects(opts) {
    await latency(250, opts?.signal);
    return [...mockProjects];
  },
  async getFeaturedBuilders(opts) {
    await latency(250, opts?.signal);
    return [...mockBuilders];
  },
  async getTeamOpenings(opts) {
    await latency(250, opts?.signal);
    return [...mockTeamOpenings];
  },
  async getActivity(opts) {
    await latency(200, opts?.signal);
    return [...mockActivity];
  },
  async getEvents(category, opts) {
    await latency(300, opts?.signal);
    return category && category !== 'all' ? mockEvents.filter((e) => e.category === category) : [...mockEvents];
  },
  async getEventBySlug(slug, opts) {
    await latency(250, opts?.signal);
    return mockEvents.find((e) => e.slug === slug) ?? null;
  },
  async getServices(opts) {
    await latency(200, opts?.signal);
    return [...mockServices];
  },
  async getTeamMembers(opts) {
    await latency(200, opts?.signal);
    return [...mockTeam];
  },
  async getActiveAdCampaign(page, opts) {
    await latency(150, opts?.signal);
    return mockAdCampaign.target_page === page ? mockAdCampaign : null;
  },
  async submitServiceInquiry(data) {
    await latency(800);
    if (env.isDev) console.info('[mock api] service inquiry', data);
    return { success: true };
  },
  async submitContactForm(data) {
    await latency(800);
    if (env.isDev) console.info('[mock api] contact form', data);
    return { success: true };
  },
  async subscribeNotification(token) {
    await latency(500);
    if (env.isDev) console.info('[mock api] push token', token);
    return { success: true };
  },
  async subscribeNewsletter(email, source) {
    await latency(600);
    if (env.isDev) console.info('[mock api] newsletter', { email, source });
    return { success: true };
  },
  async trackConversion(eventId, payload) {
    if (env.isDev) console.info('[mock api] conversion', { eventId, ...payload });
  },
};

/**
 * Endpoints already backed by the real API. They go to the backend whenever an API base URL is
 * configured, even while `VITE_USE_MOCKS=true` keeps the rest of the app on mock data. Add an endpoint
 * here as its page is integrated; once every page is, drop this and the mock flag can default to false.
 */
const liveEndpoints: Partial<Api> = env.apiBaseUrl
  ? {
      getServices: httpApi.getServices,
      getTeamMembers: httpApi.getTeamMembers,
      getEvents: httpApi.getEvents,
      getEventBySlug: httpApi.getEventBySlug,
      getFeaturedProjects: httpApi.getFeaturedProjects,
      getFeaturedBuilders: httpApi.getFeaturedBuilders,
      getTeamOpenings: httpApi.getTeamOpenings,
      getActivity: httpApi.getActivity,
      getActiveAdCampaign: httpApi.getActiveAdCampaign,
      submitContactForm: httpApi.submitContactForm,
      submitServiceInquiry: httpApi.submitServiceInquiry,
      subscribeNewsletter: httpApi.subscribeNewsletter,
      subscribeNotification: httpApi.subscribeNotification,
      trackConversion: httpApi.trackConversion,
    }
  : {};

export const api: Api = env.useMocks ? { ...mockApi, ...liveEndpoints } : httpApi;
