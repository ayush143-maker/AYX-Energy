import { motion } from 'framer-motion';
import HeroCanvas from './three/HeroCanvas';
import FloatingAnnotation from './FloatingAnnotation';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Atmospheric layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(0,230,255,0.10),_transparent_55%)]" />
        <div className="absolute inset-0 grid-bg opacity-40 mask-fade-y" />
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[85vw] max-w-[820px] aspect-square rounded-full bg-[radial-gradient(circle,_rgba(124,92,255,0.18),_transparent_70%)] blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-32 bg-[radial-gradient(ellipse_at_center,_rgba(0,230,255,0.15),_transparent_70%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-10 lg:pb-16">
        {/* Top metadata strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-ayx-steel/60 mb-6 lg:mb-10"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ayx-cyan animate-pulse" />
            AYX-01 // ENERGY SYSTEM
          </span>
          <span className="hidden sm:inline">01 / 04</span>
          <span className="hidden sm:inline">SYS.STATUS: ONLINE</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Text column */}
          <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-ayx-cyan mb-5 sm:mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ayx-cyan animate-pulse" />
              Precision-Crafted Energy
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.88] tracking-tight text-white"
            >
              ENERGY
              <br />
              <span className="text-ayx-cyan text-glow-cyan">WITHOUT</span>
              <br />
              LIMITS.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="mt-5 sm:mt-7 text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-ayx-steel"
            >
              Engineered for the next move.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-4 max-w-md text-sm sm:text-base text-ayx-silver/80 leading-relaxed"
            >
              AYX is a precision-crafted energy drink designed for focus, momentum and relentless performance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3"
            >
              <a
                href="#product"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-4 bg-ayx-cyan text-ayx-black font-mono uppercase text-xs tracking-[0.25em] rounded-full overflow-hidden hover:shadow-[0_0_40px_rgba(0,230,255,0.4)] transition-shadow duration-500"
              >
                <span className="relative z-10">Explore AYX</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a
                href="#energy"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 border border-ayx-steel/20 text-white font-mono uppercase text-xs tracking-[0.25em] rounded-full hover:border-ayx-cyan/50 hover:text-ayx-cyan hover:bg-ayx-cyan/5 transition-all duration-300"
              >
                Discover the Formula
              </a>
            </motion.div>

            {/* Mini stat strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="mt-9 sm:mt-12 grid grid-cols-3 gap-4 max-w-md"
            >
              {[
                { v: '180MG', l: 'Caffeine' },
                { v: '0%', l: 'Sugar' },
                { v: '330ML', l: 'Volume' },
              ].map((s) => (
                <div key={s.l} className="border-l border-ayx-steel/15 pl-3">
                  <div className="font-display font-bold text-base sm:text-lg text-white">{s.v}</div>
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-ayx-steel/60 mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7 relative h-[48vh] sm:h-[58vh] lg:h-[82vh] min-h-[360px]"
          >
            <HeroCanvas />

            {/* Floating annotations */}
            <FloatingAnnotation className="top-[12%] left-0 hidden sm:flex" label="MAT. ALUMINUM 6061" code="M-01" />
            <FloatingAnnotation className="top-[28%] right-0 hidden sm:flex" label="VOL. 330ML" code="V-02" align="right" />
            <FloatingAnnotation className="bottom-[28%] left-0 hidden sm:flex" label="CAFFEINE 180MG" code="C-03" />
            <FloatingAnnotation className="bottom-[12%] right-0 hidden sm:flex" label="SYS. LIVE" code="S-04" align="right" pulse />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-8 lg:mt-12 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.35em] text-ayx-steel/45">
            <span>Scroll to engage</span>
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-ayx-cyan to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
