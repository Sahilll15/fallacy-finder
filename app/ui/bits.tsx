import type { CSSProperties } from 'react';
import type { Speaker } from '../lib';

export function hueVar(hue: string) {
  return { '--hue': `var(--h-${hue})` } as CSSProperties;
}

export function speakerName(s: Speaker) {
  return s ? `speaker ${s.toLowerCase()}` : 'the text';
}

export function Avatar({ speaker, size = 26 }: { speaker: Speaker; size?: number }) {
  if (speaker === 'A') {
    return (
      <span
        aria-hidden
        className="inline-grid shrink-0 place-items-center rounded-[7px] bg-ember text-white"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 20 20" width={size * 0.6} height={size * 0.6} fill="currentColor">
          <path d="M10 1.5l1.4 5.2 4.6-2.8-2.8 4.6 5.3 1.5-5.3 1.4 2.8 4.7-4.6-2.8L10 18.5l-1.4-5.2-4.6 2.8 2.8-4.7L1.5 10l5.3-1.5L4 3.9l4.6 2.8z" />
        </svg>
      </span>
    );
  }
  if (speaker === 'B') {
    return (
      <span
        aria-hidden
        className="inline-grid shrink-0 place-items-center rounded-full bg-[#3b5675] text-white"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 20 20" width={size * 0.55} height={size * 0.55} fill="currentColor">
          <circle cx="6" cy="6" r="2.6" />
          <circle cx="14" cy="6" r="2.6" />
          <circle cx="10" cy="14" r="2.6" />
        </svg>
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full bg-ink text-sheet"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 20 20" width={size * 0.5} height={size * 0.5} fill="currentColor">
        <path d="M3 11.5C3 7.4 5.3 4.8 8.6 4l.6 1.6C7.4 6.3 6.4 7.6 6.3 9.4H9V16H3zm8 0c0-4.1 2.3-6.7 5.6-7.5l.6 1.6c-1.8.7-2.8 2-2.9 3.8H17V16h-6z" />
      </svg>
    </span>
  );
}

export function Meter({ value, hue = 'none', delay = 0, label }: { value: number; hue?: string; delay?: number; label: string }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <span
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      className="block h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
    >
      <span
        className="animate-grow block h-full rounded-full"
        style={{ width: `${v * 100}%`, background: `var(--h-${hue})`, ['--delay' as string]: `${delay}ms` }}
      />
    </span>
  );
}

export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`glass inline-flex items-center gap-2 rounded-full px-4 py-2 ${className}`}>{children}</span>;
}
