import { prisma } from '../config/prisma';

/** Where a sign-up came from. A missing source is stored as 'unknown'. */
export const NEWSLETTER_SOURCES = [
  'footer',
  'early_access:projects',
  'early_access:builders',
  'early_access:teams',
  'early_access:account',
] as const;
export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

export const DEFAULT_NEWSLETTER_SOURCE = 'unknown';

export const isNewsletterSource = (value: string): value is NewsletterSource =>
  (NEWSLETTER_SOURCES as readonly string[]).includes(value);

/**
 * Idempotent subscribe. `email` must already be trimmed and lower-cased.
 *
 * One atomic upsert (safe under concurrent requests for the same email): a new email creates a row;
 * a known email keeps its row and only gains `source` if it is not already in `sources`.
 * Prisma's upsert cannot append to an array without duplicates, hence the parameterised raw query.
 */
export async function subscribeToNewsletter(email: string, source: string): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "newsletter_subscribers" ("email", "sources")
    VALUES (${email}, ARRAY[${source}]::text[])
    ON CONFLICT ("email") DO UPDATE SET
      "sources" = CASE
        WHEN ${source} = ANY(COALESCE("newsletter_subscribers"."sources", '{}'::text[]))
          THEN COALESCE("newsletter_subscribers"."sources", '{}'::text[])
        ELSE array_append(COALESCE("newsletter_subscribers"."sources", '{}'::text[]), ${source})
      END,
      "updated_at" = CASE
        WHEN ${source} = ANY(COALESCE("newsletter_subscribers"."sources", '{}'::text[]))
          THEN "newsletter_subscribers"."updated_at"
        ELSE CURRENT_TIMESTAMP
      END
  `;
}
