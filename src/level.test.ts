import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeLevel, validateLevel } from './level.ts';
import type { Level } from './types.ts';

const readLevel = (name: string) => JSON.parse(readFileSync(new URL(`../levels/${name}`, import.meta.url), 'utf8')) as Level;

test('all shipped levels validate, including the mechanics showcase', () => {
  for (const name of ['example.json', 'mechanics-lab.json', 'mechanics-showcase.json']) {
    assert.deepEqual(validateLevel(normalizeLevel(readLevel(name))), [], `${name} should validate`);
  }
});

test('mechanics showcase includes the planned mechanic families', () => {
  const level = normalizeLevel(readLevel('mechanics-showcase.json'));
  const types = new Set(level.objects.map((object) => object.type));
  for (const type of ['player', 'key', 'block', 'plate', 'gate', 'bridge', 'lift', 'laser', 'mirror', 'receiver', 'wall', 'goal']) {
    assert.ok(types.has(type as Level['objects'][number]['type']), `missing ${type}`);
  }
  assert.ok(level.objects.filter((object) => object.type === 'block' && object.assemblyId === 'prism-pair').length >= 2);
  assert.equal(level.objectives.requiredReceiverIds?.includes('receiver-west'), true);
});
