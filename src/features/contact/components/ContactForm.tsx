import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea, TextField } from '@/components/ui/Field';
import { SuccessState } from '@/components/ui/States';
import { useSubmit } from '@/hooks/useSubmit';
import { api } from '@/lib/api';

export function ContactForm() {
  const { submit, isSubmitting, isSuccess, error } = useSubmit(api.submitContactForm, { resetAfterMs: 3000 });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    submit({
      name: String(f.get('name')).trim(),
      email: String(f.get('email')).trim(),
      message: String(f.get('message')).trim(),
    });
  };

  if (isSuccess) return <SuccessState title="Message Received" message="We'll be in touch with you shortly." />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <TextField
        variant="underline"
        hideLabel
        label="Your Name"
        name="name"
        placeholder="Your Name"
        required
        autoComplete="name"
        maxLength={120}
      />
      <TextField
        variant="underline"
        hideLabel
        label="Email Address"
        name="email"
        type="email"
        placeholder="Email Address"
        required
        autoComplete="email"
        maxLength={254}
      />
      <TextArea
        variant="underline"
        hideLabel
        label="Message"
        name="message"
        placeholder="Tell us about your project or inquiry..."
        required
        maxLength={2000}
      />
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" loading={isSubmitting} fullWidth className="mt-4">
        {isSubmitting ? 'SENDING…' : '/ SEND MESSAGE'}
      </Button>
    </form>
  );
}
