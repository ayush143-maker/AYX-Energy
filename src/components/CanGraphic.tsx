interface Props {
  accent: string;
  name: string;
  code: string;
}

export default function CanGraphic({ accent, name, code }: Props) {
  return (
    <div className="relative h-full w-auto max-w-[160px] aspect-[3/5] mx-auto">
      {/* Underglow */}
      <div className="absolute inset-x-2 bottom-1 h-10 rounded-full blur-xl opacity-50" style={{ background: accent }} aria-hidden />

      {/* Can container */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top lid */}
        <div className="relative h-[8%] flex-shrink-0">
          <div className="absolute inset-0 rounded-t-sm" style={{ background: 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 100%)' }} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/4 h-1 bg-ayx-ink/30 rounded-sm" />
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-hidden bg-ayx-white shadow-[inset_8px_0_15px_rgba(0,0,0,0.04),inset_-8px_0_15px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.05)]">
          
          {/* Vertical highlight */}
          <div className="absolute inset-y-0 left-[25%] w-[15%] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
          
          {/* Branding */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2">
            <div className="font-sans font-black tracking-tighter text-4xl text-ayx-ink">{name === 'ORIGINAL' ? 'AYX' : name === 'PULSE' ? 'AYX' : 'AYX'}</div>
            <div className="text-[8px] font-semibold uppercase tracking-[0.2em] text-ayx-muted">Energy Drink</div>
            <div className="h-0.5 w-8 mt-1" style={{ background: accent }} />
            <div className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: accent }}>{name}</div>
            <div className="text-[7px] font-medium uppercase tracking-widest text-ayx-muted/50 absolute bottom-4">{code}</div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative h-[5%] flex-shrink-0">
          <div className="absolute inset-0 rounded-b-sm" style={{ background: 'linear-gradient(180deg, #d1d5db 0%, #6b7280 100%)' }} />
        </div>
      </div>
    </div>
  );
}
