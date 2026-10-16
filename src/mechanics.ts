import type { Hex, Level, LevelObject } from './types.ts';
import { DIRS, key } from './types.ts';

/** Blocks sharing an assemblyId are one rigid, inseparable glued assembly. */
export function assemblyMembers(objects: LevelObject[], objectId: string): LevelObject[] {
  const selected = objects.find((o) => o.id === objectId && o.type === 'block');
  if (!selected) return [];
  if (!selected.assemblyId) return [selected];
  return objects.filter((o) => o.type === 'block' && o.assemblyId === selected.assemblyId);
}

export type LaserTrace = { cells: Hex[]; receiverIds: string[] };

/**
 * Trace an axial-grid laser deterministically. `direction` is an index into DIRS.
 * A mirror reflects the ray around its orientation axis; walls, closed gates,
 * and blocks absorb it. The render layer can draw the returned path separately.
 */
export function traceLaser(level: Level, objects: LevelObject[], laser: LevelObject, maxSteps = 64): LaserTrace {
  const cells: Hex[] = [];
  const receiverIds: string[] = [];
  let q = laser.q;
  let r = laser.r;
  let h = laser.h;
  let direction = ((laser.direction ?? Number(laser.kind ?? 0)) % 6 + 6) % 6;
  const seen = new Set<string>();

  for (let i = 0; i < maxSteps; i++) {
    const dir = DIRS[direction];
    q += dir.q;
    r += dir.r;
    const p = { q, r, h };
    const cell = level.board.cells.find((c) => c.q === q && c.r === r && c.h === h && c.kind !== 'void');
    if (!cell) break;
    const stateKey = `${key(p)}:${direction}`;
    if (seen.has(stateKey)) break;
    seen.add(stateKey);
    cells.push(p);

    const atCell = objects.filter((o) => o.q === q && o.r === r && o.h === h && o.id !== laser.id);
    const receiver = atCell.find((o) => o.type === 'receiver');
    if (receiver) receiverIds.push(receiver.id);
    const mirror = atCell.find((o) => o.type === 'mirror');
    if (mirror) {
      const axis = ((mirror.direction ?? 0) % 6 + 6) % 6;
      direction = ((2 * axis - direction) % 6 + 6) % 6;
      continue;
    }
    const blocking = atCell.some((o) => {
      if (o.type === 'block' || o.type === 'wall') return true;
      if (o.type === 'gate') return !isLinkedMechanismOpen(o, objects);
      if (o.type === 'bridge') return !isLinkedMechanismOpen(o, objects) && o.kind !== 'normallyOpen';
      return false;
    });
    if (blocking) break;
  }
  return { cells, receiverIds: [...new Set(receiverIds)] };
}

export function isLinkedMechanismOpen(mechanism: LevelObject, objects: LevelObject[]): boolean {
  if (!mechanism.linkedTo) return mechanism.kind === 'normallyOpen';
  const plate = objects.find((o) => o.id === mechanism.linkedTo && o.type === 'plate');
  return !!plate && objects.some((o) => o.type === 'block' && o.q === plate.q && o.r === plate.r && o.h === plate.h);
}

export function sameHex(a: Hex, b: Hex): boolean {
  return a.q === b.q && a.r === b.r && a.h === b.h;
}
