import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type ModelAssetEntry = {
  src: string;
  targetHeight?: number;
  targetFootprint?: number;
  yawDegrees?: number;
  yOffset?: number;
  /** Explicitly opt in only when the imported model replaces all state-specific visual cues. */
  replaceStateVisuals?: boolean;
};
export type AssetManifest = { version: number; models: Record<string, ModelAssetEntry> };

const emptyManifest: AssetManifest = { version: 1, models: {} };

/** Optional, manifest-driven GLB/GLTF replacement models. Procedural meshes remain the fallback. */
export class ModelAssetPipeline {
  private readonly loader = new GLTFLoader();
  private manifest: AssetManifest = emptyManifest;
  private readonly loaded = new Map<string, THREE.Object3D>();

  async load(manifestUrl = '/assets/manifest.json'): Promise<void> {
    try {
      const response = await fetch(manifestUrl, { cache: 'no-cache' });
      if (!response.ok) return;
      const parsed: unknown = await response.json();
      if (!parsed || typeof parsed !== 'object') return;
      const candidate = parsed as Partial<AssetManifest>;
      if (candidate.version !== 1 || !candidate.models || typeof candidate.models !== 'object') return;
      this.manifest = { version: 1, models: {} };
      for (const [key, value] of Object.entries(candidate.models)) {
        if (!value || typeof value !== 'object' || typeof value.src !== 'string' || !value.src.trim()) continue;
        this.manifest.models[key] = value as ModelAssetEntry;
      }
      await Promise.all(Object.entries(this.manifest.models).map(async ([key, entry]) => {
        try {
          const gltf = await this.loader.loadAsync(entry.src);
          this.loaded.set(key, gltf.scene);
        } catch (error) {
          console.warn(`[Ishibako assets] Could not load ${key} from ${entry.src}; using procedural fallback.`, error);
        }
      }));
    } catch {
      // The manifest is optional. Missing files or offline use never block the game.
    }
  }

  has(key: string): boolean { return this.loaded.has(key); }
  canReplaceStateVisuals(key: string): boolean { return this.manifest.models[key]?.replaceStateVisuals === true; }

  addModel(key: string, target: THREE.Group): boolean {
    const source = this.loaded.get(key);
    const entry = this.manifest.models[key];
    if (!source || !entry) return false;
    const model = source.clone(true);
    // Clone geometry and materials so the scene's normal cleanup cannot dispose cached assets.
    model.traverse((node: THREE.Object3D) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (mesh.geometry) mesh.geometry = mesh.geometry.clone();
      if (mesh.material) mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((item: THREE.Material) => item.clone())
        : mesh.material.clone();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const footprint = Math.max(size.x, size.z, 0.0001);
    const targetHeight = Math.max(0.01, entry.targetHeight ?? 0.9);
    const targetFootprint = Math.max(0.01, entry.targetFootprint ?? 1.35);
    const scale = Math.min(targetHeight / Math.max(size.y, 0.0001), targetFootprint / footprint);
    model.scale.multiplyScalar(scale);
    model.rotation.y = THREE.MathUtils.degToRad(entry.yawDegrees ?? 0);
    model.updateMatrixWorld(true);
    const fitted = new THREE.Box3().setFromObject(model);
    const center = fitted.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= fitted.min.y;
    model.position.y += entry.yOffset ?? 0;
    model.userData.externalAsset = true;
    target.add(model);
    return true;
  }
}

export const modelAssets = new ModelAssetPipeline();

/** Optional 2D UI slots; omitted paths leave the current CSS/UI intact. */
export async function apply2DAssetManifest(manifestUrl = '/assets/2d/manifest.json'): Promise<void> {
  try {
    const response = await fetch(manifestUrl, { cache: 'no-cache' });
    if (!response.ok) return;
    const value: unknown = await response.json();
    if (!value || typeof value !== 'object' || (value as { version?: unknown }).version !== 1) return;
    const manifest = value as { favicon?: unknown; brandMark?: unknown; stageBackground?: unknown; panelTexture?: unknown };
    const validPath = (path: unknown): path is string => typeof path === 'string' && path.startsWith('/assets/') && !path.includes('..');
    if (validPath(manifest.favicon)) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.append(link); }
      link.href = manifest.favicon;
    }
    if (validPath(manifest.brandMark)) {
      const image = document.querySelector<HTMLImageElement>('#brandMarkImage');
      if (image) image.src = manifest.brandMark;
    }
    if (validPath(manifest.stageBackground)) document.documentElement.style.setProperty('--asset-stage-background', `url("${manifest.stageBackground}")`);
    if (validPath(manifest.panelTexture)) document.documentElement.style.setProperty('--asset-panel-texture', `url("${manifest.panelTexture}")`);
  } catch {
    // Optional art never prevents the game from starting.
  }
}
