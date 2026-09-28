import { env } from './env';

/**
 * Internal email alerts for contact/inquiry submissions.
 *
 * No email provider was already configured anywhere in the project (checked package.json,
 * .env.example, env.ts, the handover docs). handover/08_BACKEND_CHECKLIST_AND_OPEN_ITEMS.txt
 * explicitly leaves "which email service (SES, Resend, SendGrid...)?" as an open question for the
 * business, so this deliberately does not pick one: it speaks generic SMTP, which every mainstream
 * provider (SES, Resend, SendGrid, Postmark, ...) exposes, so no code change is needed once the
 * business picks one and supplies credentials.
 *
 * Alerts are strictly best-effort and optional: with no SMTP config, or no recipient configured
 * for a given kind, that kind's alert is silently skipped (logged once at startup) and the
 * contact/inquiry write still succeeds normally.
 */

export type NotificationKind = 'contact' | 'inquiry';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

const hasSmtpTransport = Boolean(env.smtp.host && env.notifyFromEmail);

/** True once SMTP_HOST/NOTIFY_FROM_EMAIL and that kind's recipient are all set. */
export function isNotifyConfigured(kind: NotificationKind): boolean {
  const to = kind === 'contact' ? env.notifyContactToEmail : env.notifyInquiryToEmail;
  return hasSmtpTransport && Boolean(to);
}

export function notifyRecipient(kind: NotificationKind): string {
  return kind === 'contact' ? env.notifyContactToEmail : env.notifyInquiryToEmail;
}

export function smtpConfig(): SmtpConfig {
  return {
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    user: env.smtp.user,
    pass: env.smtp.pass,
    from: env.notifyFromEmail,
  };
}

/** Logged once at startup so missing config is visible without spamming per-request logs. */
export function logNotificationConfigStatus(): void {
  const kinds: NotificationKind[] = ['contact', 'inquiry'];
  for (const kind of kinds) {
    if (!isNotifyConfigured(kind)) {
      console.warn(
        `[notify] ${kind} email alerts are disabled (SMTP_HOST, NOTIFY_FROM_EMAIL and NOTIFY_${kind.toUpperCase()}_TO_EMAIL must all be set). Submissions are still stored normally.`,
      );
    }
  }
}
