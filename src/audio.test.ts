import test from 'node:test';
import assert from 'node:assert/strict';
import { selectBiomeMusic } from './audio.ts';
import type { Level } from './types.ts';
const env = (type: string, seed: number, musicFolder?: string) => ({ environment: { type, seed, radius: 5, density: .2, ...(musicFolder ? { musicFolder } : {}) } }) as Pick<Level, 'environment'>;
test('biome music selection is stable for the same level seed', () => {
  assert.deepEqual(selectBiomeMusic(env('meadow', 1207)), selectBiomeMusic(env('meadow', 1207)));
});
test('different seeds select tracks by modulo three', () => {
  assert.equal(selectBiomeMusic(env('meadow', 0)).track, 1);
  assert.equal(selectBiomeMusic(env('meadow', 1)).track, 2);
  assert.equal(selectBiomeMusic(env('meadow', 2)).track, 3);
  assert.equal(selectBiomeMusic(env('meadow', -1)).track, 3);
});
test('music folder can be configured separately from the visual biome', () => {
  assert.equal(selectBiomeMusic(env('lavaLake', 4, 'Lava Lake')).src, 'music/LavaLake/2.mp3');
});
