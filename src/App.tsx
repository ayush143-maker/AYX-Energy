import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import EnergySection from './components/EnergySection';
import Features from './components/Features';
import Flavors from './components/Flavors';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CursorLight from './components/CursorLight';

export default function App() {
  return (
    <div className="relative min-h-screen bg-ayx-black text-ayx-silver overflow-x-hidden noise">
      {/* Ambient background wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,230,255,0.06), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(124,92,255,0.05), transparent 60%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(0,230,255,0.04), transparent 60%)',
        }}
      />
      <CursorLight />
      <Navbar />
      <main>
        <Hero />
        <ProductShowcase />
        <EnergySection />
        <Features />
        <Flavors />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
