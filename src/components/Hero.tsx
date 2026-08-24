import { motion } from 'framer-motion';
import HeroCanvas from './three/HeroCanvas';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden flex items-center pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Typography */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-ayx-accent mb-6"
            >
              Engineered for the next move.
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-black text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-tight text-ayx-ink"
            >
              ENERGY<br/>WITHOUT<br/>LIMITS.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 max-w-md text-base text-ayx-muted leading-relaxed"
            >
              A precision-crafted energy drink designed for focus, momentum and relentless performance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a href="#product" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-ayx-ink text-ayx-white font-sans font-semibold text-sm uppercase tracking-widest hover:bg-ayx-accent transition-colors duration-300">
                Explore AYX 
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a href="#energy" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-ayx-line text-ayx-ink font-sans font-semibold text-sm uppercase tracking-widest hover:border-ayx-ink transition-colors">
                Discover the Formula
              </a>
            </motion.div>
          </div>

          {/* Right: 3D Can */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4, duration: 1.2 }}
            className="order-1 lg:order-2 lg:col-span-7 relative h-[50vh] sm:h-[60vh] lg:h-[80vh] min-h-[400px]"
          >
            <HeroCanvas />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
