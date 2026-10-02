'use client';

import { useEffect, useRef } from 'react';
import { FALLACIES, FALLACY_BY_KEY, FLAG, STRENGTH, STRENGTH_LABELS, pct, type ScoredClaim } from '../lib';
import { Avatar, Meter, hueVar, speakerName } from './bits';
import { primaryOf } from './Thread';

export function ClaimCard({
  claim,
  position,
  total,
  onClose,
  onStep,
}: {
  claim: ScoredClaim;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: -1 | 1) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const top = primaryOf(claim);
  const f = top ? FALLACY_BY_KEY[top.key] : null;
  const ranked = [...FALLACIES].sort((a, b) => claim.fallacies[b.key] - claim.fallacies[a.key]);
  const strengthIdx = Math.max(0, Math.min(STRENGTH.length - 1, Math.round(claim.strength)));

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="close details"
        tabIndex={-1}
        onClick={onClose}
        className="animate-fade absolute inset-0 bg-[#2b2824]/30 backdrop-blur-[3px]"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title"
        className="sheet grain animate-sheet relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[30px] p-6 pb-8 sm:rounded-[30px] sm:p-8"
        style={f ? hueVar(f.hue) : undefined}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar speaker={claim.speaker} size={24} />
            <span className="font-serif text-[15px] text-ink-faint italic">
              {speakerName(claim.speaker)}, line {position} of {total}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => onStep(-1)} aria-label="previous line" className="glass grid size-9 place-items-center rounded-full text-ink-soft hover:text-ink">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="next line" className="glass grid size-9 place-items-center rounded-full text-ink-soft hover:text-ink">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 3 5 5-5 5" /></svg>
            </button>
            <button ref={closeRef} type="button" onClick={onClose} className="glass rounded-full px-4 py-2 text-sm font-medium text-ink">
              close
            </button>
          </div>
        </div>

        <blockquote className="border-l-2 pl-4 font-serif text-xl leading-snug text-ink" style={{ borderColor: f ? 'var(--hue)' : 'var(--color-line)' }}>
          {claim.text}
        </blockquote>

        {f && top ? (
          <div className="mt-7">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--hue)' }}>
              {top.sure ? 'likely fallacy' : 'possible fallacy'}
            </p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <h2 id="card-title" className="font-serif text-4xl leading-none text-ink">
                {f.name}
              </h2>
              <p className="font-serif text-4xl leading-none tabular-nums" style={{ color: 'var(--hue)' }}>
                {pct(top.p)}
              </p>
            </div>
            <div className="mt-3">
              <Meter value={top.p} hue={f.hue} label={`${f.name} probability`} />
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{f.definition}</p>
            <div className="mt-4 rounded-2xl bg-white/45 p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">classic example</p>
              <p className="mt-1.5 font-serif text-lg leading-snug text-ink italic">{f.example}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.why}</p>
            </div>
          </div>
        ) : (
          <div className="mt-7">
            <h2 id="card-title" className="font-serif text-3xl text-ink">
              no fallacy flagged
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              None of the eight checks came back above {pct(FLAG)} for this line. That does not make it true, only that the reasoning
              does not lean on one of these patterns.
            </p>
          </div>
        )}

        <div className="mt-7 grid grid-cols-3 gap-2">
          {[
            { label: 'factual claim', value: pct(claim.factual), sub: claim.factual >= 0.5 ? 'checkable' : 'opinion or other' },
            { label: 'evidence', value: pct(claim.evidence), sub: claim.evidence >= 0.5 ? 'backed up' : 'not shown' },
            { label: 'strength', value: STRENGTH_LABELS[strengthIdx], sub: `${claim.strength.toFixed(1)} of 3` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/40 p-3">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">{s.label}</p>
              <p className="mt-1 font-serif text-xl leading-tight text-ink">{s.value}</p>
              <p className="text-xs text-ink-faint">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">all eight checks</p>
          <ul className="mt-3 space-y-2.5">
            {ranked.map((r, i) => {
              const p = claim.fallacies[r.key];
              return (
                <li key={r.key} className="grid grid-cols-[minmax(0,9.5rem)_1fr_2.75rem] items-center gap-3 text-sm">
                  <span className={p >= FLAG ? 'font-semibold text-ink' : 'text-ink-soft'}>{r.name}</span>
                  <Meter value={p} hue={p >= FLAG ? r.hue : 'none'} delay={i * 40} label={`${r.name} probability`} />
                  <span className="text-right tabular-nums text-ink-soft">{pct(p)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-7 text-xs leading-relaxed text-ink-faint">
          Percentages come from Jev, which answers each check as a probability. The definitions and examples are a fixed field guide, not
          generated text.
        </p>
      </section>
    </div>
  );
}
