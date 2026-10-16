# Asset folders

This directory is safe to populate with your owned/licensed assets. Empty starter folders are intentional.

- `2d/`: favicon, brand mark, and optional UI art. Edit `2d/manifest.json` to point to your replacement images.
- `models/`: GLB/GLTF models grouped by role. Edit `/assets/manifest.json` to activate a model override.
- `textures/`: source textures and UI material textures. Embedded GLB textures are currently the recommended in-world route.

All manifest paths are root-relative URLs beginning with `/assets/`. Procedural meshes remain the fallback whenever a model is absent or fails to load.

## In-game 2D artwork slots

Edit `2d/manifest.json`. Optional paths must point inside `/assets/`. Available slots are `favicon`, `brandMark`, `menuLogo`, `menuBackground`, `stageBackground`, `panelTexture`, `levelCardBackground`, `buttonTexture`, `glovesIcon`, `beltIcon`, and `shardIcon`. Leave a slot as an empty string to retain the built-in presentation. Keep UI icons transparent PNG or SVG where possible; use appropriately sized compressed images for backgrounds.
