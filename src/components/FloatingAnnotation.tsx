import { ReactNode } from 'react';

interface Props {
  label: string;
  code?: string;
  align?: 'left' | 'right';
  pulse?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function FloatingAnnotation({
  label,
  code,
  align = 'left',
  pulse = false,
  className = '',
}: Props) {
  return (
    <div
      className={`absolute z-10 items-center gap-3 ${className}`}
      style={{ textAlign: align }}
    >
      <div
        className={`flex items-center gap-2.5 ${
          align === 'right' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <span
          className={`relative flex h-2 w-2 ${
            pulse ? 'animate-pulse' : ''
          }`}
        >
          {pulse && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-ayx-cyan opacity-60 animate-ping" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ayx-cyan" />
        </span>
        <div
          className={`h-px w-8 bg-gradient-to-r ${
            align === 'right' ? 'from-transparent to-ayx-cyan/50' : 'from-ayx-cyan/50 to-transparent'
          }`}
        />
        <div className={align === 'right' ? 'text-right' : 'text-left'}>
          <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-ayx-silver/90 whitespace-nowrap">
            {label}
          </div>
          {code && (
            <div className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] text-ayx-steel/50 whitespace-nowrap mt-0.5">
              {code}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
