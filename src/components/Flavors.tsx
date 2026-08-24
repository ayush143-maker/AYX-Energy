import { motion } from 'framer-motion';
import CanGraphic from './CanGraphic';

const flavors = [
  { code: 'AYX-01', name: 'ORIGINAL', subtitle: 'Classic Identity', desc: 'The signature AYX frequency. Bold, clean, ready for anything that comes next.', accent: '#0047FF', bg: '#F7F7F5' },
  { code: 'AYX-02', name: 'PULSE', subtitle: 'Citrus / Electric', desc: 'A charged citrus current. Hits fast, runs clean, leaves no residue behind.', accent: '#6B7280', bg: '#F7F7F5' },
  { code: 'AYX-03', name: 'VOID', subtitle: 'Berry / Darker', desc: 'A deeper signal for the long mission. Darker, slower, longer burn.', accent: '#111111', bg: '#F7F7F5' },
];

export default function Flavors() {
  return (
    <section id="flavors" className="relative py-32 sm:py-48 bg-ayx-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 sm:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ayx-accent mb-5">Variants</p>
            <h2 className="font-sans font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-ayx-ink">
              CHOOSE YOUR<br/>FREQUENCY.
            </h2>
          </div>
          <p className="text-base text-ayx-muted leading-relaxed max-w-sm">
            Three calibrated frequencies. Same precision chassis. Different signal.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {flavors.map((f, i) => (
            <motion.div 
              key={f.code} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.2 }} 
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }} 
              className="group relative bg-ayx-white border border-ayx-line p-8 sm:p-10 flex flex-col items-center text-center transition-colors duration-500 hover:border-ayx-ink"
            >
              <div className="relative flex justify-center mb-10 h-[320px] sm:h-[380px] items-center w-full">
                <CanGraphic accent={f.accent} name={f.name} code={f.code} />
              </div>

              <div className="relative w-full border-t border-ayx-line pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-ayx-muted">{f.code}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: f.accent }}>{f.subtitle}</span>
                </div>

                <h3 className="font-sans font-black text-3xl text-ayx-ink mb-3 tracking-tight">
                  AYX // <span style={{ color: f.accent }}>{f.name}</span>
                </h3>

                <p className="text-sm text-ayx-muted leading-relaxed mb-8">{f.desc}</p>

                <div className="flex items-center justify-between pt-4 border-t border-ayx-line">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-ayx-muted">Available Q2 2026</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-ayx-ink">View Details →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
