import nodemailer, { type Transporter } from 'nodemailer';
import { smtpConfig } from '../../config/notifications';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface EmailNotifier {
  /** Single attempt, no internal retry (retrying here could double-send on transient errors). */
  send(message: EmailMessage): Promise<void>;
}

/** Used when SMTP/recipient config is incomplete: a safe, silent no-op. */
export class NoopEmailNotifier implements EmailNotifier {
  async send(): Promise<void> {
    // Intentionally does nothing. Missing config is reported once at startup, not per request.
  }
}

const TRANSPORT_TIMEOUT_MS = 5000;

export class SmtpEmailNotifier implements EmailNotifier {
  private transporter: Transporter;
  private readonly from: string;

  constructor() {
    const cfg = smtpConfig();
    this.from = cfg.from;
    this.transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
      connectionTimeout: TRANSPORT_TIMEOUT_MS,
      greetingTimeout: TRANSPORT_TIMEOUT_MS,
      socketTimeout: TRANSPORT_TIMEOUT_MS,
    });
  }

  async send(message: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  }
}
