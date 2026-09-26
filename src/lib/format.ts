/** Locale-aware formatting via Intl — renders correctly for visitors in any region. */
const userLocale = typeof navigator !== 'undefined' ? navigator.language : 'en';

const dateFmt = new Intl.DateTimeFormat(userLocale, { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

export const formatDateRange = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  // formatRange collapses shared parts, e.g. "Oct 8 – 11, 2026".
  return dateFmt.formatRange(start, end);
};

export const humanize = (value: string) => value.replace(/_/g, ' ');

/** Indian digit grouping: 120000 → "1,20,000". */
export const formatCount = (n: number) => n.toLocaleString('en-IN');

const trim = (n: number) => String(Number(n.toFixed(1)));

/** Compact counts for editorial stats: 320 → "320", 1800 → "1.8K", 12000 → "12K", 2500000 → "2.5M". */
export function formatCompact(n: number) {
  const v = Math.round(n);
  if (v >= 1_000_000) return `${trim(v / 1_000_000)}M`;
  if (v >= 1_000) return `${trim(v / 1_000)}K`;
  return String(v);
}

/** Compact rupee amounts for listings: 200000 → "₹2L", 15000000 → "₹1.5Cr", 50000 → "₹50K". */
export function formatINRCompact(rupees: number) {
  if (rupees >= 1_00_00_000) return `₹${trim(rupees / 1_00_00_000)}Cr`;
  if (rupees >= 1_00_000) return `₹${trim(rupees / 1_00_000)}L`;
  if (rupees >= 1_000) return `₹${trim(rupees / 1_000)}K`;
  return `₹${rupees}`;
}

/** "2H AGO", "3D AGO", "JUST NOW" — for the activity ticker. */
export function timeAgo(iso: string, now = Date.now()) {
  const mins = Math.floor((now - Date.parse(iso)) / 60_000);
  if (mins < 1) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}
