import {
  Briefcase,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Gift,
  GraduationCap,
  Handshake,
  HelpCircle,
  Megaphone,
  Rocket,
  SquareTerminal,
  Users,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import type { ServiceIconName } from '@/lib/api/types';

/**
 * Explicit icon registry. Importing icons by name (instead of `import * as Icons`) keeps
 * the bundle to the ~12 icons we use rather than the entire lucide library.
 */
const icons: Record<ServiceIconName, LucideIcon> = {
  TerminalSquare: SquareTerminal,
  Building2,
  Megaphone,
  CalendarDays,
  Rocket,
  CircleDollarSign,
  Users,
  Briefcase,
  Handshake,
  Gift,
  GraduationCap,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = icons[name as ServiceIconName] ?? HelpCircle;
  return <Cmp aria-hidden="true" {...props} />;
}
