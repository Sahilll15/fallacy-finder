import Link from 'next/link';
import { FALLACIES, fallacySlug, type FallacyKey } from '../lib';
import { hueVar } from './bits';

export function FieldGuide({ counts }: { counts: Partial<Record<FallacyKey, number>> | null }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {FALLACIES.map((f) => {
        const n = counts?.[f.key] ?? 0;
        return (
          <li
            key={f.key}
            id={`guide-${f.key}`}
            className="rounded-[24px] bg-white/35 p-5 ring-1 ring-white/50"
            style={hueVar(f.hue)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-2xl leading-tight text-ink">{f.name}</h3>
                <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--hue)' }}>
                  {f.short}
                </p>
              </div>
              {counts && (
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${n ? 'text-white' : 'bg-ink/5 text-ink-faint'}`}
                  style={n ? { background: 'var(--hue)' } : undefined}
                >
                  {n ? `${n} in this text` : 'not found'}
                </span>
              )}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.definition}</p>
            <p className="mt-3 border-l-2 pl-3 font-serif text-[17px] leading-snug text-ink italic" style={{ borderColor: 'var(--hue)' }}>
              {f.example}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">{f.why}</p>
            <Link href={`/fallacies/${fallacySlug(f)}`} className="mt-3 inline-block text-sm font-medium text-ink underline underline-offset-4">
              More on {f.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
