# Texture assets

Keep standalone UI textures in `ui/` and material textures in `materials/`. Prefer power-of-two images and sensible resolutions (typically 512 or 1024 px for in-world materials). For 3D models, the most reliable browser workflow is to embed or reference textures from the GLB/GLTF model itself. Standalone material-texture assignment is not yet exposed in the runtime manifest; see `ASSET_PIPELINE.md`.
