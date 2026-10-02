import { FALLACIES, FALLACY_BY_KEY, STRENGTH_LABELS, pct, scoreboard, sideStats, topFallacy, type ScoredClaim, type SideStats } from '../lib';
import { Avatar, Meter } from './bits';

function evidenceText(s: SideStats) {
  if (s.evidenceRatio === null) return 'no factual claims made';
  return `${s.supportedClaims} of ${s.factualClaims} factual claims backed up`;
}

function strengthLabel(s: SideStats) {
  return STRENGTH_LABELS[Math.max(0, Math.min(3, Math.round(s.avgStrength)))];
}

function Side({ side, stats, lead }: { side: 'A' | 'B'; stats: SideStats; lead: boolean }) {
  const top = topFallacy(stats);
  return (
    <div className={`rounded-[24px] p-5 transition ${lead ? 'bg-white/55 ring-1 ring-white/80' : 'bg-white/25'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar speaker={side} size={26} />
          <span className="font-serif text-lg text-ink">speaker {side.toLowerCase()}</span>
        </div>
        {lead && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold tracking-wide text-sheet">cleaner</span>}
      </div>
      <p className="mt-4 font-serif text-5xl leading-none text-ink tabular-nums">
        {Math.round(stats.clean * 100)}
        <span className="ml-1 text-lg text-ink-faint">/ 100</span>
      </p>
      <p className="mt-1 text-xs text-ink-faint">clean argument score</p>
      <div className="mt-3">
        <Meter value={stats.clean} hue={side === 'A' ? 'a' : 'b'} label={`speaker ${side} clean score`} />
      </div>
      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">fallacies flagged</dt>
          <dd className="font-semibold text-ink tabular-nums">{stats.fallacyCount}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">lines with a flag</dt>
          <dd className="font-semibold text-ink tabular-nums">
            {stats.flaggedClaims} of {stats.claims}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">evidence ratio</dt>
          <dd className="font-semibold text-ink tabular-nums">{stats.evidenceRatio === null ? 'n/a' : pct(stats.evidenceRatio)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">typical strength</dt>
          <dd className="font-semibold text-ink">{strengthLabel(stats)}</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-ink/10 pt-3 text-xs leading-relaxed text-ink-faint">
        {evidenceText(stats)}. {top ? `Leaned most on ${FALLACY_BY_KEY[top].name}.` : 'No fallacy above the line.'}
      </p>
    </div>
  );
}

export function Scoreboard({ claims }: { claims: ScoredClaim[] }) {
  const { a, b, winner, gap } = scoreboard(claims);
  const verdict =
    winner === 'tie' ? 'too close to call' : `speaker ${winner.toLowerCase()} argued cleaner`;
  const detail =
    winner === 'tie'
      ? 'Both sides land within five points of each other on the clean argument score.'
      : `Ahead by ${Math.round(gap * 100)} points, counting flagged lines, argument strength and how often factual claims came with evidence.`;
  const rows = FALLACIES.filter((f) => (a.byFallacy[f.key] ?? 0) + (b.byFallacy[f.key] ?? 0) > 0);
  const maxCount = Math.max(1, ...rows.flatMap((f) => [a.byFallacy[f.key] ?? 0, b.byFallacy[f.key] ?? 0]));

  return (
    <div>
      <h3 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{verdict}</h3>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">{detail}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Side side="A" stats={a} lead={winner === 'A'} />
        <Side side="B" stats={b} lead={winner === 'B'} />
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">fallacies per side</p>
        {rows.length === 0 ? (
          <p className="mt-3 font-serif text-lg text-ink-soft italic">neither side tripped a check.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {rows.map((f, i) => {
              const ca = a.byFallacy[f.key] ?? 0;
              const cb = b.byFallacy[f.key] ?? 0;
              return (
                <li key={f.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
                  <span className="flex items-center justify-end gap-2">
                    <span className="tabular-nums text-ink-soft">{ca}</span>
                    <span className="flex h-2 w-full max-w-40 justify-end overflow-hidden rounded-full bg-ink/5">
                      <span
                        className="animate-grow h-full rounded-full bg-[var(--h-a)]"
                        style={{ width: `${(ca / maxCount) * 100}%`, transformOrigin: 'right', ['--delay' as string]: `${i * 60}ms` }}
                      />
                    </span>
                  </span>
                  <span className="w-32 text-center text-ink sm:w-40">{f.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="flex h-2 w-full max-w-40 overflow-hidden rounded-full bg-ink/5">
                      <span
                        className="animate-grow h-full rounded-full bg-[var(--h-b)]"
                        style={{ width: `${(cb / maxCount) * 100}%`, ['--delay' as string]: `${i * 60}ms` }}
                      />
                    </span>
                    <span className="tabular-nums text-ink-soft">{cb}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Summary({ claims }: { claims: ScoredClaim[] }) {
  const s = sideStats(claims);
  const top = topFallacy(s);
  const cells = [
    { label: 'clean score', value: `${Math.round(s.clean * 100)}`, sub: 'out of 100' },
    { label: 'fallacies', value: String(s.fallacyCount), sub: `${s.flaggedClaims} of ${s.claims} lines flagged` },
    { label: 'evidence ratio', value: s.evidenceRatio === null ? 'n/a' : pct(s.evidenceRatio), sub: evidenceText(s) },
    { label: 'leans on', value: top ? FALLACY_BY_KEY[top].name : 'nothing', sub: top ? `${s.byFallacy[top]} lines` : 'no flags' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cells.map((c, i) => (
        <div key={c.label} className="animate-rise rounded-[22px] bg-white/40 p-4" style={{ ['--delay' as string]: `${i * 60}ms` }}>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">{c.label}</p>
          <p className="mt-1 font-serif text-3xl leading-tight text-ink">{c.value}</p>
          <p className="mt-0.5 text-xs text-ink-faint">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
