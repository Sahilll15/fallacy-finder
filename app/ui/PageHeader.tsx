import Link from 'next/link';

const navLink = 'rounded-full px-3 py-1.5 text-ink-soft transition hover:bg-white/60 hover:text-ink';

export function PageHeader() {
  return (
    <header className="px-4 pt-3 pb-5 sm:pt-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <Link href="/" className="glass flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5">
          <span className="grid size-8 place-items-center rounded-full bg-ink">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e8795c" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M3 13c2.2-2.4 3.8 2.4 6 0s3.8 2.4 6 0 3.8 2.4 6 0" />
            </svg>
          </span>
          <span className="font-serif text-[19px] text-ink">fallacy finder</span>
        </Link>
        <nav aria-label="site" className="glass flex items-center rounded-full p-1 text-sm">
          <Link href="/fallacies" className={navLink}>
            fallacies
          </Link>
          <Link href="/" className={navLink}>
            check text
          </Link>
        </nav>
      </div>
    </header>
  );
}
