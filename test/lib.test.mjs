import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FALLACIES, flagsOf, parseMessages, scoreboard, sideStats, splitSentences, toClaims } from '../app/lib.ts';

const zero = Object.fromEntries(FALLACIES.map((f) => [f.key, 0.05]));
const claim = (id, speaker, over = {}) => ({
  id,
  speaker,
  message: id,
  text: `line ${id}`,
  fallacies: { ...zero, ...(over.fallacies ?? {}) },
  factual: over.factual ?? 0.1,
  evidence: over.evidence ?? 0.1,
  strength: over.strength ?? 1,
});

test('detects two speakers only when both A and B appear', () => {
  assert.equal(parseMessages('A: hi there.\nB: hello back.').debate, true);
  assert.equal(parseMessages('A: hi there.\nA: again.').debate, false);
  assert.equal(parseMessages('A: hi there.', 'debate').debate, true);
});

test('continuation lines stay with their speaker', () => {
  const { messages } = parseMessages('A: first point here.\nstill speaker a.\nB: a reply.');
  assert.deepEqual(messages.map((m) => m.speaker), ['A', 'B']);
  assert.match(messages[0].text, /still speaker a/);
});

test('short fragments merge into the next sentence', () => {
  assert.deepEqual(splitSentences('No. That is not what the report says at all.'), [
    'No. That is not what the report says at all.',
  ]);
});

test('claims are capped and flagged as truncated', () => {
  const text = Array.from({ length: 30 }, (_, i) => `This is sentence number ${i} in the text.`).join(' ');
  const r = toClaims(text, 'auto', 20);
  assert.equal(r.claims.length, 20);
  assert.equal(r.truncated, true);
});

test('flagsOf keeps only probabilities at or above the threshold, highest first', () => {
  const c = claim(0, null, { fallacies: { strawman: 0.7, adHominem: 0.9, falseDilemma: 0.59 } });
  assert.deepEqual(flagsOf(c).map((f) => f.key), ['adHominem', 'strawman']);
});

test('evidence ratio counts supported factual claims only', () => {
  const s = sideStats([
    claim(0, 'A', { factual: 0.9, evidence: 0.8 }),
    claim(1, 'A', { factual: 0.9, evidence: 0.2 }),
    claim(2, 'A', { factual: 0.1, evidence: 0.9 }),
  ]);
  assert.equal(s.factualClaims, 2);
  assert.equal(s.evidenceRatio, 0.5);
  assert.equal(sideStats([claim(0, 'A')]).evidenceRatio, null);
});

test('the side with fewer fallacies and more evidence argues cleaner', () => {
  const claims = [
    claim(0, 'A', { factual: 0.9, evidence: 0.9, strength: 2.5 }),
    claim(1, 'B', { fallacies: { adHominem: 0.95, strawman: 0.8 }, strength: 0.2 }),
    claim(2, 'A', { strength: 1.5 }),
    claim(3, 'B', { fallacies: { whataboutism: 0.7 } }),
  ];
  const board = scoreboard(claims);
  assert.equal(board.winner, 'A');
  assert.equal(board.b.fallacyCount, 3);
  assert.equal(board.b.byFallacy.adHominem, 1);
  assert.equal(board.a.fallacyCount, 0);
});

test('near equal sides are a tie', () => {
  const board = scoreboard([claim(0, 'A'), claim(1, 'B')]);
  assert.equal(board.winner, 'tie');
});
