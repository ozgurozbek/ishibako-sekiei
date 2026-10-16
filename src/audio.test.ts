import test from 'node:test';
import assert from 'node:assert/strict';
import { selectBiomeMusic } from './audio.ts';
import type { Level } from './types.ts';
const env = (type: string, seed: number, musicFolder?: string) => ({ environment: { type, seed, radius: 5, density: .2, ...(musicFolder ? { musicFolder } : {}) } }) as Pick<Level, 'environment'>;
test('biome music selection is stable for the same level seed', () => {
  assert.deepEqual(selectBiomeMusic(env('meadow', 1207)), selectBiomeMusic(env('meadow', 1207)));
});
test('three discovered tracks retain modulo-three selection', () => {
  const catalog = { meadow: ['1.mp3', '2.mp3', '3.mp3'] };
  assert.equal(selectBiomeMusic(env('meadow', 0), catalog).src, 'music/meadow/1.mp3');
  assert.equal(selectBiomeMusic(env('meadow', 1), catalog).src, 'music/meadow/2.mp3');
  assert.equal(selectBiomeMusic(env('meadow', 2), catalog).src, 'music/meadow/3.mp3');
  assert.equal(selectBiomeMusic(env('meadow', -1), catalog).src, 'music/meadow/3.mp3');
});
test('eight tracks are discovered and selected by modulo-eight', () => {
  const catalog = { snowMountain: ['1.mp3','2.mp3','3.mp3','4.mp3','5.mp3','6.mp3','7.mp3','8.mp3'] };
  assert.equal(selectBiomeMusic(env('snowMountain', 7), catalog).src, 'music/snowMountain/8.mp3');
  assert.equal(selectBiomeMusic(env('snowMountain', 8), catalog).src, 'music/snowMountain/1.mp3');
  assert.equal(selectBiomeMusic(env('snowMountain', 17), catalog).availableTracks, 8);
});
test('catalog supports mixed audio formats and natural numeric sorting', () => {
  const catalog = { castle: ['10.ogg', '2.mp3', '1.wav', 'notes.txt'] };
  assert.equal(selectBiomeMusic(env('castle', 1), catalog).src, 'music/castle/2.mp3');
  assert.equal(selectBiomeMusic(env('castle', 2), catalog).src, 'music/castle/10.ogg');
  assert.equal(selectBiomeMusic(env('castle', 0), catalog).src, 'music/castle/1.wav');
});
test('music folder can be configured separately from the visual biome', () => {
  assert.equal(selectBiomeMusic(env('lavaLake', 4, 'Lava Lake')).src, 'music/LavaLake/2.mp3');
});
