import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function CTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="cta" className="relative py-32 sm:py-40 lg:py-48 overflow-hidden">
      {/* Animated background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,230,255,0.14),_transparent_60%)]" />
        {!reduceMotion && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] max-w-[1000px] max-h-[1000px] opacity-25"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(0,230,255,0.4) 20%, transparent 40%, rgba(124,92,255,0.4) 60%, transparent 80%, transparent 100%)',
              filter: 'blur(80px)',
            }}
          />
        )}
        <div className="absolute inset-0 grid-bg opacity-20 mask-fade-y" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan mb-6"
        >
          // 06 — Final Transmission
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-[clamp(3rem,11vw,8rem)] leading-[0.88] text-white"
        >
          READY TO
          <br />
          <span className="text-ayx-cyan text-glow-cyan">MOVE?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 sm:mt-8 text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-ayx-steel mb-10 sm:mb-12"
        >
          Enter the AYX frequency.
        </motion.p>

        <motion.a
          href="#top"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-5 sm:py-6 bg-ayx-cyan text-ayx-black font-display font-bold text-sm sm:text-base uppercase tracking-[0.25em] rounded-full overflow-hidden hover:shadow-[0_0_60px_rgba(0,230,255,0.5)] transition-shadow duration-500"
        >
          <span className="relative z-10">Get AYX</span>
          <ArrowRight
            size={22}
            strokeWidth={2.5}
            className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
          />
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.a>

        {/* Secondary links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-ayx-steel/50"
        >
          <span>Free shipping Q2 2026</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-ayx-steel/30" />
          <span>Cancel anytime</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-ayx-steel/30" />
          <span>Recyclable aluminum</span>
        </motion.div>
      </div>
    </section>
  );
}
