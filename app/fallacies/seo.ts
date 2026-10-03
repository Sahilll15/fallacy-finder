import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '../site';

const OG_ALT = 'fallacy finder showing a two speaker debate about bike lanes with ad hominem and strawman lines underlined';

export const TERM_SET_ID = `${SITE_URL}/fallacies#set`;

/** Metadata with a self canonical and matching Open Graph and Twitter fields. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const full = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'article', siteName: SITE_NAME, title: full, description, url: path, locale: 'en_US', images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: OG_ALT }] },
    twitter: { card: 'summary_large_image', creator: '@chalke1015', title: full, description, images: [{ url: '/twitter-image.png', alt: OG_ALT }] },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}
