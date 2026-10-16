import type { Level } from './types.ts';

/** Stable music choice: the same biome folder and seed always select the same track. */
export function selectBiomeMusic(level: Pick<Level, 'environment'>): { folder: string; track: 1 | 2 | 3; src: string } {
  const env = level.environment as Level['environment'] & { musicFolder?: string };
  const rawFolder = (env.musicFolder || env.type || 'meadow').trim();
  // Keep the folder name but prevent URLs from escaping the public music directory.
  const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '');
  const seed = Number.isFinite(env.seed) ? Math.trunc(env.seed) : 0;
  const track = (((seed % 3) + 3) % 3 + 1) as 1 | 2 | 3;
  return { folder: folder || 'meadow', track, src: `music/${folder || 'meadow'}/${track}.mp3` };
}
