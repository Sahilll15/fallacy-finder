'use client';

import { FALLACY_BY_KEY, FLAG, MAYBE, flagsOf, type Claim, type FallacyKey, type ScoredClaim } from '../lib';
import { Avatar, hueVar, speakerName } from './bits';

type Group<C> = { message: number; speaker: Claim['speaker']; claims: C[] };

function groupByMessage<C extends Claim>(claims: C[]) {
  const groups: Group<C>[] = [];
  for (const c of claims) {
    const last = groups[groups.length - 1];
    if (last && last.message === c.message) last.claims.push(c);
    else groups.push({ message: c.message, speaker: c.speaker, claims: [c] });
  }
  return groups;
}

export function primaryOf(c: ScoredClaim): { key: FallacyKey; p: number; sure: boolean } | null {
  const [top] = flagsOf(c, MAYBE);
  if (!top) return null;
  return { ...top, sure: top.p >= FLAG };
}

function Bubble({ speaker, debate, children, delay }: { speaker: Claim['speaker']; debate: boolean; children: React.ReactNode; delay: number }) {
  const right = debate && speaker === 'B';
  return (
    <li className={`animate-rise flex ${right ? 'justify-end' : ''}`} style={{ ['--delay' as string]: `${delay}ms` }}>
      <div className={`w-full ${debate ? 'max-w-[92%] sm:max-w-[86%]' : ''}`}>
        <div className={`mb-2 flex items-center gap-2 ${right ? 'flex-row-reverse' : ''}`}>
          <Avatar speaker={speaker} size={24} />
          <span className="font-serif text-[15px] text-ink-faint italic">{speakerName(speaker)}</span>
        </div>
        <div
          className={`font-serif text-[19px] leading-[1.6] text-ink sm:text-[22px] ${
            debate ? `rounded-[22px] px-5 py-4 ${right ? 'rounded-tr-md bg-white/45' : 'rounded-tl-md bg-sheet-deep/70'}` : ''
          }`}
        >
          {children}
        </div>
      </div>
    </li>
  );
}

export function SkeletonThread({ claims, debate }: { claims: Claim[]; debate: boolean }) {
  return (
    <ol className="space-y-7" aria-hidden>
      {groupByMessage(claims).map((g, i) => (
        <Bubble key={g.message} speaker={g.speaker} debate={debate} delay={i * 60}>
          {g.claims.map((c) => (
            <span key={c.id}>
              <span className="skeleton-line">{c.text}</span>{' '}
            </span>
          ))}
        </Bubble>
      ))}
    </ol>
  );
}

export function Thread({
  claims,
  debate,
  selected,
  flaggedOnly,
  onSelect,
}: {
  claims: ScoredClaim[];
  debate: boolean;
  selected: number | null;
  flaggedOnly: boolean;
  onSelect: (id: number) => void;
}) {
  const groups = groupByMessage(claims).filter((g) => !flaggedOnly || g.claims.some((c) => primaryOf(c)?.sure));

  if (!groups.length) {
    return (
      <p className="py-10 text-center font-serif text-xl text-ink-faint italic">
        nothing crossed the line. every sentence came back under {Math.round(FLAG * 100)}%.
      </p>
    );
  }

  let flagIndex = 0;
  return (
    <ol className="space-y-7">
      {groups.map((g, gi) => (
        <Bubble key={g.message} speaker={g.speaker} debate={debate} delay={gi * 70}>
          {g.claims.map((c) => {
            const top = primaryOf(c);
            const f = top ? FALLACY_BY_KEY[top.key] : null;
            const dim = flaggedOnly && !top?.sure;
            const delay = 300 + flagIndex++ * 90;
            const extra = top?.sure ? flagsOf(c).length - 1 : 0;
            return (
              <span key={c.id} className={dim ? 'opacity-40' : ''}>
                <span
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  aria-expanded={selected === c.id}
                  aria-label={
                    f
                      ? `${c.text}. ${top!.sure ? 'flagged' : 'possible'} ${f.name}, ${Math.round(top!.p * 100)} percent. open details`
                      : `${c.text}. no fallacy flagged. open details`
                  }
                  onClick={() => onSelect(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(c.id);
                    }
                  }}
                  className={`claim ${top ? (top.sure ? 'claim-flag' : 'claim-maybe') : ''}`}
                  style={{ ...(f ? hueVar(f.hue) : {}), ['--delay' as string]: `${delay}ms` }}
                >
                  {c.text}
                </span>
                {f && top && (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => onSelect(c.id)}
                    className={`animate-fade mx-1.5 inline-flex translate-y-[-3px] items-center gap-1 rounded-full px-2 py-0.5 align-middle font-sans text-[11px] font-semibold tracking-wide ${
                      top.sure ? 'text-white' : 'border border-current bg-transparent'
                    }`}
                    style={top.sure ? { background: `var(--h-${f.hue})` } : { color: `var(--h-${f.hue})` }}
                  >
                    {top.sure ? '' : 'maybe '}
                    {f.name}
                    {extra > 0 && <span className="opacity-80">+{extra}</span>}
                  </button>
                )}{' '}
              </span>
            );
          })}
        </Bubble>
      ))}
    </ol>
  );
}
