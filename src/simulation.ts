import type { Hex, Level, LevelObject } from './types.ts';
import { key } from './types.ts';
import { isLinkedMechanismOpen } from './mechanics.ts';

export type GravityResult = {
  objects: LevelObject[];
  detachedIds: string[];
  fallenIds: string[];
};

export type PlacementResult = { valid: boolean; reason?: string; collisionId?: string };

const SOLID_TYPES = new Set(['block', 'wall', 'gate', 'mirror']);

/**
 * Validates a proposed rigid-group placement as a single transaction. All moving
 * objects are excluded from the external collision set, then checked against one
 * another to catch malformed overlapping assemblies as well as world collisions.
 * A declared void cell is a legal transient block position because gravity resolves
 * after the transaction; a missing cell is never a legal destination.
 */
export function validateAssemblyPlacement(
  level: Level,
  objects: LevelObject[],
  candidates: Array<Pick<LevelObject, 'id' | 'q' | 'r' | 'h'>>,
  movingIds: Set<string>,
): PlacementResult {
  const candidateKeys = new Set<string>();
  for (const candidate of candidates) {
    const k = key(candidate);
    if (candidateKeys.has(k)) return { valid: false, reason: 'Two assembly members would overlap.', collisionId: candidate.id };
    candidateKeys.add(k);
    const cell = level.board.cells.find(c => c.q === candidate.q && c.r === candidate.r && c.h === candidate.h);
    if (!cell) return { valid: false, reason: 'The destination is outside the board.', collisionId: candidate.id };
    if (cell.kind === 'wall') return { valid: false, reason: 'The destination is a wall tile.', collisionId: candidate.id };
    const blocker = objects.find(o => !movingIds.has(o.id) && o.q === candidate.q && o.r === candidate.r && o.h === candidate.h && (
      SOLID_TYPES.has(o.type) && (o.type !== 'gate' || !isLinkedMechanismOpen(o, objects))
    ));
    if (blocker) return { valid: false, reason: `Blocked by ${blocker.id}.`, collisionId: blocker.id };
  }
  return { valid: true };
}

/**
 * Resolve unsupported blocks and glued assemblies deterministically. A rigid group
 * falls by one shared height delta, cannot pass through another solid object, and
 * lands only where every member has a supported cell. An assembly that has no
 * common valid landing is removed as a whole.
 */
export function resolveGravity(level: Level, objects: LevelObject[], attachedIds: Set<string>): GravityResult {
  const next = structuredClone(objects);
  const detachedIds: string[] = [];
  const fallenIds: string[] = [];
  if (!level.rules.gravity) return { objects: next, detachedIds, fallenIds };

  const groups = new Map<string, LevelObject[]>();
  for (const block of next.filter(o => o.type === 'block')) {
    const groupKey = block.assemblyId ? `assembly:${block.assemblyId}` : `block:${block.id}`;
    const group = groups.get(groupKey) ?? [];
    group.push(block);
    groups.set(groupKey, group);
  }
  const cellAt = (p: Hex) => level.board.cells.find(c => c.q === p.q && c.r === p.r && c.h === p.h);
  const removed = new Set<string>();

  // Higher assemblies settle first so their landing can block groups below them.
  const orderedGroups = [...groups.values()].sort((a, b) => Math.max(...b.map(o => o.h)) - Math.max(...a.map(o => o.h)));
  for (const group of orderedGroups) {
    const movingIds = new Set(group.map(o => o.id));
    const needsGravity = group.some(block => {
      const cell = cellAt(block);
      return !cell || cell.support === false || cell.kind === 'void';
    });
    if (!needsGravity) continue;
    const fragile = group.filter(block => block.kind === 'fragile');
    if (fragile.length) {
      for (const block of group) { fallenIds.push(block.id); removed.add(block.id); }
      continue;
    }

    const maxDelta = Math.max(...group.map(o => o.h)) - Math.min(...group.map(o => o.h)) + 64;
    let landingDelta: number | null = null;
    for (let delta = 1; delta <= maxDelta; delta++) {
      let valid = true;
      for (const block of group) {
        const landing = { q: block.q, r: block.r, h: block.h - delta };
        const cell = cellAt(landing);
        if (!cell || cell.kind === 'void' || cell.kind === 'wall' || cell.support === false) { valid = false; break; }
        // The group may not pass through a solid object while falling.
        for (let step = 1; step <= delta; step++) {
          const h = block.h - step;
          const obstacle = next.find(o => !movingIds.has(o.id) && !removed.has(o.id) && o.q === block.q && o.r === block.r && o.h === h && (
            SOLID_TYPES.has(o.type) && (o.type !== 'gate' || !isLinkedMechanismOpen(o, next))
          ));
          if (obstacle) { valid = false; break; }
        }
        if (!valid) break;
      }
      if (!valid) continue;
      // Also ensure the destination cells are distinct and not occupied by other blocks.
      const placement = validateAssemblyPlacement(level, next.filter(o => !removed.has(o.id)), group.map(o => ({ id: o.id, q: o.q, r: o.r, h: o.h - delta })), movingIds);
      if (placement.valid) { landingDelta = delta; break; }
    }

    if (landingDelta === null) {
      for (const block of group) { fallenIds.push(block.id); removed.add(block.id); }
      continue;
    }
    for (const block of group) {
      block.h -= landingDelta;
      if (attachedIds.has(block.id)) detachedIds.push(block.id);
    }
  }
  return { objects: next.filter(o => !removed.has(o.id)), detachedIds, fallenIds };
}

/** One clockwise or counter-clockwise 60-degree axial rotation around a pivot. */
export function rotateAxial(q: number, r: number, sign: 1 | -1): { q: number; r: number } {
  return sign === 1 ? { q: -r, r: q + r } : { q: q + r, r: -q };
}

/** Slide moved blocks along their movement vector while they occupy ice. The first non-ice tile is a stopping tile; unsupported cells are entered and then resolved by gravity. */
export function slideBlocksOnIce(level: Level, objects: LevelObject[], moves: Array<{id:string; dq:number; dr:number}>): LevelObject[] {
  const next = structuredClone(objects);
  const cellAt = (q:number,r:number,h:number) => level.board.cells.find(c=>c.q===q&&c.r===r&&c.h===h);
  for (const move of moves) {
    let block = next.find(o=>o.id===move.id&&o.type==='block'); if(!block) continue;
    const dq=move.dq, dr=move.dr; if(Math.abs(dq)+Math.abs(dr)+Math.abs(dq+dr) !== 2) continue;
    let guard=0;
    while(guard++<64) {
      const current=cellAt(block.q,block.r,block.h); if(current?.kind!=='ice') break;
      const q=block.q+dq,r=block.r+dr,h=block.h; const dest=cellAt(q,r,h);
      if(!dest) { block.q=q; block.r=r; break; }
      const blocker=next.find(o=>o.id!==block!.id&&o.q===q&&o.r===r&&o.h===h&&(o.type==='block'||o.type==='wall'||o.type==='mirror'||(o.type==='gate'&&!isLinkedMechanismOpen(o,next))));
      if(blocker) break;
      block.q=q; block.r=r;
      if(dest.kind==='void'||dest.support===false) break;
      if(dest.kind!=='ice') break;
    }
  }
  const fireCells=new Set(next.filter(o=>o.type==='fire').map(o=>`${o.q},${o.r},${o.h}`));
  return next.filter(o=>o.type!=='block'||!fireCells.has(`${o.q},${o.r},${o.h}`));
}
