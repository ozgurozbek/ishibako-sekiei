import type { Level, LevelObject } from './types';

export type GravityResult = {
  objects: LevelObject[];
  detachedIds: string[];
  fallenIds: string[];
};

/**
 * Resolve unsupported blocks deterministically. Glued assemblies fall as a
 * rigid vertical group: all members receive the same height delta. A group
 * is removed only when no common supported landing layer exists.
 */
export function resolveGravity(level: Level, objects: LevelObject[], attachedIds: Set<string>): GravityResult {
  const next = structuredClone(objects);
  const detachedIds: string[] = [];
  const fallenIds: string[] = [];
  if (!level.rules.gravity) return { objects: next, detachedIds, fallenIds };

  const blocks = next.filter((object) => object.type === 'block');
  const groups = new Map<string, LevelObject[]>();
  for (const block of blocks) {
    const groupKey = block.assemblyId ? `assembly:${block.assemblyId}` : `block:${block.id}`;
    const group = groups.get(groupKey) ?? [];
    group.push(block);
    groups.set(groupKey, group);
  }

  const cellAt = (q: number, r: number, h: number) => level.board.cells.find((cell) => cell.q === q && cell.r === r && cell.h === h);
  for (const group of groups.values()) {
    const needsGravity = group.some((block) => {
      const cell = cellAt(block.q, block.r, block.h);
      return !!cell && (cell.support === false || cell.kind === 'void');
    });
    if (!needsGravity) continue;

    const highest = Math.max(...group.map((block) => block.h));
    const lowest = Math.min(...group.map((block) => block.h));
    let landingDelta: number | null = null;
    for (let delta = 1; delta <= highest - lowest + 32; delta++) {
      const valid = group.every((block) => {
        const landing = cellAt(block.q, block.r, block.h - delta);
        return !!landing && landing.kind !== 'void' && landing.support !== false;
      });
      if (valid) { landingDelta = delta; break; }
    }

    if (landingDelta === null) {
      fallenIds.push(...group.map((block) => block.id));
      continue;
    }
    for (const block of group) {
      block.h -= landingDelta;
      if (attachedIds.has(block.id)) detachedIds.push(block.id);
    }
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
