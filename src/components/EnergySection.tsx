import { motion } from 'framer-motion';
import { Crosshair, Gauge, Infinity as InfinityIcon } from 'lucide-react';

const cards = [
  { icon: Crosshair, title: 'FOCUS', desc: 'Stay locked in. Eliminate noise. Channel every signal toward the target.', accent: '#00e6ff' },
  { icon: Gauge, title: 'DRIVE', desc: 'Keep moving forward. Momentum compounds. Velocity becomes identity.', accent: '#7c5cff' },
  { icon: InfinityIcon, title: 'ENERGY', desc: 'Turn intention into action. Sustained output without the crash arc.', accent: '#00e6ff' },
];

export default function EnergySection() {
  return (
    <section id="energy" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan mb-5">// 03 — Philosophy</p>
          <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-white">
            BUILT FOR<br /><span className="text-ayx-cyan text-glow-cyan">MOMENTUM.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base text-ayx-silver/50 leading-relaxed">
            AYX is engineered around three forces that compound into relentless forward motion. Not stimulation — precision. Not chaos — calibration.
          </p>
        </motion.div>

        <div className="mt-14 sm:mt-20 grid sm:grid-cols-3 gap-px bg-ayx-steel/5 border border-ayx-steel/5">
          {cards.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.12 }} className="group relative p-8 sm:p-10 bg-ayx-black hover:bg-ayx-surface/50 transition-colors duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 border border-ayx-steel/20 flex items-center justify-center transition-colors group-hover:border-ayx-cyan/50" style={{ color: c.accent }}>
                  <c.icon size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-ayx-steel/30">0{i + 1}</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-3 tracking-wide">{c.title}</h3>
              <p className="text-sm text-ayx-silver/50 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
