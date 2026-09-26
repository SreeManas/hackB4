import type { FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextArea, TextField } from '@/components/ui/Field';
import { SuccessState } from '@/components/ui/States';
import { useSubmit } from '@/hooks/useSubmit';
import { api, type ServiceInquiry } from '@/lib/api';

interface InquiryModalProps {
  /** Service being enquired about; `null` closes the modal. */
  service: string | null;
  onClose: () => void;
}

export function InquiryModal({ service, onClose }: InquiryModalProps) {
  return (
    <Modal
      open={!!service}
      onClose={onClose}
      title={`Service inquiry: ${service ?? ''}`}
      className="rounded-3xl p-6 sm:p-12"
    >
      {/* Mounted fresh on every open, so the form never carries stale state or the wrong service. */}
      {service && <InquiryForm service={service} onDone={onClose} />}
    </Modal>
  );
}

function InquiryForm({ service, onDone }: { service: string; onDone: () => void }) {
  const { submit, isSubmitting, isSuccess, error } = useSubmit(api.submitServiceInquiry, {
    resetAfterMs: 3000,
    onReset: onDone,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const inquiry: ServiceInquiry = {
      service_type: service,
      client_name: String(f.get('client_name')).trim(),
      email: String(f.get('email')).trim(),
      organization_name: String(f.get('organization_name')).trim(),
      message: String(f.get('message') ?? '').trim() || undefined,
    };
    submit(inquiry);
  };

  if (isSuccess) return <SuccessState title="Inquiry Sent" message="Our team will get back to you shortly." />;

  return (
    <>
      <p className="mb-2 text-3xl font-light">Service Inquiry</p>
      <p className="mb-10 text-subtle">
        Requesting details for: <strong className="text-white">{service}</strong>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Client Name" name="client_name" required autoComplete="name" maxLength={120} />
          <TextField label="Email" name="email" type="email" required autoComplete="email" maxLength={254} />
        </div>
        <TextField label="Organization" name="organization_name" required autoComplete="organization" maxLength={160} />
        <TextArea label="Message (Optional)" name="message" maxLength={2000} />
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" loading={isSubmitting} fullWidth className="mt-4">
          {isSubmitting ? 'SUBMITTING…' : '/ SUBMIT INQUIRY'}
        </Button>
      </form>
    </>
  );
}
