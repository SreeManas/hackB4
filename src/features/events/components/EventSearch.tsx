import { Search, X } from 'lucide-react';

/** Instant client-side search over the loaded events. */
export function EventSearch({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount?: number;
}) {
  return (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-sm">
        <span className="sr-only">Search events</span>
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, location, format…"
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pr-10 pl-11 text-sm text-white transition placeholder:text-white/40 focus:border-white/40 focus:bg-white/10 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-white/50 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </label>
      {resultCount !== undefined && (
        <p aria-live="polite" className="text-xs tracking-[0.1em] text-white/50">
          {resultCount} {resultCount === 1 ? 'EVENT' : 'EVENTS'}
        </p>
      )}
    </div>
  );
}
