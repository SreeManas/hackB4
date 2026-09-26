import { prisma } from '../config/prisma';

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

/** Stores the message; `status` takes the schema default ('new'). */
export async function createContactMessage({ name, email, message }: ContactSubmission): Promise<void> {
  await prisma.contactMessage.create({ data: { name, email, message } });
}
