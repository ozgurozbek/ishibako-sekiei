# Batch 16 — Terrain, Asset Readiness and Project Audit

## Implemented

- Extended procedural terrain radius to a bounded 30–52 hex rings based on environment radius.
- Added a pure deterministic terrain profile with coordinate-based undulation and biome-specific ridge strength.
- Expanded per-biome decorative props while keeping terrain outside the collision model.
- Added three terrain regression tests for radius bounds, deterministic height, and biome ridge differences.
- Added layered synthesized SFX cues for walking, blocked actions, attachment, rotation, keys, shards, switches, lifts, teleporters, and completion.
- Added `src/assets.ts`: optional manifest-driven GLB/GLTF model loading, cloned scene resources, target height/footprint fitting, X/Z centring, ground alignment, and procedural fallback.
- Added `public/assets/manifest.json`, `public/assets/models/`, `public/assets/textures/`, and the model import guide.
- Added a 2D manifest for favicon, brand mark, stage background, and panel texture. Added replaceable SVG favicon/brand-mark starters and wired the favicon/header mark.
- Preserved state-specific procedural visuals for mechanisms unless `replaceStateVisuals` is explicitly enabled. Heavy/fragile blocks can use dedicated `heavyBlock` and `fragileBlock` models.
- Added `PROJECT_STATUS.md` with the whole-app inventory, verification status, and prioritized remaining work; added `ASSET_PIPELINE.md` for artists.

## Verification

- `npm test`: 43 passed, 0 failed.
- All JSON files parsed successfully.
- Full production build remains unverified because `npm install` timed out in the workspace and Three.js/Vite declarations are unavailable locally.
- No browser end-to-end test or actual user-supplied model/texture test has been performed yet.

## Remaining

The immediate priority remains a dependency-enabled production build and browser regression pass. See `PROJECT_STATUS.md` for the full remaining-work list.
