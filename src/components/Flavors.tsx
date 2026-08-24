import { motion } from 'framer-motion';
import CanGraphic from './CanGraphic';

const flavors = [
  {
    code: 'AYX-01',
    name: 'ORIGINAL',
    subtitle: 'Dark Futuristic',
    desc: 'The signature AYX frequency. Bold, clean, ready for anything that comes next.',
    accent: '#00e6ff',
    accent2: '#7c5cff',
    bg: 'linear-gradient(160deg, #060912 0%, #0d1320 60%, #050810 100%)',
  },
  {
    code: 'AYX-02',
    name: 'PULSE',
    subtitle: 'Citrus / Electric',
    desc: 'A charged citrus current. Hits fast, runs clean, leaves no residue behind.',
    accent: '#b3ff1a',
    accent2: '#00e6ff',
    bg: 'linear-gradient(160deg, #0a0d05 0%, #13180a 60%, #060805 100%)',
  },
  {
    code: 'AYX-03',
    name: 'VOID',
    subtitle: 'Berry / Darker',
    desc: 'A deeper signal for the long mission. Darker, slower, longer burn.',
    accent: '#c026ff',
    accent2: '#7c5cff',
    bg: 'linear-gradient(160deg, #0a0512 0%, #150a20 60%, #08040f 100%)',
  },
];

export default function Flavors() {
  return (
    <section id="flavors" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-ayx-cyan mb-5">
            // 05 — Variants
          </p>
          <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-white">
            CHOOSE YOUR
            <br />
            <span className="text-ayx-cyan text-glow-cyan">FREQUENCY.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base text-ayx-silver/70 leading-relaxed">
            Three calibrated frequencies. Same precision chassis. Different signal.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {flavors.map((f, i) => (
            <motion.div
              key={f.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-6 sm:p-8 rounded-3xl border border-ayx-steel/10 overflow-hidden hover:border-white/20 transition-all duration-500"
              style={{ background: f.bg }}
            >
              {/* Accent glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${f.accent}22, transparent 70%)`,
                }}
              />

              {/* Corner markers */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-ayx-steel/30" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-ayx-steel/30" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-ayx-steel/30" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-ayx-steel/30" />

              {/* CSS can */}
              <div className="relative flex justify-center mb-7 sm:mb-8 h-[280px] sm:h-[320px] items-center group-hover:-translate-y-1 transition-transform duration-500">
                <CanGraphic
                  accent={f.accent}
                  accent2={f.accent2}
                  name={f.name}
                  code={f.code}
                  size="md"
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/60">
                    {f.code}
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.3em]"
                    style={{ color: f.accent }}
                  >
                    {f.subtitle}
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-3 leading-tight">
                  AYX <span className="text-ayx-steel/50">//</span>{' '}
                  <span style={{ color: f.accent }}>{f.name}</span>
                </h3>

                <p className="text-sm text-ayx-silver/70 leading-relaxed mb-6">
                  {f.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-ayx-steel/10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/50">
                    Available Q2 2026
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-3 transition-all"
                    style={{ color: f.accent }}
                  >
                    Signal
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.accent }} />
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
