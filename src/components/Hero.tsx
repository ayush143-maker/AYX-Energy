import { motion } from 'framer-motion';
import HeroCanvas from './three/HeroCanvas';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden flex items-center pt-24 pb-12 bg-ayx-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Typography */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <div className="hidden lg:block mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ayx-accent mb-2">AYX / Energy Drink</p>
              <div className="w-12 h-0.5 bg-ayx-ink"></div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-black text-[clamp(2.5rem,9vw,6rem)] leading-[0.9] tracking-tight text-ayx-ink"
            >
              ENERGY<br/>WITHOUT<br/>LIMITS.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 max-w-md text-base text-ayx-muted leading-relaxed"
            >
              Engineered for the next move. A precision-crafted energy drink designed for focus, momentum and relentless performance.
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
              <a href="#flavors" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-ayx-line text-ayx-ink font-sans font-semibold text-sm uppercase tracking-widest hover:border-ayx-ink transition-colors">
                Discover the Flavors
              </a>
            </motion.div>
          </div>

          {/* Right: 3D Can */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative h-[45vh] sm:h-[55vh] lg:h-[80vh] min-h-[380px] flex flex-col items-center justify-center">
            
            <div className="lg:hidden mb-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ayx-accent">AYX / Energy Drink</p>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
              <HeroCanvas />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
