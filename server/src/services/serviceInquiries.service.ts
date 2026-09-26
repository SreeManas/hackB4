import { prisma } from '../config/prisma';

export interface ServiceInquirySubmission {
  serviceType: string;
  clientName: string;
  email: string;
  organizationName: string;
  organizationType?: string;
  phone?: string;
  budgetRange?: string;
  message?: string;
}

/**
 * Stores the lead. `serviceType` is the service TITLE as free text (deliberately no relation to
 * `services`); `status` takes the schema default ('pending').
 */
export async function createServiceInquiry(data: ServiceInquirySubmission): Promise<void> {
  await prisma.serviceInquiry.create({ data });
}
