import type { Level, LevelObject } from './types';

export type GravityResult = {
  objects: LevelObject[];
  detachedIds: string[];
  fallenIds: string[];
};

/**
 * Resolve cells explicitly marked support:false. The function is deterministic
 * and does not mutate its arguments, so the same transition can be replayed.
 * Base cells and cells without an explicit support flag are solid by default.
 */
export function resolveGravity(level: Level, objects: LevelObject[], attachedIds: Set<string>): GravityResult {
  const next = structuredClone(objects);
  const detachedIds: string[] = [];
  const fallenIds: string[] = [];
  if (!level.rules.gravity) return { objects: next, detachedIds, fallenIds };

  for (const block of next.filter((object) => object.type === 'block')) {
    const current = level.board.cells.find((cell) => cell.q === block.q && cell.r === block.r && cell.h === block.h);
    if (!current || current.support !== false) continue;
    const landing = level.board.cells
      .filter((cell) => cell.q === block.q && cell.r === block.r && cell.h < block.h && cell.kind !== 'void' && cell.support !== false)
      .sort((a, b) => b.h - a.h)[0];

    if (!landing) {
      fallenIds.push(block.id);
      continue;
    }
    block.h = landing.h;
    if (attachedIds.has(block.id)) detachedIds.push(block.id);
  }

  return {
    objects: next.filter((object) => !fallenIds.includes(object.id)),
    detachedIds,
    fallenIds,
  };
}

/** One clockwise or counter-clockwise 60-degree axial rotation around a pivot. */
export function rotateAxial(q: number, r: number, sign: 1 | -1): { q: number; r: number } {
  return sign === 1 ? { q: -r, r: q + r } : { q: q + r, r: -q };
}
