import { motion } from 'framer-motion';

const pillars = [
  { title: 'FOCUS', desc: 'Stay locked in. Eliminate noise. Channel every signal toward the target.' },
  { title: 'DRIVE', desc: 'Keep moving forward. Momentum compounds. Velocity becomes identity.' },
  { title: 'ENERGY', desc: 'Turn intention into action. Sustained output without the crash arc.' },
];

export default function EnergySection() {
  return (
    <section id="energy" className="relative py-32 sm:py-48 bg-ayx-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ayx-accent mb-5">Philosophy</p>
            <h2 className="font-sans font-black text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight text-ayx-ink">
              BUILT FOR<br/>MOMENTUM.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-lg text-ayx-muted leading-relaxed max-w-md">
              AYX is engineered around three forces that compound into relentless forward motion. Not stimulation — precision. Not chaos — calibration.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-px bg-ayx-line">
          {pillars.map((p, i) => (
            <motion.div 
              key={p.title} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ duration: 0.6, delay: i * 0.15 }} 
              className="bg-ayx-paper p-8 sm:p-10 flex flex-col gap-6 min-h-[300px]"
            >
              <span className="text-xs font-semibold text-ayx-muted">0{i + 1}</span>
              <h3 className="font-sans font-black text-3xl text-ayx-ink tracking-tight">{p.title}</h3>
              <p className="text-sm text-ayx-muted leading-relaxed mt-auto">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
