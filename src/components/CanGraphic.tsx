interface Props {
  accent: string;
  accent2: string;
  name: string;
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CanGraphic({ accent, accent2, name, code, size = 'md' }: Props) {
  const sizeClass =
    size === 'lg' ? 'w-32 sm:w-40 h-full' : size === 'sm' ? 'w-24 h-56' : 'w-28 sm:w-32 h-64 sm:h-72';

  return (
    <div className={`relative ${sizeClass}`}>
      {/* Underglow */}
      <div
        className="absolute inset-x-2 bottom-1 h-10 rounded-full blur-2xl opacity-70"
        style={{ background: `radial-gradient(ellipse at center, ${accent}, transparent 70%)` }}
        aria-hidden
      />

      {/* Can container */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top lid */}
        <div className="relative h-[10%] flex-shrink-0">
          <div
            className="absolute inset-0 rounded-t-[10px] overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #e2e8f0 0%, #9fb4cc 55%, #4a5a72 100%)',
              boxShadow:
                'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-1/2 h-1.5 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #f0f4f8, #9fb4cc)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-0.5 rounded-full bg-black/40" />
          </div>
        </div>

        {/* Body */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, #0a0e16 0%, #1a2030 35%, #161c28 65%, #0a0e16 100%)',
            boxShadow:
              'inset 10px 0 18px rgba(255,255,255,0.05), inset -10px 0 18px rgba(0,0,0,0.6), 0 24px 50px rgba(0,0,0,0.6)',
          }}
        >
          {/* Vertical highlight reflections */}
          <div className="absolute inset-y-0 left-[22%] w-[18%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute inset-y-0 right-[28%] w-[10%] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Top accent band */}
          <div
            className="absolute top-[18%] inset-x-0 h-px"
            style={{ background: accent, opacity: 0.7 }}
          />
          <div
            className="absolute top-[20%] inset-x-0 h-px"
            style={{ background: accent, opacity: 0.25 }}
          />

          {/* Logo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
            <div
              className="font-display font-black tracking-[0.08em] leading-none"
              style={{
                color: accent,
                fontSize: size === 'lg' ? '2.2rem' : '1.4rem',
                textShadow: `0 0 24px ${accent}80, 0 0 6px ${accent}`,
              }}
            >
              AYX
            </div>
            <div className="text-[6px] sm:text-[7px] font-mono uppercase tracking-[0.3em] text-ayx-silver/90">
              Energy Drink
            </div>
            <div
              className="text-[5px] sm:text-[6px] font-mono uppercase tracking-[0.3em] mt-1 px-2 py-0.5 rounded"
              style={{ color: accent2, border: `1px solid ${accent2}40` }}
            >
              {name}
            </div>
          </div>

          {/* Bottom accent band */}
          <div
            className="absolute bottom-[18%] inset-x-0 h-px"
            style={{ background: accent, opacity: 0.25 }}
          />
          <div
            className="absolute bottom-[20%] inset-x-0 h-px"
            style={{ background: accent, opacity: 0.7 }}
          />

          {/* Code at bottom */}
          <div className="absolute bottom-[6%] inset-x-0 text-center text-[5px] sm:text-[6px] font-mono uppercase tracking-[0.4em] text-ayx-steel/50">
            {code}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative h-[5%] flex-shrink-0">
          <div
            className="absolute inset-0 rounded-b-[6px]"
            style={{
              background: 'linear-gradient(180deg, #2a3140 0%, #0a0e16 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
