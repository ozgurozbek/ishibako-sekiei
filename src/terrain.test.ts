import test from 'node:test';
import assert from 'node:assert/strict';
import { terrainHeight, terrainRadiusFor } from './terrain.ts';

test('terrain radius grows with the environment and remains within performance bounds', () => {
  assert.equal(terrainRadiusFor(4), 30);
  assert.equal(terrainRadiusFor(10), 30);
  assert.equal(terrainRadiusFor(20), 42);
  assert.equal(terrainRadiusFor(100), 52);
});

test('terrain height is deterministic for the same seed-derived variation and coordinates', () => {
  const a = terrainHeight(12, -7, 18, 4, 42, 'hills', 0.34);
  const b = terrainHeight(12, -7, 18, 4, 42, 'hills', 0.34);
  assert.equal(a, b);
});

test('snow and hills have a stronger distant ridge profile than meadow', () => {
  const meadow = terrainHeight(15, -8, 34, 4, 42, 'meadow', 0.34);
  const hills = terrainHeight(15, -8, 34, 4, 42, 'hills', 0.34);
  const snow = terrainHeight(15, -8, 34, 4, 42, 'snow', 0.34);
  assert.ok(hills > meadow);
  assert.ok(snow > hills);
});
