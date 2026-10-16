import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveGravity, rotateAxial } from './simulation.ts';
import type { Level, LevelObject } from './types.ts';

const makeLevel = (cells: Level['board']['cells']): Level => ({
  version: 1,
  metadata: { id: 'test', name: 'Test' },
  rules: { moveLimit: 5, rotationsCostMoves: false, gravity: true },
  board: { radius: 3, cellSize: 1, cells },
  objects: [],
  environment: { type: 'meadow', seed: 1, radius: 5, density: 0.1 },
  objectives: { requiredPlateIds: [], goalId: 'exit' },
});
const block = (q: number, r: number, h: number): LevelObject => ({ id: 'block-1', type: 'block', q, r, h });

test('gravity drops an unsupported block to the highest supported lower cell', () => {
  const level = makeLevel([{ q: 0, r: 0, h: 0 }, { q: 0, r: 0, h: 1, support: false }, { q: 0, r: 0, h: 2, support: false }]);
  const result = resolveGravity(level, [block(0, 0, 2)], new Set());
  assert.equal(result.objects[0].h, 0);
  assert.deepEqual(result.fallenIds, []);
});

test('gravity removes a block over a void with no lower support', () => {
  const level = makeLevel([{ q: 0, r: 0, h: 2, support: false }]);
  const result = resolveGravity(level, [block(0, 0, 2)], new Set());
  assert.equal(result.objects.length, 0);
  assert.deepEqual(result.fallenIds, ['block-1']);
});

test('a falling attached block is reported as detached', () => {
  const level = makeLevel([{ q: 0, r: 0, h: 0 }, { q: 0, r: 0, h: 1, support: false }]);
  const result = resolveGravity(level, [block(0, 0, 1)], new Set(['block-1']));
  assert.equal(result.objects[0].h, 0);
  assert.deepEqual(result.detachedIds, ['block-1']);
});

test('axial rotation preserves the six-step hex ring', () => {
  let p = { q: 1, r: 0 };
  const ring = [p];
  for (let i = 0; i < 5; i++) { p = rotateAxial(p.q, p.r, 1); ring.push(p); }
  assert.deepEqual(rotateAxial(p.q, p.r, 1), { q: 1, r: 0 });
  assert.equal(new Set(ring.map((point) => `${point.q},${point.r}`)).size, 6);
});
