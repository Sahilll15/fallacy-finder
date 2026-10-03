'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FLAG, MAX_CHARS, MAX_CLAIMS, sideStats, toClaims, type Analysis } from './lib';
import { SAMPLES } from './samples';
import { Avatar } from './ui/bits';
import { ClaimCard } from './ui/ClaimCard';
import { FieldGuide } from './ui/FieldGuide';
import { Scoreboard, Summary } from './ui/Scoreboard';
import { SkeletonThread, Thread, primaryOf } from './ui/Thread';

type Mode = 'auto' | 'single' | 'debate';
type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'done'; result: Analysis };

const MODES: { id: Mode; label: string }[] = [
  { id: 'auto', label: 'auto' },
  { id: 'single', label: 'one voice' },
  { id: 'debate', label: 'two speakers' },
];

const cache = new Map<string, Analysis>();

export function FallacyFinder({ footer }: { footer: React.ReactNode }) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('auto');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [pending, setPending] = useState<ReturnType<typeof toClaims> | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLElement>(null);

  const preview = useMemo(() => (text.trim() ? toClaims(text, mode) : null), [text, mode]);
  const over = text.length > MAX_CHARS;
  const loading = status.kind === 'loading';
  const result = status.kind === 'done' ? status.result : null;
  const debate = result?.mode === 'debate';

  const run = useCallback(async (input: string, m: Mode) => {
    if (!input.trim() || input.length > MAX_CHARS) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setSelected(null);
    setFlaggedOnly(false);
    setPending(toClaims(input, m));
    requestAnimationFrame(() => threadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

    const key = `${m}\n${input}`;
    const hit = cache.get(key);
    if (hit) {
      setStatus({ kind: 'done', result: hit });
      return;
    }

    setStatus({ kind: 'loading' });
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: input, mode: m }),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({ error: 'The server sent back something unreadable.' }));
      if (!res.ok) throw new Error(data.error ?? `Request failed with ${res.status}.`);
      cache.set(key, data);
      setStatus({ kind: 'done', result: data });
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }, []);

  const nav = useMemo(() => {
    if (!result) return [];
    const flagged = result.claims.filter((c) => primaryOf(c)?.sure);
    return flaggedOnly && flagged.some((c) => c.id === selected) ? flagged : result.claims;
  }, [result, flaggedOnly, selected]);
  const selectedClaim = result?.claims.find((c) => c.id === selected) ?? null;
  const position = selectedClaim ? nav.findIndex((c) => c.id === selectedClaim.id) : -1;

  const step = useCallback(
    (dir: -1 | 1) => {
      if (!nav.length) return;
      const i = nav.findIndex((c) => c.id === selected);
      setSelected(nav[(i + dir + nav.length) % nav.length].id);
    },
    [nav, selected],
  );
  const close = useCallback(() => setSelected(null), []);

  const stats = result ? sideStats(result.claims) : null;
  const navLink = 'rounded-full px-3 py-1.5 text-ink-soft transition hover:bg-white/60 hover:text-ink';

  return (
    <>
      <header className="sticky top-0 z-40 bg-linear-to-b from-paper via-paper/80 to-transparent px-4 pt-3 pb-5 sm:pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <a href="#top" className="glass flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5" aria-label="fallacy finder, back to top">
            <span className="grid size-8 place-items-center rounded-full bg-ink">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e8795c" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M3 13c2.2-2.4 3.8 2.4 6 0s3.8 2.4 6 0 3.8 2.4 6 0" />
              </svg>
            </span>
            <span className="font-serif text-[19px] text-ink">fallacy finder</span>
          </a>
          <nav aria-label="sections" className="glass flex items-center rounded-full p-1 text-sm">
            <a href="#thread" className={navLink}>
              thread
            </a>
            {debate && (
              <a href="#scoreboard" className={`${navLink} hidden sm:block`}>
                scoreboard
              </a>
            )}
            <a href="#guide" className={navLink}>
              guide
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-3xl px-4 pb-24">
        <section className="pt-12 pb-8 sm:pt-20 sm:pb-10">
          <h1 className="font-serif text-[40px] leading-[1.05] tracking-tight text-ink sm:text-[64px]">
            <span className="mb-4 block font-sans text-xs leading-normal font-semibold tracking-[0.14em] text-ink-soft uppercase">
              Logical fallacy checker
            </span>
            paste an argument.
            <br />
            <span className="text-ink-faint italic">see where it slips.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            Every sentence is checked for eight common fallacies, whether it makes a factual claim, and whether it backs that claim up.
            Start lines with <kbd className="rounded bg-white/50 px-1.5 font-sans text-[15px]">A:</kbd> and{' '}
            <kbd className="rounded bg-white/50 px-1.5 font-sans text-[15px]">B:</kbd> to score a two sided debate.
          </p>
        </section>

        <section aria-label="your text" className="sheet grain rounded-[32px] p-5 transition-shadow focus-within:ring-2 focus-within:ring-ink/25 sm:p-7">
          <div className="mb-3 flex items-center gap-2">
            <span aria-hidden className="grid size-6 place-items-center rounded-full bg-[#bdb7ac] text-white">
              <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                <circle cx="10" cy="7" r="3.5" />
                <path d="M3 17c.8-3.3 3.6-5 7-5s6.2 1.7 7 5z" />
              </svg>
            </span>
            <label htmlFor="input" className="font-serif text-[15px] text-ink-faint italic">
              you
            </label>
          </div>
          <textarea
            id="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(text, mode);
            }}
            rows={7}
            placeholder={'an op-ed, a reply thread, a debate transcript...\n\nA: we should...\nB: but you...'}
            className="block min-h-48 w-full resize-y rounded-xl bg-transparent font-serif text-[19px] leading-relaxed text-ink placeholder:text-ink-faint/80 focus:outline-none focus-visible:outline-none sm:text-[22px]"
            aria-describedby="input-meta"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <div role="radiogroup" aria-label="how to read the text" className="flex rounded-full bg-ink/5 p-1 text-sm">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-full px-3 py-1.5 transition ${mode === m.id ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p id="input-meta" className={`text-xs tabular-nums ${over ? 'font-semibold text-ember' : 'text-ink-faint'}`} aria-live="polite">
              {preview
                ? `${preview.debate ? 'two speakers' : 'one voice'}, ${preview.claims.length} line${preview.claims.length === 1 ? '' : 's'}${preview.truncated ? ' (cap reached)' : ''} · `
                : ''}
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">try a sample</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setText(s.text);
                      setMode('auto');
                      run(s.text, 'auto');
                    }}
                    className="glass rounded-full px-3.5 py-1.5 text-left text-sm text-ink transition hover:-translate-y-0.5 hover:bg-white/70 disabled:opacity-50"
                  >
                    {s.label}
                    <span className="ml-1.5 text-ink-faint">{s.kind}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => run(text, mode)}
              disabled={!text.trim() || over || loading}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-sheet shadow-[0_10px_30px_-12px_rgba(37,35,32,0.7)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
            >
              {loading ? 'reading' : 'find fallacies'}
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="transition group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </section>

        <section id="thread" ref={threadRef} aria-labelledby="thread-title" className="mt-16">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="thread-title" className="font-serif text-4xl text-ink">
                thread
              </h2>
              <p className="mt-1 text-sm text-ink-faint">
                Solid underline means {Math.round(FLAG * 100)}% or higher, dotted means possible. Tap any line for its card.
              </p>
            </div>
            {result && (
              <button
                type="button"
                aria-pressed={flaggedOnly}
                onClick={() => setFlaggedOnly((v) => !v)}
                className={`glass rounded-full px-5 py-2 font-serif text-[17px] transition ${flaggedOnly ? 'bg-white/80 text-ink' : 'text-ink-soft hover:text-ink'}`}
              >
                {flaggedOnly ? 'flagged only' : 'all lines'}
              </button>
            )}
          </div>

          <div className="sheet grain rounded-[32px] p-5 sm:p-8" aria-busy={loading}>
            {status.kind === 'idle' && (
              <div className="py-6">
                <ol className="space-y-6 opacity-60" aria-hidden>
                  <li className="flex items-center gap-2">
                    <Avatar speaker="A" size={22} />
                    <span className="h-3 w-2/3 rounded-full bg-ink/10" />
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="h-3 w-1/2 rounded-full bg-ink/10" />
                    <Avatar speaker="B" size={22} />
                  </li>
                  <li className="flex items-center gap-2">
                    <Avatar speaker="A" size={22} />
                    <span className="h-3 w-3/5 rounded-full bg-ink/10" />
                  </li>
                </ol>
                <p className="mt-8 text-center font-serif text-xl text-ink-soft italic">your thread shows up here once you run a check.</p>
              </div>
            )}

            {status.kind === 'loading' && pending && (
              <div>
                <p className="mb-6 flex items-center gap-2 text-sm text-ink-soft" role="status">
                  <span className="flex gap-1" aria-hidden>
                    <span className="dot size-1.5 rounded-full bg-ember" />
                    <span className="dot size-1.5 rounded-full bg-ember [animation-delay:150ms]" />
                    <span className="dot size-1.5 rounded-full bg-ember [animation-delay:300ms]" />
                  </span>
                  asking eleven questions about each of {pending.claims.length} lines
                </p>
                <SkeletonThread claims={pending.claims} debate={pending.debate} />
              </div>
            )}

            {status.kind === 'error' && (
              <div className="animate-rise py-8 text-center" role="alert">
                <p className="font-serif text-2xl text-ink">that did not go through.</p>
                <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">{status.message}</p>
                <button type="button" onClick={() => run(text, mode)} className="glass mt-5 rounded-full px-5 py-2 text-sm font-medium text-ink">
                  try again
                </button>
              </div>
            )}

            {result && stats && (
              <div>
                {result.truncated && (
                  <p className="mb-5 rounded-2xl bg-ember-soft/70 px-4 py-2.5 text-sm text-ink">
                    Only the first {MAX_CLAIMS} lines were checked. Trim the text to focus on a different part.
                  </p>
                )}
                {!debate && (
                  <div className="mb-8">
                    <Summary claims={result.claims} />
                  </div>
                )}
                <Thread claims={result.claims} debate={debate} selected={selected} flaggedOnly={flaggedOnly} onSelect={setSelected} />
                <p className="mt-8 border-t border-ink/10 pt-4 text-xs text-ink-faint tabular-nums">
                  {result.claims.length} lines, {stats.fallacyCount} flags, {result.inputTokens.toLocaleString()} input tokens, about $
                  {result.cost.toFixed(5)} on Jev
                </p>
              </div>
            )}
          </div>
        </section>

        {result && debate && (
          <section id="scoreboard" aria-labelledby="scoreboard-title" className="mt-16">
            <h2 id="scoreboard-title" className="mb-5 font-serif text-4xl text-ink">
              scoreboard
            </h2>
            <div className="sheet grain rounded-[32px] p-5 sm:p-8">
              <Scoreboard claims={result.claims} />
            </div>
          </section>
        )}

        <section id="guide" aria-labelledby="guide-title" className="mt-16">
          <h2 id="guide-title" className="font-serif text-4xl text-ink">
            fallacy field guide
          </h2>
          <p className="mt-1 mb-6 max-w-xl text-sm leading-relaxed text-ink-soft">
            The eight patterns every line is checked for. Definitions and examples are written by hand. Only the percentages come from the
            model. Each one also has{' '}
            <Link href="/fallacies" className="font-medium text-ink underline underline-offset-4">
              its own page
            </Link>{' '}
            with the exact question the checker asks.
          </p>
          <FieldGuide counts={stats ? stats.byFallacy : null} />
        </section>

        {footer}
      </main>

      {selectedClaim && result && (
        <ClaimCard claim={selectedClaim} position={position + 1} total={nav.length} onClose={close} onStep={step} />
      )}
    </>
  );
}
