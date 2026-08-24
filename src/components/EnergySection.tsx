import { motion } from 'framer-motion';
import { Crosshair, Gauge, Infinity as InfinityIcon } from 'lucide-react';

const cards = [
  {
    icon: Crosshair,
    title: 'FOCUS',
    desc: 'Stay locked in. Eliminate noise. Channel every signal toward the target.',
    accent: '#00e6ff',
    code: 'F-01',
  },
  {
    icon: Gauge,
    title: 'DRIVE',
    desc: 'Keep moving forward. Momentum compounds. Velocity becomes identity.',
    accent: '#7c5cff',
    code: 'D-02',
  },
  {
    icon: InfinityIcon,
    title: 'ENERGY',
    desc: 'Turn intention into action. Sustained output without the crash arc.',
    accent: '#00e6ff',
    code: 'E-03',
  },
];

export default function EnergySection() {
  return (
    <section id="energy" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan mb-5">
            // 03 — Philosophy
          </p>
          <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-white">
            BUILT FOR
            <br />
            <span className="text-ayx-cyan text-glow-cyan">MOMENTUM.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-ayx-silver/70 leading-relaxed">
            AYX is engineered around three forces that compound into relentless forward motion.
            Not stimulation — precision. Not chaos — calibration.
          </p>
        </motion.div>

        <div className="mt-14 sm:mt-20 grid sm:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-6 sm:p-8 rounded-2xl border border-ayx-steel/10 hover:border-ayx-cyan/30 transition-all duration-500 overflow-hidden glass"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${c.accent}18, transparent 70%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-7 sm:mb-8">
                  <div
                    className="w-12 h-12 rounded-xl border border-ayx-steel/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                    style={{ color: c.accent }}
                  >
                    <c.icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40">
                    {c.code}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3 tracking-wide">
                  {c.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-ayx-silver/70 leading-relaxed">
                  {c.desc}
                </p>

                {/* Bottom indicator */}
                <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40">
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all duration-500 group-hover:w-6"
                    style={{ background: c.accent }}
                  />
                  <span>ACTIVE</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
