import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Energy', href: '#energy' },
  { label: 'Flavors', href: '#flavors' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className={`flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${scrolled ? 'py-3 bg-ayx-black/80 border-b border-ayx-steel/5' : 'py-2'}`}>
          <a href="#top" className="font-display font-black text-xl tracking-[0.25em] text-white">
            AYX
          </a>

          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="group relative text-[11px] font-mono uppercase tracking-[0.25em] text-ayx-steel hover:text-white transition-colors">
                {l.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-ayx-cyan group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#cta" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.25em] text-ayx-black bg-ayx-cyan hover:bg-white transition-colors duration-300">
              Get AYX
            </a>
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white hover:text-ayx-cyan transition-colors">
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden mt-2">
              <div className="bg-ayx-black/95 border border-ayx-steel/10 p-4">
                <div className="flex flex-col gap-1">
                  {links.map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 px-2 text-sm font-mono uppercase tracking-[0.25em] text-ayx-steel hover:text-white border-b border-ayx-steel/5">
                      {l.label}
                    </a>
                  ))}
                  <a href="#cta" onClick={() => setOpen(false)} className="mt-2 py-3 text-center text-xs font-mono uppercase tracking-[0.25em] text-ayx-black bg-ayx-cyan">
                    Get AYX →
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
