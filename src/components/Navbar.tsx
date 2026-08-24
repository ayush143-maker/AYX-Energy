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
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2 sm:py-3' : 'py-4 sm:py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 transition-all duration-500 ${
            scrolled ? 'glass-strong py-2.5 sm:py-3 shadow-2xl shadow-black/40' : 'py-2'
          }`}
        >
          {/* Logo */}
          <a
            href="#top"
            aria-label="AYX home"
            className="group relative font-display font-black text-xl sm:text-2xl tracking-[0.25em] text-white"
          >
            <span className="relative z-10">AYX</span>
            <span className="absolute -inset-1 bg-ayx-cyan/0 blur-md group-hover:bg-ayx-cyan/15 transition-all duration-500" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-[11px] lg:text-xs font-mono uppercase tracking-[0.25em] text-ayx-steel hover:text-white transition-colors duration-300"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-ayx-cyan group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#cta"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.25em] text-ayx-black bg-ayx-cyan hover:bg-white transition-colors duration-300 rounded-full"
            >
              Get AYX
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="md:hidden p-2 text-white hover:text-ayx-cyan transition-colors"
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden mt-2"
            >
              <div className="glass-strong rounded-2xl p-4">
                <div className="flex flex-col gap-1">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="py-3 px-2 text-sm font-mono uppercase tracking-[0.25em] text-ayx-steel hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                  <a
                    href="#cta"
                    onClick={() => setOpen(false)}
                    className="mt-2 py-3 text-center text-xs font-mono uppercase tracking-[0.25em] text-ayx-black bg-ayx-cyan rounded-lg"
                  >
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
