import type { Request, Response } from 'express';
import { findPublishedEventBySlug, isEventCategory, listPublishedEvents } from '../services/events.service';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/HttpError';

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;

  if (category === undefined) {
    res.json(await listPublishedEvents());
    return;
  }
  // Rejects unknown values, empty strings and repeated/array params.
  if (!isEventCategory(category)) throw new HttpError(400, 'Invalid event category.');

  res.json(await listPublishedEvents(category));
});

export const getEventBySlug = asyncHandler(async (req: Request, res: Response) => {
  const event = await findPublishedEventBySlug(String(req.params.slug));
  if (!event) throw new HttpError(404, 'Event not found');

  res.json(event);
});
