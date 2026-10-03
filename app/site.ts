export const SITE_URL = 'https://fallacy-finder-nine.vercel.app';
export const SITE_NAME = 'fallacy finder';
export const SITE_TITLE = 'fallacy finder: spot logical fallacies in an argument';
export const SITE_DESCRIPTION =
  'Free logical fallacy checker. Paste an argument, op-ed or debate and see which lines use ad hominem, strawman, slippery slope or other common fallacies.';
export const SITE_KEYWORDS = ['logical fallacy checker', 'fallacy detector', 'fallacy finder', 'ad hominem', 'strawman argument', 'slippery slope fallacy', 'debate analysis', 'critical thinking'];

const AUTHOR = {
  '@type': 'Person',
  name: 'Sahil Chalke',
  url: 'https://sahilchalke.com',
  sameAs: ['https://github.com/Sahilll15', 'https://x.com/chalke1015'],
};

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: AUTHOR,
  creator: AUTHOR,
};

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
