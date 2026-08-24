import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

function Counter({
  to,
  suffix = '',
  duration = 2,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [inView, to, count, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

const stats = [
  { type: 'counter' as const, value: 180, suffix: ' MG', label: 'Caffeine', code: 'S-01' },
  { type: 'counter' as const, value: 0, suffix: '%', label: 'Distraction', code: 'S-02' },
  { type: 'static' as const, value: '24/7', suffix: '', label: 'Momentum', code: 'S-03' },
  { type: 'static' as const, value: '01', suffix: '', label: 'Mission', code: 'S-04' },
];

export default function Features() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      {/* Subtle backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,230,255,0.05), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan mb-5">
            // 04 — Specification
          </p>
          <h2 className="font-display font-black text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.95] text-white">
            CALIBRATED
            <br />
            <span className="text-ayx-steel">FOR PEAK OUTPUT.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-5 sm:p-7 lg:p-8 rounded-2xl border border-ayx-steel/10 glass overflow-hidden hover:border-ayx-cyan/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-3 sm:p-4 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-ayx-steel/40">
                {s.code}
              </div>

              <div className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white mb-3 leading-none">
                {s.type === 'counter' ? (
                  <Counter to={s.value} suffix={s.suffix} />
                ) : (
                  <span>
                    {s.value}
                    {s.suffix}
                  </span>
                )}
              </div>

              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-ayx-cyan">
                {s.label}
              </div>

              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-ayx-cyan to-ayx-violet transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-ayx-steel/40"
        >
          * Brand specifications. Not a medical or nutritional claim.
        </motion.p>
      </div>
    </section>
  );
}
