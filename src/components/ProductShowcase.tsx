import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShowcaseCanvas from './three/ShowcaseCanvas';

export default function ProductShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Map scroll to can rotation (one full rotation across the section)
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  // Text reveals
  const textOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    [0, 1, 1, 0]
  );
  const textY = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    [80, 0, 0, -80]
  );

  // Background color shift
  const bgGradient = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(circle at 50% 50%, rgba(0,230,255,0.18), transparent 55%)',
      'radial-gradient(circle at 50% 50%, rgba(124,92,255,0.18), transparent 55%)',
      'radial-gradient(circle at 50% 50%, rgba(0,230,255,0.18), transparent 55%)',
    ]
  );

  // Can scale
  const canScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 1.08]);

  return (
    <section id="product" ref={ref} className="relative h-[220vh] sm:h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Background */}
        <motion.div
          className="absolute inset-0"
          style={{ background: bgGradient }}
        />
        <div className="absolute inset-0 grid-bg opacity-20 mask-fade-y" />
        <div className="absolute inset-0 bg-gradient-to-b from-ayx-black via-transparent to-ayx-black" />

        {/* Side rails */}
        <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-ayx-steel/40 writing-vertical">
            AYX-01 // SCROLL TO ROTATE
          </div>
        </div>
        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-ayx-steel/40 writing-vertical">
            360° // INTERACTIVE PRODUCT VIEW
          </div>
        </div>

        {/* 3D Can */}
        <motion.div style={{ scale: canScale }} className="absolute inset-0">
          <ShowcaseCanvas scrollRotation={rotateY} />
        </motion.div>

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}
          className="absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan">
            // 02 — The Object
          </p>
        </motion.div>

        {/* Bottom text overlay */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-16 sm:bottom-20 inset-x-0 px-4 text-center pointer-events-none"
        >
          <h2 className="font-display font-black text-[clamp(1.8rem,7vw,5rem)] leading-[0.95] text-white">
            MORE THAN A DRINK.
            <br />
            <span className="text-ayx-cyan text-glow-cyan">A STATE OF MOTION.</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-ayx-steel/70">
            Engineered. Calibrated. Relentless.
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <motion.div
            className="h-px bg-ayx-cyan/60"
            style={{ width: useTransform(scrollYProgress, [0, 1], ['0vw', '12vw']) }}
          />
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-ayx-steel/50">
            <motion.span>{useTransform(scrollYProgress, (v) => `${Math.round(v * 360)}°`)}</motion.span>
          </span>
        </div>
      </div>
    </section>
  );
}
