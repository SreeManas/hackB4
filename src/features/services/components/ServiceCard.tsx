import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useTilt } from '@/hooks/useTilt';
import type { Service } from '@/lib/api';

/** Service tile with 3D tilt. Tilt uses motion values (no re-renders); hover styling is pure CSS. */
export function ServiceCard({ service, index, onSelect }: { service: Service; index: number; onSelect: () => void }) {
  const tilt = useTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="h-full [perspective:1000px]"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        {...tilt}
        whileTap={{ scale: 0.98 }}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[rgba(20,20,20,0.6)] p-10 text-left backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="mb-8 text-white/60 transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:text-white">
          <Icon name={service.icon} size={40} strokeWidth={1.5} />
        </span>
        <h3 className="mb-4 text-xl font-semibold tracking-[0.05em] text-white">{service.title}</h3>
        <p className="flex-1 text-[0.95rem] leading-relaxed text-subtle">{service.description}</p>
        <span className="mt-8 flex items-center gap-2 text-sm font-semibold tracking-[0.1em] opacity-50 transition-opacity duration-300 group-hover:opacity-100">
          LEARN MORE{' '}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </motion.button>
    </motion.div>
  );
}
