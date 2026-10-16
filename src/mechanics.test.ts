import test from 'node:test';
import assert from 'node:assert/strict';
import { assemblyMembers, traceLaser, isLinkedMechanismOpen, refreshReceiverStates, isPlatePressed } from './mechanics.ts';
import type { Level, LevelObject } from './types.ts';

const level: Level = {
  version: 1,
  metadata: { id: 'mechanics', name: 'Mechanics' },
  rules: { moveLimit: 10, rotationsCostMoves: false, gravity: true },
  board: { radius: 4, cellSize: 1, cells: Array.from({ length: 9 }, (_, i) => ({ q: i - 4, r: 0, h: 0 })) },
  objects: [], environment: { type: 'meadow', seed: 1, radius: 5, density: 0.1 },
  objectives: { requiredPlateIds: [], goalId: 'exit' },
};

test('glued assembly lookup returns every block with the same assembly ID', () => {
  const objects: LevelObject[] = [
    { id: 'a', type: 'block', q: 0, r: 0, h: 0, assemblyId: 'glue-1' },
    { id: 'b', type: 'block', q: 1, r: 0, h: 0, assemblyId: 'glue-1' },
    { id: 'c', type: 'block', q: 2, r: 0, h: 0 },
  ];
  assert.deepEqual(assemblyMembers(objects, 'a').map((o) => o.id), ['a', 'b']);
  assert.deepEqual(assemblyMembers(objects, 'c').map((o) => o.id), ['c']);
});

test('laser advances along its configured axial direction and stops at a wall', () => {
  const objects: LevelObject[] = [
    { id: 'laser', type: 'laser', q: -4, r: 0, h: 0, direction: 0 },
    { id: 'wall', type: 'wall', q: -1, r: 0, h: 0 },
  ];
  const result = traceLaser(level, objects, objects[0]);
  assert.deepEqual(result.cells.map((p) => p.q), [-3, -2, -1]);
});

test('laser reports receivers it reaches', () => {
  const objects: LevelObject[] = [
    { id: 'laser', type: 'laser', q: -4, r: 0, h: 0, direction: 0 },
    { id: 'receiver', type: 'receiver', q: -2, r: 0, h: 0 },
  ];
  assert.deepEqual(traceLaser(level, objects, objects[0]).receiverIds, ['receiver']);
});

test('pressure plate opens linked mechanism only while occupied by a block', () => {
  const plate: LevelObject = { id: 'plate', type: 'plate', q: 1, r: 0, h: 0 };
  const gate: LevelObject = { id: 'gate', type: 'gate', q: 2, r: 0, h: 0, linkedTo: 'plate' };
  assert.equal(isLinkedMechanismOpen(gate, [plate, gate]), false);
  assert.equal(isLinkedMechanismOpen(gate, [plate, gate, { id: 'block', type: 'block', q: 1, r: 0, h: 0 }]), true);
});

test('mirror changes the laser to the reflected axial direction', () => {
  const objects: LevelObject[] = [
    { id: 'laser', type: 'laser', q: -2, r: 0, h: 0, direction: 0 },
    { id: 'mirror', type: 'mirror', q: 0, r: 0, h: 0, direction: 1 },
    { id: 'receiver', type: 'receiver', q: 0, r: -2, h: 0 },
  ];
  const mirrorLevel: Level = { ...level, board: { ...level.board, cells: [...level.board.cells, { q: 0, r: -1, h: 0 }, { q: 0, r: -2, h: 0 }] } };
  const trace = traceLaser(mirrorLevel, objects, objects[0]);
  assert.deepEqual(trace.cells.map((p) => [p.q, p.r]), [[-1, 0], [0, 0], [0, -1], [0, -2]]);
  assert.deepEqual(trace.receiverIds, ['receiver']);
});

test('laser receivers refresh active state and can open linked gates', () => {
  const localLevel: Level = { ...level, board: { ...level.board, cells: [{ q: 0, r: 0, h: 0 }, { q: 1, r: 0, h: 0 }, { q: 2, r: 0, h: 0 }] } };
  const objects: LevelObject[] = [
    { id: 'laser', type: 'laser', q: 0, r: 0, h: 0, direction: 0 },
    { id: 'receiver', type: 'receiver', q: 2, r: 0, h: 0 },
    { id: 'gate', type: 'gate', q: 1, r: 0, h: 0, linkedTo: 'receiver' },
  ];
  // The gate begins closed, so this layout deliberately verifies the receiver only
  // when its beam can reach it without depending on the gate it controls.
  objects[2].q = 3;
  localLevel.board.cells.push({ q: 3, r: 0, h: 0 });
  assert.deepEqual(refreshReceiverStates(localLevel, objects), ['receiver']);
  assert.equal(isLinkedMechanismOpen(objects[2], objects), true);
});

test('a collected key opens a linked gate', () => {
  const objects: LevelObject[] = [
    { id: 'key-1', type: 'key', q: 0, r: 0, h: 0, active: false },
    { id: 'gate-1', type: 'gate', q: 1, r: 0, h: 0, linkedTo: 'key-1' },
  ];
  assert.equal(isLinkedMechanismOpen(objects[1], objects), false);
  objects[0].active = true;
  assert.equal(isLinkedMechanismOpen(objects[1], objects), true);
});


test('multi-plate gates require every listed source to be active', () => {
  const plateA: LevelObject = { id: 'a', type: 'plate', q: 0, r: 0, h: 0 };
  const plateB: LevelObject = { id: 'b', type: 'plate', q: 1, r: 0, h: 0 };
  const gate: LevelObject = { id: 'gate-all', type: 'gate', q: 2, r: 0, h: 0, linkedToAll: ['a', 'b'] };
  const onePressed = [plateA, plateB, gate, { id: 'weight-a', type: 'block', q: 0, r: 0, h: 0 } as LevelObject];
  assert.equal(isLinkedMechanismOpen(gate, onePressed), false);
  onePressed.push({ id: 'weight-b', type: 'block', q: 1, r: 0, h: 0 });
  assert.equal(isLinkedMechanismOpen(gate, onePressed), true);
});

test('a lift can be enabled by a pressure plate independently of its paired lift link', () => {
  const plate: LevelObject = { id: 'plate', type: 'plate', q: 0, r: 0, h: 0 };
  const lift: LevelObject = { id: 'lift', type: 'lift', q: 1, r: 0, h: 0, linkedTo: 'lift-top', enabledBy: 'plate' };
  const top: LevelObject = { id: 'lift-top', type: 'lift', q: 1, r: 0, h: 1, linkedTo: 'lift' };
  assert.equal(isLinkedMechanismOpen(lift, [plate, lift, top]), false);
  assert.equal(isLinkedMechanismOpen(lift, [plate, lift, top, { id: 'weight', type: 'block', q: 0, r: 0, h: 0 }]), true);
});


test('heavy-only plates ignore standard blocks and activate for heavy blocks', () => {
  const plate: LevelObject = { id: 'weight-plate', type: 'plate', q: 0, r: 0, h: 0, kind: 'heavyOnly' };
  const standard: LevelObject = { id: 'standard', type: 'block', q: 0, r: 0, h: 0 };
  const heavy: LevelObject = { id: 'heavy', type: 'block', q: 0, r: 0, h: 0, kind: 'heavy' };
  assert.equal(isPlatePressed(plate, [plate, standard]), false);
  assert.equal(isPlatePressed(plate, [plate, heavy]), true);
  const gate: LevelObject = { id: 'gate-heavy', type: 'gate', q: 1, r: 0, h: 0, linkedTo: plate.id };
  assert.equal(isLinkedMechanismOpen(gate, [plate, standard, gate]), false);
  assert.equal(isLinkedMechanismOpen(gate, [plate, heavy, gate]), true);
});


test('receiver states settle deterministically when a receiver opens a downstream gate', () => {
  const localLevel: Level = { ...level, board: { ...level.board, cells: [{q:0,r:0,h:0},{q:1,r:0,h:0},{q:2,r:0,h:0},{q:3,r:0,h:0}] } };
  const objects: LevelObject[] = [
    { id: 'laser', type: 'laser', q: 0, r: 0, h: 0, direction: 0 },
    { id: 'receiver-a', type: 'receiver', q: 1, r: 0, h: 0 },
    { id: 'gate', type: 'gate', q: 2, r: 0, h: 0, linkedTo: 'receiver-a' },
    { id: 'receiver-b', type: 'receiver', q: 3, r: 0, h: 0 },
  ];
  assert.deepEqual(refreshReceiverStates(localLevel, objects), ['receiver-a', 'receiver-b']);
  assert.deepEqual(refreshReceiverStates(localLevel, objects), ['receiver-a', 'receiver-b']);
});

test('receiver feedback that starts blocked settles fail-closed rather than oscillating', () => {
  const localLevel: Level = { ...level, board: { ...level.board, cells: [{q:0,r:0,h:0},{q:1,r:0,h:0},{q:2,r:0,h:0}] } };
  const objects: LevelObject[] = [
    { id: 'laser', type: 'laser', q: 0, r: 0, h: 0, direction: 0 },
    { id: 'gate', type: 'gate', q: 1, r: 0, h: 0, linkedTo: 'receiver' },
    { id: 'receiver', type: 'receiver', q: 2, r: 0, h: 0 },
  ];
  assert.deepEqual(refreshReceiverStates(localLevel, objects), []);
  assert.equal(objects.find(o => o.id === 'receiver')?.active, false);
});
