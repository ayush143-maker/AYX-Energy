import { useEffect, useState } from 'react';

export type Quality = 'low' | 'medium' | 'high';

export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>('high');

  useEffect(() => {
    const detect = () => {
      if (typeof navigator === 'undefined' || typeof window === 'undefined') return;
      const w = window.innerWidth;
      const cores = (navigator.hardwareConcurrency || 4) as number;
      const memory = (navigator as any).deviceMemory || 4;
      const isMobile = w < 768;
      const isTablet = w < 1280;

      if (isMobile && (cores <= 4 || memory <= 4)) setQuality('low');
      else if (isMobile || isTablet) setQuality('medium');
      else setQuality('high');
    };

    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return quality;
}
