import { motion } from 'framer-motion';

const glitch = 'm-0 text-[clamp(6rem,15vw,12rem)] font-extrabold leading-none';

/** Big glitching status code ("404", "500") used on error pages. Decorative only. */
export function GlitchCode({ code }: { code: string }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ x: [-5, 5, -5, 5, 0], y: [2, -2, 2, -2, 0] }}
      transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
      className="relative isolate inline-block"
    >
      <span className={`${glitch} block text-white`}>{code}</span>
      <span className={`${glitch} absolute top-0 -left-1 -z-[1] text-red-500 opacity-70 mix-blend-screen`}>{code}</span>
      <span className={`${glitch} absolute top-0 left-1 -z-[1] text-cyan-400 opacity-70 mix-blend-screen`}>{code}</span>
    </motion.div>
  );
}
