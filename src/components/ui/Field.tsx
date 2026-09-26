import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'boxed' | 'underline';

const control: Record<Variant, string> = {
  boxed:
    'w-full rounded-lg border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/40 transition focus:border-white/50 focus:outline-none aria-invalid:border-danger/60',
  underline:
    'peer w-full border-0 border-b border-white/20 bg-transparent py-4 text-lg text-white placeholder:text-white/40 focus:outline-none aria-invalid:border-danger/60',
};

interface BaseProps {
  label: string;
  variant?: Variant;
  /** Hide the label visually (still read by screen readers). */
  hideLabel?: boolean;
  /** Validation message; marks the control invalid and is announced by screen readers. */
  error?: string;
  /** Helper text shown under the control when there is no error. */
  hint?: string;
  className?: string;
}

function Label({
  htmlFor,
  label,
  hidden,
  required,
}: {
  htmlFor: string;
  label: string;
  hidden?: boolean;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('mb-2 block text-xs tracking-[0.1em] text-muted uppercase', hidden && 'sr-only')}
    >
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  );
}

/** Animated focus underline for the "underline" variant (pure CSS, driven by :focus / :not(:placeholder-shown)). */
const Underline = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-white transition-transform duration-500 peer-focus:scale-x-100 peer-[:not(:placeholder-shown)]:scale-x-100"
  />
);

/** Error or hint line under a control, plus the aria props that link it to the control. */
function useFieldMessage(id: string, error?: string, hint?: string) {
  const msgId = `${id}-msg`;
  const text = error || hint;
  const aria = {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': text ? msgId : undefined,
  } as const;
  const message: ReactNode = text ? (
    <p
      id={msgId}
      role={error ? 'alert' : undefined}
      className={cn('mt-2 text-sm', error ? 'text-danger' : 'text-faint')}
    >
      {text}
    </p>
  ) : null;
  return { aria, message };
}

export function TextField({
  label,
  variant = 'boxed',
  hideLabel,
  error,
  hint,
  className,
  ...input
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const { aria, message } = useFieldMessage(id, error, hint);
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} hidden={hideLabel} required={input.required} />
      <div className="relative">
        <input id={id} className={control[variant]} placeholder={input.placeholder ?? ' '} {...aria} {...input} />
        {variant === 'underline' && <Underline />}
      </div>
      {message}
    </div>
  );
}

export function TextArea({
  label,
  variant = 'boxed',
  hideLabel,
  error,
  hint,
  className,
  ...textarea
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const { aria, message } = useFieldMessage(id, error, hint);
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} hidden={hideLabel} required={textarea.required} />
      <div className="relative">
        <textarea
          id={id}
          rows={4}
          className={cn(control[variant], 'resize-y')}
          placeholder={textarea.placeholder ?? ' '}
          {...aria}
          {...textarea}
        />
        {variant === 'underline' && <Underline />}
      </div>
      {message}
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

/** Native <select> (best on mobile and for accessibility), styled to match the text fields. */
export function SelectField({
  label,
  variant = 'boxed',
  hideLabel,
  error,
  hint,
  className,
  options,
  placeholder,
  ...select
}: BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly SelectOption[];
    /** Disabled first option, e.g. "Choose a service". */
    placeholder?: string;
  }) {
  const id = useId();
  const { aria, message } = useFieldMessage(id, error, hint);
  const uncontrolledDefault = select.value === undefined && select.defaultValue === undefined && placeholder;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} hidden={hideLabel} required={select.required} />
      <div className="relative">
        <select
          id={id}
          className={cn(control[variant], 'cursor-pointer appearance-none pr-12 [&>option]:bg-panel')}
          defaultValue={uncontrolledDefault ? '' : undefined}
          {...aria}
          {...select}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-faint"
        />
      </div>
      {message}
    </div>
  );
}

/** Checkbox with a custom box; the real <input> stays in the DOM for keyboard and screen readers. */
export function Checkbox({
  label,
  error,
  className,
  ...input
}: { label: ReactNode; error?: string; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const id = useId();
  const { aria, message } = useFieldMessage(id, error);
  return (
    <div className={className}>
      <label htmlFor={id} className="group inline-flex cursor-pointer items-start gap-3 text-sm text-muted">
        <span className="relative mt-0.5 inline-flex">
          <input id={id} type="checkbox" className="peer sr-only" {...aria} {...input} />
          <span
            aria-hidden="true"
            className="flex size-5 items-center justify-center rounded border border-line-strong bg-surface transition peer-checked:border-white peer-checked:bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white peer-disabled:opacity-40 peer-aria-invalid:border-danger/60 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
          >
            <Check size={14} strokeWidth={3} className="text-black" />
          </span>
        </span>
        <span className="group-hover:text-white">{label}</span>
      </label>
      {message}
    </div>
  );
}
