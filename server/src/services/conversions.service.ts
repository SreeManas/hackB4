import { prisma } from '../config/prisma';

export interface ConversionInput {
  eventId: string;
  source: string;
  medium: string;
  campaign?: string;
  userAgent: string | null;
  referrer: string | null;
}

/**
 * Records one REGISTER NOW click. Returns false when the event does not exist or is unpublished,
 * so callers can answer 404 exactly like the public events endpoints do.
 *
 * A single conditional INSERT ... SELECT: one round trip, and nothing is written if the event
 * disappears or is unpublished in the meantime. Values are bound parameters.
 */
export async function recordConversion(input: ConversionInput): Promise<boolean> {
  const inserted = await prisma.$executeRaw`
    INSERT INTO "event_conversions" ("event_id", "source", "medium", "campaign", "user_agent", "referrer")
    SELECT "id", ${input.source}, ${input.medium}, ${input.campaign ?? null}, ${input.userAgent}, ${input.referrer}
    FROM "events"
    WHERE "id" = ${input.eventId}::uuid AND "is_published" = true
  `;
  return inserted > 0;
}
