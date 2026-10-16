import test from 'node:test';
import assert from 'node:assert/strict';
import { frameAt, parseRunRecording, recordingDurationMs } from './replay.ts';
import type { RunRecording } from './replay.ts';

const recording: RunRecording = {
  format: 'ishibako-run-recording', version: 1,
  level: { id: 'tiny', name: 'Tiny', seed: 1 },
  initialLevel: { version: 1, metadata: { id: 'tiny', name: 'Tiny' }, rules: { moveLimit: 4, rotationsCostMoves: false, gravity: true }, board: { radius: 1, cellSize: 1, cells: [{ q: 0, r: 0, h: 0 }] }, objects: [], environment: { type: 'meadow', seed: 1, radius: 5, density: 0 }, objectives: { requiredPlateIds: [], goalId: 'goal' } },
  frames: [
    { index: 0, action: 'start', elapsedMs: 0, player: { id: 'player', type: 'player', q: 0, r: 0, h: 0 }, objects: [], attached: [], moves: 0, keyCount: 0, won: false },
    { index: 1, action: 'move', elapsedMs: 500, player: { id: 'player', type: 'player', q: 1, r: 0, h: 0 }, objects: [], attached: [], moves: 1, keyCount: 0, won: false },
  ],
};

test('recording parser accepts valid recordings and clamps frame indices', () => {
  const parsed = parseRunRecording(recording);
  assert.equal(frameAt(parsed, -5).action, 'start');
  assert.equal(frameAt(parsed, 99).action, 'move');
  assert.equal(recordingDurationMs(parsed), 500);
});

test('recording parser rejects unrelated JSON and malformed frames', () => {
  assert.throws(() => parseRunRecording({ hello: 'world' }), /not an Ishibako/);
  assert.throws(() => parseRunRecording({ ...recording, frames: [{ action: 'broken' }] }), /frame 0 is incomplete/);
});
