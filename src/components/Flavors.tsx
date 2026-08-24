import { motion } from 'framer-motion';
import CanGraphic from './CanGraphic';

const flavors = [
  { code: 'AYX-01', name: 'ORIGINAL', subtitle: 'Dark Futuristic', desc: 'The signature AYX frequency. Bold, clean, ready for anything that comes next.', accent: '#00e6ff', accent2: '#7c5cff', bg: '#050709' },
  { code: 'AYX-02', name: 'PULSE', subtitle: 'Citrus / Electric', desc: 'A charged citrus current. Hits fast, runs clean, leaves no residue behind.', accent: '#b3ff1a', accent2: '#00e6ff', bg: '#070905' },
  { code: 'AYX-03', name: 'VOID', subtitle: 'Berry / Darker', desc: 'A deeper signal for the long mission. Darker, slower, longer burn.', accent: '#c026ff', accent2: '#7c5cff', bg: '#080510' },
];

export default function Flavors() {
  return (
    <section id="flavors" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }} className="mb-12 sm:mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan mb-5">// 05 — Variants</p>
          <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-white">
            CHOOSE YOUR<br /><span className="text-ayx-cyan text-glow-cyan">FREQUENCY.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ayx-steel/5 border border-ayx-steel/5">
          {flavors.map((f, i) => (
            <motion.div key={f.code} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.12 }} className="group relative p-8 sm:p-10 flex flex-col items-center text-center transition-colors duration-500" style={{ backgroundColor: f.bg }}>
              <div className="relative flex justify-center mb-8 h-[280px] sm:h-[320px] items-center group-hover:-translate-y-1 transition-transform duration-500">
                <CanGraphic accent={f.accent} accent2={f.accent2} name={f.name} code={f.code} size="md" />
              </div>

              <div className="relative w-full">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-ayx-steel/10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40">{f.code}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: f.accent }}>{f.subtitle}</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-3 leading-tight">
                  AYX <span className="text-ayx-steel/50">//</span> <span style={{ color: f.accent }}>{f.name}</span>
                </h3>

                <p className="text-sm text-ayx-silver/50 leading-relaxed mb-6">{f.desc}</p>

                <div className="flex items-center justify-between pt-4 border-t border-ayx-steel/10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40">Available Q2 2026</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] flex items-center gap-2" style={{ color: f.accent }}>
                    Signal <span className="w-1.5 h-1.5" style={{ backgroundColor: f.accent }} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
