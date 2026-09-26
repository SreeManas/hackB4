import { CountUp } from '@/components/motion/CountUp';
import { formatCompact } from '@/lib/format';
import { cn } from '@/lib/cn';

/**
 * Editorial statistic — a hairline, a big display number, a mono label. No box, no icon:
 * it should read like a figure in a report, not a dashboard widget.
 */
export function StatBlock({
  value,
  label,
  suffix = '+',
  className,
}: {
  value: number;
  label: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={cn('border-t border-white/15 pt-5', className)}>
      <CountUp
        to={value}
        suffix={suffix}
        format={formatCompact}
        className="block font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-none tracking-[0.02em] text-white"
      />
      <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase">{label}</p>
    </div>
  );
}
