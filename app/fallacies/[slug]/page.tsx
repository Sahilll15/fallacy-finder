import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FALLACIES, FLAG, MAYBE, fallacyBySlug, fallacySlug } from '../../lib';
import { APP_ID, jsonLdScript, LAST_UPDATED, SITE_URL } from '../../site';
import { hueVar } from '../../ui/bits';
import { PageHeader } from '../../ui/PageHeader';
import { SiteFooter } from '../../ui/SiteFooter';
import { breadcrumbs, pageMetadata, TERM_SET_ID } from '../seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return FALLACIES.map((f) => ({ slug: fallacySlug(f) }));
}

const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const firstSentence = (s: string) => s.slice(0, s.indexOf('. ') + 1 || undefined);

export async function generateMetadata({ params }: PageProps<'/fallacies/[slug]'>) {
  const f = fallacyBySlug((await params).slug);
  if (!f) return {};
  return pageMetadata(
    `${sentenceCase(f.name)} fallacy: definition and example`,
    `${firstSentence(f.definition)} See an example of the ${f.name} fallacy and how to check your own text for it.`,
    `/fallacies/${fallacySlug(f)}`,
  );
}

export default async function FallacyPage({ params }: PageProps<'/fallacies/[slug]'>) {
  const f = fallacyBySlug((await params).slug);
  if (!f) notFound();
  const url = `${SITE_URL}/fallacies/${fallacySlug(f)}`;
  const others = FALLACIES.filter((o) => o.key !== f.key);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbs([
        { name: 'fallacy finder', path: '/' },
        { name: 'Fallacies', path: '/fallacies' },
        { name: f.name, path: `/fallacies/${fallacySlug(f)}` },
      ]),
      {
        '@type': 'DefinedTerm',
        '@id': `${url}#term`,
        name: f.name,
        description: f.definition,
        url,
        inDefinedTermSet: { '@id': TERM_SET_ID },
      },
      {
        '@type': 'Article',
        headline: `${sentenceCase(f.name)} fallacy: definition and example`,
        description: firstSentence(f.definition),
        url,
        mainEntityOfPage: url,
        about: { '@id': `${url}#term` },
        dateModified: LAST_UPDATED,
        inLanguage: 'en',
        author: { '@id': 'https://sahilchalke.com/#person' },
        publisher: { '@id': 'https://sahilchalke.com/#person' },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mentions: { '@id': APP_ID },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <PageHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24" style={hueVar(f.hue)}>
        <nav aria-label="breadcrumb" className="pt-6 text-sm text-ink-soft">
          <Link href="/" className="underline-offset-4 hover:underline">
            fallacy finder
          </Link>{' '}
          /{' '}
          <Link href="/fallacies" className="underline-offset-4 hover:underline">
            fallacies
          </Link>{' '}
          / {f.name}
        </nav>

        <section className="pt-6 pb-8">
          <h1 className="font-serif text-[40px] leading-[1.05] tracking-tight text-ink sm:text-[60px]">{f.name} fallacy</h1>
          <p className="mt-3 text-lg font-medium" style={{ color: 'var(--hue)' }}>
            {f.short}
          </p>
        </section>

        <article className="sheet grain space-y-8 rounded-[32px] p-6 sm:p-8">
          <section>
            <h2 className="font-serif text-3xl text-ink">what it is</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{f.definition}</p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-ink">an example</h2>
            <p className="mt-3 border-l-2 pl-4 font-serif text-[21px] leading-snug text-ink italic" style={{ borderColor: 'var(--hue)' }}>
              {f.example}
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
              <span className="font-medium text-ink">Why it does not hold up.</span> {f.why}
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-ink">how fallacy finder spots it</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
              Your text is split into sentences, and Jev is asked this about each one:
            </p>
            <p className="mt-3 rounded-2xl bg-white/45 px-4 py-3 font-serif text-[19px] leading-snug text-ink">{f.question}</p>
            <ul className="mt-4 space-y-2 text-[16px] leading-relaxed text-ink-soft">
              <li>
                <span className="font-medium text-ink">Counts as {f.name}</span> when {f.criteria.true}.
              </li>
              <li>
                <span className="font-medium text-ink">Does not count</span> when {f.criteria.false}.
              </li>
            </ul>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              Jev answers with a probability. A line gets a solid underline at {Math.round(FLAG * 100)}% or higher and a dotted one from{' '}
              {Math.round(MAYBE * 100)}%. The same sentence is checked for the seven other fallacies at the same time, and one line can
              carry more than one.
            </p>
          </section>
        </article>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-sheet shadow-[0_10px_30px_-12px_rgba(37,35,32,0.7)]"
          >
            check your own text
          </Link>
          <span className="text-sm text-ink-soft">Paste an argument and see which lines use {f.name}.</span>
        </div>

        <section aria-labelledby="others" className="mt-14">
          <h2 id="others" className="font-serif text-3xl text-ink">
            other fallacies
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.key}>
                <Link href={`/fallacies/${fallacySlug(o)}`} className="font-medium text-ink underline-offset-4 hover:underline">
                  {o.name}
                </Link>
                <span className="text-ink-soft">, {o.short}</span>
              </li>
            ))}
          </ul>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
