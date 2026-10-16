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

export function isSourceActive(sourceId: string, objects: LevelObject[]): boolean {
  const source = objects.find((o) => o.id === sourceId);
  if (!source) return false;
  if (source.type === 'plate') return objects.some((o) => o.type === 'block' && o.q === source.q && o.r === source.r && o.h === source.h);
  if (source.type === 'receiver' || source.type === 'key' || source.type === 'switch') return !!source.active;
  return false;
}

export function isLinkedMechanismOpen(mechanism: LevelObject, objects: LevelObject[]): boolean {
  if (mechanism.type === 'lift' && mechanism.enabledBy) return isSourceActive(mechanism.enabledBy, objects);
  if (mechanism.linkedToAll?.length) return mechanism.linkedToAll.every((id) => isSourceActive(id, objects));
  if (!mechanism.linkedTo) return mechanism.kind === 'normallyOpen';
  const linked = objects.find((o) => o.id === mechanism.linkedTo);
  if (linked?.type === 'lift' || linked?.type === 'teleporter') return true;
  return isSourceActive(mechanism.linkedTo, objects);
}

export function sameHex(a: Hex, b: Hex): boolean {
  return a.q === b.q && a.r === b.r && a.h === b.h;
}

/** Recompute receiver activation from all current laser traces. Two passes allow
 * a receiver-linked gate to react after the first pass without recursive tracing. */
export function refreshReceiverStates(level: Level, objects: LevelObject[]): string[] {
  for (const o of objects) if (o.type === 'receiver') o.active = false;
  for (let pass = 0; pass < 2; pass++) {
    const lit = new Set<string>();
    for (const laser of objects.filter((o) => o.type === 'laser')) {
      for (const id of traceLaser(level, objects, laser).receiverIds) lit.add(id);
    }
    for (const receiver of objects.filter((o) => o.type === 'receiver')) receiver.active = lit.has(receiver.id);
  }
  return objects.filter((o) => o.type === 'receiver' && o.active).map((o) => o.id);
}
