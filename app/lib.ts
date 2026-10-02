export type Speaker = 'A' | 'B' | null;

export type FallacyKey =
  | 'adHominem'
  | 'strawman'
  | 'falseDilemma'
  | 'slipperySlope'
  | 'appealToAuthority'
  | 'whataboutism'
  | 'hastyGeneralization'
  | 'circularReasoning';

export type Fallacy = {
  key: FallacyKey;
  name: string;
  short: string;
  definition: string;
  example: string;
  why: string;
  question: string;
  criteria: { true: string; false: string };
  hue: string;
};

export const FALLACIES: Fallacy[] = [
  {
    key: 'adHominem',
    name: 'ad hominem',
    short: 'attacks the person',
    definition:
      'Goes after the person making the argument instead of the argument itself. Their character, motives, looks or past get treated as if they settle whether the claim is true.',
    example: '"You can\'t trust her budget plan. She can\'t even keep her own car clean."',
    why: 'A messy car says nothing about whether the numbers in the plan add up.',
    question: 'Does this line attack the character, motives or traits of a person instead of addressing their argument?',
    criteria: {
      true: 'it insults, discredits or questions a person in place of engaging with what they said',
      false: 'it addresses ideas, evidence or reasoning, or criticises a person only for the argument itself',
    },
    hue: 'rust',
  },
  {
    key: 'strawman',
    name: 'strawman',
    short: 'distorts the other view',
    definition:
      'Restates the other side as a weaker, cruder or more extreme version of what they said, then knocks that version down. The real position never gets answered.',
    example: '"He wants fewer cars downtown. So he wants to ban everyone from driving to work."',
    why: 'Fewer cars and a total ban are very different proposals. Only the second one is easy to mock.',
    question: 'Does this line misrepresent or exaggerate an opposing position so it is easier to attack?',
    criteria: {
      true: 'it attributes a distorted, exaggerated or oversimplified view to the other side and argues against that',
      false: 'it represents opposing views fairly or does not characterise anyone else\'s view',
    },
    hue: 'ochre',
  },
  {
    key: 'falseDilemma',
    name: 'false dilemma',
    short: 'only two options',
    definition:
      'Presents a choice as if there were only two possibilities when there are clearly more. Usually one option is made to look terrible so the other wins by default.',
    example: '"Either we cut the arts program or the school goes bankrupt."',
    why: 'Budgets have many levers. Framing it as one cut or ruin hides all of them.',
    question: 'Does this line present only two options as if they were the only possibilities, when other options plausibly exist?',
    criteria: {
      true: 'it frames an either/or choice that leaves out reasonable alternatives',
      false: 'it does not force a binary choice, or the two options really are exhaustive',
    },
    hue: 'olive',
  },
  {
    key: 'slipperySlope',
    name: 'slippery slope',
    short: 'one step leads to doom',
    definition:
      'Claims that a small first step will set off a chain of events ending somewhere extreme, without showing why each link in the chain would actually happen.',
    example: '"If we let students retake one exam, soon nobody will study for anything."',
    why: 'Each step needs its own reason. One retake policy does not explain the collapse of studying.',
    question: 'Does this line claim that one action will inevitably lead to an extreme outcome through an unsupported chain of consequences?',
    criteria: {
      true: 'it predicts a runaway chain of consequences from a modest step without justifying the links',
      false: 'it makes no such chain prediction, or it supports each consequence it predicts',
    },
    hue: 'slate',
  },
  {
    key: 'appealToAuthority',
    name: 'appeal to authority',
    short: 'status as proof',
    definition:
      'Treats who said something as proof that it is true, especially when the person is famous or senior but not an expert in the topic at hand.',
    example: '"A famous actor swears by this diet, so it must work."',
    why: 'Acting skill is not nutrition research. Fame is standing in for evidence.',
    question: 'Does this line rely on the status or fame of a person or group as the main reason to accept a claim, rather than evidence?',
    criteria: {
      true: 'it asks us to accept a claim mainly because of who endorses it, often outside their expertise',
      false: 'it does not lean on an endorsement, or it cites relevant expert evidence rather than mere status',
    },
    hue: 'plum',
  },
  {
    key: 'whataboutism',
    name: 'whataboutism',
    short: 'deflects to someone else',
    definition:
      'Answers a criticism by pointing at somebody else\'s wrongdoing instead of responding to it. The original point is left standing but the conversation moves on.',
    example: '"Sure, our factory leaks, but what about the plant across the river?"',
    why: 'The other plant being bad does not make this leak any cleaner.',
    question: 'Does this line deflect a criticism by pointing to someone else\'s faults instead of addressing the criticism?',
    criteria: {
      true: 'it changes the subject to another party\'s wrongdoing to avoid answering a point',
      false: 'it responds to the point directly, or raises a comparison that is genuinely relevant',
    },
    hue: 'teal',
  },
  {
    key: 'hastyGeneralization',
    name: 'hasty generalization',
    short: 'too few cases',
    definition:
      'Draws a sweeping conclusion from a handful of cases, a personal anecdote or an unrepresentative sample.',
    example: '"My two cousins hated living there, so it\'s an awful city."',
    why: 'Two people are not a city of a million. The sample is far too small to carry the claim.',
    question: 'Does this line draw a broad general conclusion from too few or unrepresentative examples?',
    criteria: {
      true: 'it generalises about a whole group or category from anecdotes or a tiny sample',
      false: 'it does not generalise, or its generalisation rests on adequate evidence',
    },
    hue: 'sienna',
  },
  {
    key: 'circularReasoning',
    name: 'circular reasoning',
    short: 'assumes its conclusion',
    definition:
      'Uses the conclusion as one of its own premises, so the argument goes in a loop. It sounds like a reason but only restates the claim.',
    example: '"This news source is trustworthy because it reports the truth."',
    why: 'Whether it reports the truth is exactly the question. The reason and the claim are the same thing.',
    question: 'Does this line support its conclusion with a premise that already assumes the conclusion is true?',
    criteria: {
      true: 'its reason is just a restatement of the claim it is trying to prove',
      false: 'its reasons are independent of the conclusion, or it offers no reasoning at all',
    },
    hue: 'moss',
  },
];

export const FALLACY_BY_KEY = Object.fromEntries(FALLACIES.map((f) => [f.key, f])) as Record<FallacyKey, Fallacy>;

export const STRENGTH = [
  'no argument: an assertion, insult or filler with nothing behind it',
  'weak: a claim with thin or flawed support',
  'moderate: reasoned but missing key support',
  'strong: clear reasoning backed by evidence',
];

export const STRENGTH_LABELS = ['no argument', 'weak', 'moderate', 'strong'];

export const FLAG = 0.6;
export const MAYBE = 0.5;
export const MAX_CHARS = 12_000;
export const MAX_CLAIMS = 20;

export type Claim = { id: number; speaker: Speaker; text: string; message: number };

export type ScoredClaim = Claim & {
  fallacies: Record<FallacyKey, number>;
  factual: number;
  evidence: number;
  strength: number;
};

export type Analysis = {
  mode: 'single' | 'debate';
  claims: ScoredClaim[];
  truncated: boolean;
  inputTokens: number;
  cost: number;
};

const SPEAKER_RE = /^\s*\(?([AB])\)?\s*[:：]\s*/i;

export type Message = { speaker: Speaker; text: string };

export function parseMessages(input: string, mode: 'auto' | 'single' | 'debate' = 'auto') {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const tagged = lines.filter((l) => SPEAKER_RE.test(l));
  const speakers = new Set(tagged.map((l) => l.match(SPEAKER_RE)![1].toUpperCase()));
  const debate = mode === 'debate' || (mode === 'auto' && speakers.size === 2);

  const messages: Message[] = [];
  let paragraph: string[] = [];
  const flush = (speaker: Speaker) => {
    const text = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (text) messages.push({ speaker, text });
    paragraph = [];
  };

  let current: Speaker = null;
  for (const line of lines) {
    const m = debate ? line.match(SPEAKER_RE) : null;
    if (m) {
      flush(current);
      current = m[1].toUpperCase() as Speaker;
      paragraph.push(line.slice(m[0].length));
    } else if (!line.trim()) {
      flush(current);
    } else {
      paragraph.push(line);
    }
  }
  flush(current);

  return { debate, messages: debate ? messages.filter((m) => m.speaker) : messages };
}

export function splitSentences(text: string) {
  const parts = text.split(/(?<=[.!?]["')\]]?)\s+(?=["'(\[]?[A-Z0-9])/);
  const out: string[] = [];
  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;
    // Fragments like "No." carry no argument alone, so they ride along with the next sentence.
    if (out.length && out[out.length - 1].length < 20) out[out.length - 1] += ' ' + part;
    else out.push(part);
  }
  return out;
}

export function toClaims(input: string, mode: 'auto' | 'single' | 'debate' = 'auto', limit = MAX_CLAIMS) {
  const { debate, messages } = parseMessages(input, mode);
  const all: Claim[] = [];
  messages.forEach((m, message) => {
    for (const text of splitSentences(m.text)) all.push({ id: all.length, speaker: m.speaker, text, message });
  });
  return { debate, claims: all.slice(0, limit), truncated: all.length > limit };
}

export function flagsOf(c: Pick<ScoredClaim, 'fallacies'>, threshold = FLAG) {
  return (Object.entries(c.fallacies) as [FallacyKey, number][])
    .filter(([, p]) => p >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([key, p]) => ({ key, p }));
}

export type SideStats = {
  claims: number;
  flaggedClaims: number;
  fallacyCount: number;
  byFallacy: Partial<Record<FallacyKey, number>>;
  factualClaims: number;
  supportedClaims: number;
  evidenceRatio: number | null;
  avgStrength: number;
  clean: number;
};

export function sideStats(claims: ScoredClaim[]): SideStats {
  const byFallacy: Partial<Record<FallacyKey, number>> = {};
  let fallacyCount = 0;
  let flaggedClaims = 0;
  let factualClaims = 0;
  let supportedClaims = 0;
  let strengthSum = 0;

  for (const c of claims) {
    const flags = flagsOf(c);
    if (flags.length) flaggedClaims++;
    for (const f of flags) {
      fallacyCount++;
      byFallacy[f.key] = (byFallacy[f.key] ?? 0) + 1;
    }
    if (c.factual >= 0.5) {
      factualClaims++;
      if (c.evidence >= 0.5) supportedClaims++;
    }
    strengthSum += c.strength;
  }

  const n = claims.length;
  const avgStrength = n ? strengthSum / n : 0;
  const evidenceRatio = factualClaims ? supportedClaims / factualClaims : null;
  // No factual claims means nothing to back up, so evidence neither helps nor hurts.
  const evidencePart = evidenceRatio ?? 0.5;
  const cleanPart = n ? 1 - flaggedClaims / n : 1;
  const strengthPart = avgStrength / (STRENGTH.length - 1);
  const clean = n ? 0.5 * cleanPart + 0.3 * strengthPart + 0.2 * evidencePart : 0;

  return { claims: n, flaggedClaims, fallacyCount, byFallacy, factualClaims, supportedClaims, evidenceRatio, avgStrength, clean };
}

export function scoreboard(claims: ScoredClaim[]) {
  const a = sideStats(claims.filter((c) => c.speaker === 'A'));
  const b = sideStats(claims.filter((c) => c.speaker === 'B'));
  const gap = a.clean - b.clean;
  const winner: 'A' | 'B' | 'tie' = !a.claims || !b.claims || Math.abs(gap) < 0.05 ? 'tie' : gap > 0 ? 'A' : 'B';
  return { a, b, winner, gap: Math.abs(gap) };
}

export function topFallacy(stats: SideStats) {
  const entries = Object.entries(stats.byFallacy) as [FallacyKey, number][];
  if (!entries.length) return null;
  return entries.sort((x, y) => y[1] - x[1])[0][0];
}

export function pct(p: number) {
  return `${Math.round(p * 100)}%`;
}
