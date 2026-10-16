export type TerrainBiome = 'meadow'|'hills'|'temple'|'lava'|'snow'|'castle'|'village'|'witch';

const ridgeAmplitude: Record<TerrainBiome, number> = {
  meadow: 0.12, hills: 0.3, temple: 0.18, lava: 0.22,
  snow: 0.42, castle: 0.16, village: 0.14, witch: 0.2,
};

export function terrainRadiusFor(environmentRadius: number): number {
  const radius = Number.isFinite(environmentRadius) && environmentRadius > 0 ? environmentRadius : 10;
  return Math.floor(Math.max(30, Math.min(52, radius * 2.1)));
}

/** Deterministic, low-amplitude ridge profile for decorative terrain only. */
export function terrainHeight(q: number, r: number, ring: number, boardExtent: number, terrainRadius: number, biome: TerrainBiome, seededVariation: number): number {
  const reach = Math.max(1, terrainRadius - boardExtent);
  const normalizedRing = Math.max(0, ring - boardExtent - 2) / reach;
  const undulation = Math.sin(q * 0.31 + r * 0.23) * 0.13 + Math.cos(r * 0.27 - q * 0.19) * 0.1;
  const ridgeLift = Math.pow(normalizedRing, 1.35) * ridgeAmplitude[biome] * (0.6 + Math.sin(q * 0.13 + r * 0.09) * 0.4);
  return -0.98 + seededVariation + undulation + ridgeLift;
}
