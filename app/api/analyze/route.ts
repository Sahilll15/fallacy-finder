import { NextResponse } from 'next/server';
import {
  FALLACIES,
  MAX_CHARS,
  STRENGTH,
  toClaims,
  type Claim,
  type FallacyKey,
  type ScoredClaim,
} from '../../lib';
import { askJev } from '../../server/jev';
import { check, tooMany } from '../../server/ratelimit';

const PRICE_PER_INPUT_TOKEN = 0.042 / 1_000_000;
const CONTEXT_CLAIMS = 4;

const QUESTIONS = {
  ...Object.fromEntries(
    FALLACIES.map((f) => [f.key, { type: 'boolean' as const, instructions: f.question, criteria: f.criteria }]),
  ),
  factual: {
    type: 'boolean' as const,
    instructions: 'Does this line make a factual claim about the world that could in principle be checked?',
    criteria: {
      true: 'it asserts something measurable, historical or empirical, such as a statistic, event or causal fact',
      false: 'it is purely opinion, a value judgement, a question, a proposal or filler',
    },
  },
  evidence: {
    type: 'boolean' as const,
    instructions: 'Does this line back up its claim with concrete evidence such as data, a source, a study or a specific example?',
    criteria: {
      true: 'it cites numbers, sources, studies, or specific verifiable examples in support',
      false: 'it asserts without support, or the support is vague or anecdotal',
    },
  },
  strength: {
    type: 'score' as const,
    instructions: 'How strong is the argument made in this line, judged on its own reasoning and support?',
    criteria: STRENGTH,
  },
};

async function scoreClaim(claim: Claim, claims: Claim[], debate: boolean) {
  const before = claims.slice(Math.max(0, claim.id - CONTEXT_CLAIMS), claim.id);
  const state = {
    line: claim.text,
    ...(debate ? { speaker: `speaker ${claim.speaker}` } : {}),
    earlierInTheThread: before.map((c) => (debate ? `speaker ${c.speaker}: ${c.text}` : c.text)),
    note: 'Judge only the line itself. Earlier lines are context for what it responds to.',
  };

  const { answers, inputTokens } = await askJev(state, QUESTIONS);
  const a = answers as Record<string, { probability?: number; score?: number }>;

  return {
    claim: {
      ...claim,
      fallacies: Object.fromEntries(FALLACIES.map((f) => [f.key, a[f.key].probability ?? 0])) as Record<
        FallacyKey,
        number
      >,
      factual: a.factual.probability ?? 0,
      evidence: a.evidence.probability ?? 0,
      strength: a.strength.score ?? 0,
    } satisfies ScoredClaim,
    inputTokens,
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const text: unknown = body?.text;
  const mode = ['single', 'debate', 'auto'].includes(body?.mode) ? body.mode : 'auto';

  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Paste an argument, a thread or a transcript first.' }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `That is over ${MAX_CHARS.toLocaleString()} characters. Trim it to the part you want checked.` },
      { status: 413 },
    );
  }

  const { debate, claims, truncated } = toClaims(text, mode);
  if (claims.length === 0) {
    return NextResponse.json({ error: 'Could not find any sentences to check in that text.' }, { status: 400 });
  }

  const gate = await check(req, 'analyze');
  if (!gate.ok) return tooMany(gate);

  try {
    const scored = await Promise.all(claims.map((c) => scoreClaim(c, claims, debate)));
    const inputTokens = scored.reduce((sum, s) => sum + s.inputTokens, 0);
    return NextResponse.json({
      mode: debate ? 'debate' : 'single',
      claims: scored.map((s) => s.claim),
      truncated,
      inputTokens,
      cost: inputTokens * PRICE_PER_INPUT_TOKEN,
    });
  } catch (err) {
    console.error('analyze failed:', err);
    return NextResponse.json({ error: 'The model call failed. Give it a moment and try again.' }, { status: 502 });
  }
}
