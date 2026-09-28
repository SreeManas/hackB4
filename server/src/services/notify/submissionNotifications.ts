import { isNotifyConfigured, notifyRecipient } from '../../config/notifications';
import type { ContactSubmission } from '../contact.service';
import type { ServiceInquirySubmission } from '../serviceInquiries.service';
import { SmtpEmailNotifier, type EmailNotifier } from './mailer';

/**
 * Fires the internal alert email for a submission that has ALREADY been written to the database.
 * Best-effort only: never throws, so a delivery failure (or missing config) can never affect the
 * API response or roll back the write. Call this exactly once, after the create() succeeds, so a
 * client retry that creates a second row also - correctly - sends a second alert for that second
 * row, but a single successful submission never sends more than one alert.
 */

let smtpNotifier: EmailNotifier | undefined;
let testNotifierOverride: EmailNotifier | undefined;

/** Built lazily (not at import time) so a missing/invalid SMTP_PORT etc. only surfaces if ever used. */
function getSmtpNotifier(): EmailNotifier {
  if (testNotifierOverride) return testNotifierOverride;
  if (!smtpNotifier) smtpNotifier = new SmtpEmailNotifier();
  return smtpNotifier;
}

/** Never throws; logs a short, secret-free message on failure. */
async function sendAlert(kind: 'contact' | 'inquiry', subject: string, text: string): Promise<void> {
  if (!isNotifyConfigured(kind)) return;

  const notifier = getSmtpNotifier();
  try {
    await notifier.send({ to: notifyRecipient(kind), subject, text });
  } catch (err) {
    // Never log the transporter/config or the raw error object: it can echo back SMTP auth details.
    console.error(
      `[notify] failed to send ${kind} alert email: ${err instanceof Error ? err.message : 'unknown error'}`,
    );
  }
}

export async function notifyContactSubmission(data: ContactSubmission): Promise<void> {
  await sendAlert(
    'contact',
    `New contact message from ${data.name}`,
    `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  );
}

export async function notifyServiceInquirySubmission(data: ServiceInquirySubmission): Promise<void> {
  const lines = [
    `Service: ${data.serviceType}`,
    `Client: ${data.clientName}`,
    `Email: ${data.email}`,
    `Organization: ${data.organizationName}`,
    data.organizationType ? `Organization type: ${data.organizationType}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    data.budgetRange ? `Budget range: ${data.budgetRange}` : null,
    data.message ? `\nMessage:\n${data.message}` : null,
  ].filter((line): line is string => line !== null);

  await sendAlert('inquiry', `New service inquiry: ${data.serviceType} (${data.organizationName})`, lines.join('\n'));
}

/** Test-only: inject a fake notifier (e.g. one that throws), or pass undefined to go back to real SMTP. */
export function _setNotifierForTests(notifier: EmailNotifier | undefined): void {
  testNotifierOverride = notifier;
  smtpNotifier = undefined;
}
