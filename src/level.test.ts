import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeLevel, validateLevel } from './level.ts';
import type { Level } from './types.ts';

const readLevel = (name: string) => JSON.parse(readFileSync(new URL(`../levels/${name}`, import.meta.url), 'utf8')) as Level;

test('all shipped levels validate, including the mechanics showcase', () => {
  for (const name of ['blank-canvas.json', 'first-steps.json', 'gap-garden.json', 'plate-and-lift.json', 'example.json', 'mechanics-lab.json', 'mechanics-showcase.json', 'advanced-lab.json']) {
    assert.deepEqual(validateLevel(normalizeLevel(readLevel(name))), [], `${name} should validate`);
  }
});

test('mechanics showcase includes the planned mechanic families', () => {
  const level = normalizeLevel(readLevel('mechanics-showcase.json'));
  const types = new Set(level.objects.map((object) => object.type));
  for (const type of ['player', 'key', 'block', 'plate', 'gate', 'bridge', 'lift', 'laser', 'mirror', 'receiver', 'wall', 'goal', 'switch', 'conveyor', 'teleporter']) {
    assert.ok(types.has(type as Level['objects'][number]['type']), `missing ${type}`);
  }
  assert.ok(level.objects.filter((object) => object.type === 'block' && object.assemblyId === 'garden-prism').length >= 2);
  assert.equal(level.objectives.requiredReceiverIds?.includes('receiver-west'), true);
  assert.equal(level.rules.moveLimitEnabled, false);
  assert.equal(level.rules.moveLimit, 999);
  assert.deepEqual(level.objectives.requiredKeyIds, ['key-summit']);
  assert.ok(level.board.cells.some((cell) => cell.support === false), 'showcase should contain visible gaps');
  assert.ok(level.objects.some((object) => object.linkedToAll?.length === 2), 'showcase should include a multi-plate gate');
  assert.ok(level.objects.some((object) => object.enabledBy === 'plate-b'), 'showcase lift should be plate-enabled');
});

test('advanced lab showcases heavy plates, fragile blocks and spike hazards', () => {
  const level = normalizeLevel(readLevel('advanced-lab.json'));
  assert.deepEqual(validateLevel(level), []);
  assert.ok(level.objects.some(o => o.type === 'block' && o.kind === 'heavy'));
  assert.ok(level.objects.some(o => o.type === 'block' && o.kind === 'fragile'));
  assert.ok(level.objects.some(o => o.type === 'spikes'));
  assert.equal(level.objects.find(o => o.id === 'plate-heavy')?.kind, 'heavyOnly');
});

test('blank canvas is a single-hex level ready for editing', () => {
  const level = normalizeLevel(readLevel('blank-canvas.json'));
  assert.equal(level.board.cells.length, 1);
  assert.deepEqual([level.objects.find((o) => o.type === 'player')?.q, level.objects.find((o) => o.type === 'player')?.r], [0, 0]);
  assert.deepEqual(validateLevel(level), []);
});

test('new bundled levels include their advertised mechanics', () => {
  const gap = normalizeLevel(readLevel('gap-garden.json'));
  assert.ok(gap.board.cells.some((cell) => cell.kind === 'void'));
  assert.ok(gap.objects.some((object) => object.type === 'bridge'));
  const lift = normalizeLevel(readLevel('plate-and-lift.json'));
  assert.ok(lift.objects.some((object) => object.linkedToAll?.length === 2));
  assert.ok(lift.objects.some((object) => object.type === 'shard'));
});
