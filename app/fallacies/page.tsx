import Link from 'next/link';
import { FALLACIES, fallacySlug } from '../lib';
import { jsonLdScript, LAST_UPDATED, SITE_URL } from '../site';
import { hueVar } from '../ui/bits';
import { PageHeader } from '../ui/PageHeader';
import { SiteFooter } from '../ui/SiteFooter';
import { breadcrumbs, pageMetadata, TERM_SET_ID } from './seo';

const TITLE = 'Logical fallacies with examples';
const DESCRIPTION =
  'Eight common logical fallacies, from ad hominem to circular reasoning, each with a plain definition, a worked example and the question used to spot it.';

export const metadata = pageMetadata(TITLE, DESCRIPTION, '/fallacies');

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    breadcrumbs([
      { name: 'fallacy finder', path: '/' },
      { name: 'Fallacies', path: '/fallacies' },
    ]),
    {
      '@type': 'DefinedTermSet',
      '@id': TERM_SET_ID,
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/fallacies`,
      dateModified: LAST_UPDATED,
      hasDefinedTerm: FALLACIES.map((f) => ({
        '@type': 'DefinedTerm',
        name: f.name,
        description: f.definition,
        url: `${SITE_URL}/fallacies/${fallacySlug(f)}`,
      })),
    },
  ],
};

export default function FallaciesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <PageHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24">
        <nav aria-label="breadcrumb" className="pt-6 text-sm text-ink-soft">
          <Link href="/" className="underline-offset-4 hover:underline">
            fallacy finder
          </Link>{' '}
          / fallacies
        </nav>
        <section className="pt-6 pb-10">
          <h1 className="font-serif text-[40px] leading-[1.05] tracking-tight text-ink sm:text-[56px]">logical fallacies, with examples</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            These are the eight patterns fallacy finder checks every sentence for. Each page has a plain definition, a worked example, and
            the exact yes or no question the checker asks about a line.
          </p>
        </section>

        <ul className="grid gap-3 sm:grid-cols-2">
          {FALLACIES.map((f) => (
            <li key={f.key} className="sheet rounded-[24px] p-5" style={hueVar(f.hue)}>
              <h2 className="font-serif text-2xl leading-tight text-ink">
                <Link href={`/fallacies/${fallacySlug(f)}`} className="underline-offset-4 hover:underline">
                  {f.name}
                </Link>
              </h2>
              <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--hue)' }}>
                {f.short}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.definition}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[17px] text-ink-soft">
          Have an op-ed, a reply thread or a debate transcript?{' '}
          <Link href="/" className="font-medium text-ink underline underline-offset-4">
            Check it for all eight
          </Link>
          .
        </p>

        <SiteFooter />
      </main>
    </>
  );
}
