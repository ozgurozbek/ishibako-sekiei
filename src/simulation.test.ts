import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveGravity, rotateAxial, validateAssemblyPlacement, slideBlocksOnIce } from './simulation.ts';
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

test('glued blocks fall together by the same vertical distance', () => {
  const level = makeLevel([
    { q: 0, r: 0, h: 0 }, { q: 1, r: 0, h: 0 },
    { q: 0, r: 0, h: 1, support: false }, { q: 1, r: 0, h: 1, support: false },
    { q: 0, r: 0, h: 2, support: false }, { q: 1, r: 0, h: 2, support: false },
  ]);
  const glued = [
    { id: 'left', type: 'block', q: 0, r: 0, h: 2, assemblyId: 'pair' },
    { id: 'right', type: 'block', q: 1, r: 0, h: 2, assemblyId: 'pair' },
  ] satisfies LevelObject[];
  const result = resolveGravity(level, glued, new Set());
  assert.deepEqual(result.objects.map((o) => o.h), [0, 0]);
});

test('assembly placement rejects collisions with walls and closed gates', () => {
  const moving = new Set(['moving-a', 'moving-b']);
  const objects: LevelObject[] = [
    { id: 'moving-a', type: 'block', q: 0, r: 0, h: 0 },
    { id: 'moving-b', type: 'block', q: 1, r: 0, h: 0 },
    { id: 'wall-1', type: 'wall', q: 2, r: 0, h: 0 },
    { id: 'gate-1', type: 'gate', q: 0, r: 1, h: 0 },
  ];
  const board = makeLevel([{q:0,r:0,h:0},{q:1,r:0,h:0},{q:2,r:0,h:0},{q:0,r:1,h:0}]);
  assert.equal(validateAssemblyPlacement(board, objects, [{ id: 'moving-a', q: 2, r: 0, h: 0 }], moving).valid, false);
  assert.equal(validateAssemblyPlacement(board, objects, [{ id: 'moving-a', q: 0, r: 1, h: 0 }], moving).valid, false);
});

test('assembly placement allows declared void cells for gravity to resolve after a move', () => {
  const voidLevel = makeLevel([{ q: 0, r: 0, h: 0, kind: 'void', support: false }]);
  assert.equal(validateAssemblyPlacement(voidLevel, [], [{ id: 'block-1', q: 0, r: 0, h: 0 }], new Set(['block-1'])).valid, true);
  assert.equal(validateAssemblyPlacement(voidLevel, [], [{ id: 'block-1', q: 4, r: 0, h: 0 }], new Set(['block-1'])).valid, false);
  const wallLevel = makeLevel([{ q: 0, r: 0, h: 0, kind: 'wall' }]);
  assert.equal(validateAssemblyPlacement(wallLevel, [], [{ id: 'block-1', q: 0, r: 0, h: 0 }], new Set(['block-1'])).valid, false);
});

test('a falling assembly cannot overlap a lower block and falls away if no valid landing remains', () => {
  const collisionLevel: Level = makeLevel([
    { q: 0, r: 0, h: 0 }, { q: 0, r: 0, h: 1, support: false }, { q: 0, r: 0, h: 2, support: false },
  ]);
  const result = resolveGravity(collisionLevel, [
    { id: 'upper', type: 'block', q: 0, r: 0, h: 2 },
    { id: 'lower', type: 'block', q: 0, r: 0, h: 0 },
  ], new Set());
  assert.equal(result.objects.some(o => o.id === 'upper'), false);
  assert.deepEqual(result.fallenIds, ['upper']);
});

test('fragile blocks break when they become unsupported', () => {
  const result = resolveGravity(makeLevel([{q:0,r:0,h:0}]), [{ id: 'fragile', type: 'block', q: 0, r: 0, h: 0, kind: 'fragile' }], new Set());
  assert.equal(result.objects.some(o => o.id === 'fragile'), true, 'supported fragile blocks remain intact');
  const unsupported = makeLevel([{ q: 0, r: 0, h: 0, support: false }]);
  const broken = resolveGravity(unsupported, [{ id: 'fragile', type: 'block', q: 0, r: 0, h: 0, kind: 'fragile' }], new Set());
  assert.equal(broken.objects.length, 0);
  assert.deepEqual(broken.fallenIds, ['fragile']);
});


test('gravity resolution is deterministic and does not mutate its input objects', () => {
  const level = makeLevel([{ q: 0, r: 0, h: 0 }, { q: 0, r: 0, h: 1, support: false }, { q: 0, r: 0, h: 2, support: false }]);
  const input: LevelObject[] = [{ id: 'falling', type: 'block', q: 0, r: 0, h: 2 }];
  const before = structuredClone(input);
  const first = resolveGravity(level, input, new Set());
  const second = resolveGravity(level, input, new Set());
  assert.deepEqual(input, before);
  assert.deepEqual(first, second);
  assert.equal(first.objects[0].h, 0);
});

test('gravity respects a closed gate in the fall path', () => {
  const level = makeLevel([{ q: 0, r: 0, h: 0 }, { q: 0, r: 0, h: 1, support: false }, { q: 0, r: 0, h: 2, support: false }]);
  const input: LevelObject[] = [
    { id: 'falling', type: 'block', q: 0, r: 0, h: 2 },
    { id: 'gate', type: 'gate', q: 0, r: 0, h: 1 },
  ];
  const result = resolveGravity(level, input, new Set());
  assert.equal(result.objects.some(o => o.id === 'falling'), false);
  assert.equal(result.objects.some(o => o.id === 'gate'), true);
  assert.deepEqual(result.fallenIds, ['falling']);
});


test('spikes and laser emitters are not solid collision objects for blocks', () => {
  const level = makeLevel([{ q: 0, r: 0, h: 0 }, { q: 1, r: 0, h: 0 }, { q: 2, r: 0, h: 0 }]);
  const objects: LevelObject[] = [
    { id: 'spikes-1', type: 'spikes', q: 1, r: 0, h: 0 },
    { id: 'laser-1', type: 'laser', q: 2, r: 0, h: 0, direction: 0 },
  ];
  assert.equal(validateAssemblyPlacement(level, objects, [{ id: 'moving', q: 1, r: 0, h: 0 }], new Set(['moving'])).valid, true);
  assert.equal(validateAssemblyPlacement(level, objects, [{ id: 'moving', q: 2, r: 0, h: 0 }], new Set(['moving'])).valid, true);
});


test('blocks slide across consecutive ice cells and stop on normal ground', async () => {
  const level = makeLevel([
    {q:0,r:0,h:0,kind:'ice'}, {q:1,r:0,h:0,kind:'ice'},
    {q:2,r:0,h:0,kind:'normal'}, {q:3,r:0,h:0,kind:'normal'}
  ]);
  const objects = [{id:'b',type:'block' as const,q:0,r:0,h:0}];
  const result = slideBlocksOnIce(level, objects, [{id:'b',dq:1,dr:0}]);
  assert.equal(result[0].q, 2);
});

test('fire destroys a block and mirror blocks solid placement', async () => {
  const level = makeLevel([{q:0,r:0,h:0,kind:'normal'},{q:1,r:0,h:0,kind:'normal'}]);
  const objects = [{id:'b',type:'block' as const,q:1,r:0,h:0},{id:'fire',type:'fire' as const,q:1,r:0,h:0}];
  assert.equal(slideBlocksOnIce(level, objects, []).some(o=>o.type==='block'), false);
  const placement = validateAssemblyPlacement(level, [{id:'m',type:'mirror',q:1,r:0,h:0} as any], [{id:'b',q:1,r:0,h:0}], new Set());
  assert.equal(placement.valid, false);
});
