import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShowcaseCanvas from './three/ShowcaseCanvas';

export default function ProductShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Map scroll to can rotation (smooth one-way rotation across the section)
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  return (
    <section id="product" ref={ref} className="relative h-[180vh] sm:h-[160vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        
        {/* Clean white background */}
        <div className="absolute inset-0 bg-ayx-paper" />
        
        {/* Subtle editorial side rails */}
        <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-ayx-muted/30 writing-vertical">
            AYX-01 // SCROLL TO ROTATE
          </div>
        </div>
        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-ayx-muted/30 writing-vertical">
            360° // INTERACTIVE PRODUCT VIEW
          </div>
        </div>

        {/* 3D Can Container */}
        <div className="absolute inset-0">
          <ShowcaseCanvas scrollRotation={rotateY} />
        </div>

        {/* Minimal overlay text */}
        <div className="absolute bottom-16 sm:bottom-20 inset-x-0 px-4 text-center pointer-events-none">
          <h2 className="font-sans font-black text-[clamp(1.8rem,7vw,5rem)] leading-[0.95] text-ayx-ink">
            PRECISION IN EVERY DETAIL.
          </h2>
          <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-ayx-muted">
            Engineered. Calibrated. Relentless.
          </p>
        </div>

      </div>
    </section>
  );
}
