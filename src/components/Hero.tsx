import { motion } from 'framer-motion';
import HeroCanvas from './three/HeroCanvas';
import FloatingAnnotation from './FloatingAnnotation';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(0,230,255,0.08),_transparent_55%)]" />
        <div className="absolute inset-0 grid-bg opacity-30 mask-fade-y" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-32 bg-[radial-gradient(ellipse_at_center,_rgba(0,230,255,0.1),_transparent_70%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40 mb-6 lg:mb-10">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-ayx-cyan animate-pulse" /> AYX-01 // ENERGY SYSTEM
          </span>
          <span className="hidden sm:inline">SYS.STATUS: ONLINE</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.95, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.88] tracking-tight text-white">
              ENERGY<br /><span className="text-ayx-cyan text-glow-cyan">WITHOUT</span><br />LIMITS.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }} className="mt-5 text-xs font-mono uppercase tracking-[0.3em] text-ayx-steel">
              Engineered for the next move.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mt-4 max-w-md text-sm text-ayx-silver/60 leading-relaxed">
              A precision-crafted energy drink designed for focus, momentum and relentless performance.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#product" className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-ayx-cyan text-ayx-black font-mono uppercase text-xs tracking-[0.25em] hover:shadow-[0_0_30px_rgba(0,230,255,0.3)] transition-shadow">
                Explore AYX <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a href="#energy" className="group inline-flex items-center justify-center gap-2 px-7 py-4 border border-ayx-steel/20 text-white font-mono uppercase text-xs tracking-[0.25em] hover:border-ayx-cyan/50 hover:text-ayx-cyan transition-all">
                Discover the Formula
              </a>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }} className="order-1 lg:order-2 lg:col-span-7 relative h-[48vh] sm:h-[58vh] lg:h-[82vh] min-h-[360px]">
            <HeroCanvas />
            <FloatingAnnotation className="top-[12%] left-0 hidden sm:flex" label="MAT. ALUMINUM 6061" code="M-01" />
            <FloatingAnnotation className="top-[28%] right-0 hidden sm:flex" label="VOL. 330ML" code="V-02" align="right" />
            <FloatingAnnotation className="bottom-[28%] left-0 hidden sm:flex" label="CAFFEINE 180MG" code="C-03" />
            <FloatingAnnotation className="bottom-[12%] right-0 hidden sm:flex" label="SYS. LIVE" code="S-04" align="right" pulse />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
