import type { Request, Response } from 'express';
import { createServiceInquiry } from '../services/serviceInquiries.service';
import { asyncHandler } from '../utils/asyncHandler';
import { optionalString, requireBody, requiredEmail, requiredString } from '../utils/validation';

export const submitServiceInquiry = asyncHandler(async (req: Request, res: Response) => {
  const body = requireBody(req.body);

  await createServiceInquiry({
    // Required. Maxima follow the API contract / column sizes.
    serviceType: requiredString(body, 'service_type', { label: 'Service type', max: 100 }),
    clientName: requiredString(body, 'client_name', { label: 'Name', max: 120 }),
    email: requiredEmail(body),
    organizationName: requiredString(body, 'organization_name', { label: 'Organization', max: 160 }),
    // Optional: absent, null or blank are not stored. Maxima are the column sizes.
    organizationType: optionalString(body, 'organization_type', { label: 'Organization type', max: 50 }),
    phone: optionalString(body, 'phone', { label: 'Phone', max: 20 }),
    budgetRange: optionalString(body, 'budget_range', { label: 'Budget range', max: 50 }),
    message: optionalString(body, 'message', { label: 'Message', max: 2000 }),
  });

  res.status(201).json({ success: true });
});
