import { Instagram, Github } from 'lucide-react';

const productLinks = [
  { label: 'Showcase', href: '#product' },
  { label: 'Flavors', href: '#flavors' },
  { label: 'Energy', href: '#energy' },
];

const aboutLinks = [
  { label: 'Mission', href: '#energy' },
  { label: 'Origin', href: '#about' },
  { label: 'Future', href: '#cta' },
];

export default function Footer() {
  return (
    <footer id="about" className="relative border-t border-ayx-steel/10 py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ayx-cyan/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="font-display font-black text-3xl tracking-[0.25em] text-white">
                AYX
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-ayx-cyan/40 to-transparent" />
            </div>
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-ayx-cyan mb-4">
              Energy Without Limits.
            </p>
            <p className="text-sm text-ayx-silver/60 leading-relaxed">
              A precision-crafted energy drink built for focus, momentum and relentless performance. Engineered for the next move.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40 mb-5">
                Product
              </p>
              <ul className="space-y-3 text-sm">
                {productLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-ayx-silver/80 hover:text-ayx-cyan transition-colors duration-300"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40 mb-5">
                About
              </p>
              <ul className="space-y-3 text-sm">
                {aboutLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-ayx-silver/80 hover:text-ayx-cyan transition-colors duration-300"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40 mb-5">
                Connect
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-ayx-silver/80 hover:text-ayx-cyan transition-colors duration-300"
                  >
                    <Instagram size={14} strokeWidth={1.5} />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-ayx-silver/80 hover:text-ayx-cyan transition-colors duration-300"
                  >
                    <Github size={14} strokeWidth={1.5} />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-ayx-steel/10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40">
            © 2026 AYX. All Systems Active.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-ayx-steel/40">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ayx-cyan opacity-60 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ayx-cyan" />
            </span>
            Signal Stable
          </div>
        </div>
      </div>
    </footer>
  );
}
