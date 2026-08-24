import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, to, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

const stats = [
  { type: 'counter', value: 180, suffix: ' MG', label: 'Caffeine' },
  { type: 'counter', value: 330, suffix: ' ML', label: 'Can Size' },
  { type: 'static', value: '01', suffix: '', label: 'Original' },
  { type: 'static', value: '24/7', suffix: '', label: 'Momentum' },
] as const;

export default function Features() {
  return (
    <section className="relative py-32 sm:py-48 bg-ayx-white border-t border-b border-ayx-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-ayx-line">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ duration: 0.6, delay: i * 0.1 }} 
              className="px-4 sm:px-8 py-4 text-center lg:text-left"
            >
              <div className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl text-ayx-ink mb-3 tracking-tight">
                {s.type === 'counter' ? <Counter to={s.value} suffix={s.suffix} /> : <span>{s.value}{s.suffix}</span>}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-ayx-muted">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8, delay: 0.4 }} 
          className="mt-12 text-[10px] font-medium uppercase tracking-widest text-ayx-muted/50"
        >
          * Brand specifications. Not a medical or nutritional claim.
        </motion.p>
      </div>
    </section>
  );
}
