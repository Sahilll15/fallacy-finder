export const SITE_URL = 'https://fallacy-finder-nine.vercel.app';
export const SITE_NAME = 'fallacy finder';
export const SITE_TITLE = 'fallacy finder: spot logical fallacies in an argument';
export const SITE_DESCRIPTION =
  'Free logical fallacy checker. Paste an argument, op-ed or debate and see which lines use ad hominem, strawman, slippery slope or other common fallacies.';
export const SITE_KEYWORDS = ['logical fallacy checker', 'fallacy detector', 'fallacy finder', 'ad hominem', 'strawman argument', 'slippery slope fallacy', 'debate analysis', 'critical thinking'];

export const REPO_URL = 'https://github.com/Sahilll15/fallacy-finder';
// Bump only when page content changes; feeds sitemap lastModified.
export const LAST_UPDATED = '2026-10-04';

const PERSON_ID = 'https://sahilchalke.com/#person';
const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
    },
    {
      '@type': 'WebApplication',
      '@id': APP_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      isPartOf: { '@id': WEBSITE_ID },
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: 'en',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      screenshot: `${SITE_URL}/opengraph-image.png`,
      featureList: ['Checks each sentence for eight common fallacies', 'Flags factual claims that lack support', 'Scores both sides of a two speaker debate'],
      author: { '@id': PERSON_ID },
      creator: { '@id': PERSON_ID },
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Sahil Chalke',
      url: 'https://sahilchalke.com',
      sameAs: ['https://github.com/Sahilll15', 'https://x.com/chalke1015'],
    },
  ],
};

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export const TOOLS = [
  { name: 'ToneRadar', url: 'https://toneradar.vercel.app', blurb: 'check the tone of a message' },
  { name: 'Headline Arena', url: 'https://headline-arena-gamma.vercel.app', blurb: 'compare headlines side by side' },
  { name: 'FinePrint', url: 'https://fineprint-beta.vercel.app', blurb: 'find risky clauses in a contract' },
  { name: 'fallacy finder', url: 'https://fallacy-finder-nine.vercel.app', blurb: 'spot logical fallacies' },
  { name: 'PitchPanel', url: 'https://pitchpanel.vercel.app', blurb: 'startup pitch feedback' },
  { name: 'Interview Coach', url: 'https://interview-coach-seven-rose.vercel.app', blurb: 'mock interview practice' },
  { name: 'Minutes', url: 'https://minutes-sand.vercel.app', blurb: 'meeting minutes from audio' },
  { name: 'SplitSnap', url: 'https://splitsnap-sandy.vercel.app', blurb: 'split a bill from a receipt photo' },
  { name: 'AskCSV', url: 'https://askcsv-seven.vercel.app', blurb: 'ask questions about a CSV' },
  { name: 'ShipNotes', url: 'https://shipnotes-mu.vercel.app', blurb: 'release notes from commits' },
  { name: 'Ask India', url: 'https://askindia.online', blurb: 'answers from official government sites' },
].filter((t) => t.url !== SITE_URL);
