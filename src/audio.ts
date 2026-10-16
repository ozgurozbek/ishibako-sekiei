import type { Level } from './types.ts';

export type MusicCatalog = Record<string, string[]>;
export type BiomeMusicChoice = { folder: string; track: number; src: string; availableTracks: number };
const AUDIO_EXTENSIONS = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.opus', '.webm']);

/** Stable selection from the files actually present in the biome folder. */
export function selectBiomeMusic(level: Pick<Level, 'environment'>, catalog: MusicCatalog = {}): BiomeMusicChoice {
  const env = level.environment as Level['environment'] & { musicFolder?: string };
  const rawFolder = (env.musicFolder || env.type || 'meadow').trim();
  const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'meadow';
  const discovered = catalog[folder]?.filter((name) => AUDIO_EXTENSIONS.has(name.slice(name.lastIndexOf('.')).toLowerCase())).slice().sort((a, b) => {
    const an = Number(a.match(/^(\d+)/)?.[1]);
    const bn = Number(b.match(/^(\d+)/)?.[1]);
    if (Number.isFinite(an) && Number.isFinite(bn) && an !== bn) return an - bn;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
  const files = discovered?.length ? discovered : ['1.mp3', '2.mp3', '3.mp3'];
  const seed = Number.isFinite(env.seed) ? Math.trunc(env.seed) : 0;
  const index = ((seed % files.length) + files.length) % files.length;
  const filename = files[index];
  const trackMatch = filename.match(/^(\d+)/);
  const track = trackMatch ? Number(trackMatch[1]) : index + 1;
  return { folder, track, src: `music/${folder}/${filename}`, availableTracks: files.length };
}
