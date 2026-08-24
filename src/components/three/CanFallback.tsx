import { motion } from 'framer-motion';
import CanGraphic from '../CanGraphic';

export default function CanFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-[70%] aspect-[3/5] max-h-[500px]"
      >
        <CanGraphic accent="#0047FF" name="ORIGINAL" code="AYX-01" />
      </motion.div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-widest text-ayx-muted/40 whitespace-nowrap">
        3D Mode Offline // Static Render
      </p>
    </div>
  );
}
