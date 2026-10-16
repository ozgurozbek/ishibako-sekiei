# Art and external asset review

## Current state

The game currently builds its scene from procedural Three.js meshes and shared toon materials. This is a good fit for the intended clean, low-poly diorama style: assets are lightweight, colors remain controllable, and the game does not depend on downloaded files to start.

The existing visual direction is coherent enough to retain. The highest-value future improvements are more distinctive silhouettes for the player and interactive objects, clearer material differences between stone/metal/wood/magic, more biome-specific landmarks, and small state-driven animations for gates, lifts, plates, bridges, and teleporters. These are polish improvements, not blockers for the current batch.

## External model support proposal

If external models are introduced later, prefer `.glb` files (or glTF with its accompanying resources). The user should only need to copy assets into a predictable folder and edit a small manifest, not alter TypeScript or manually calculate scale.

Proposed structure:

```text
public/
  models/
    characters/
    blocks/
    mechanisms/
    environment/
  textures/
    materials/
    environment/
  assets.json
```

Each manifest entry should specify the model path, target world height, optional target footprint, ground-anchor offset, whether it casts/receives shadows, and any material overrides. A loader utility can compute the source bounding box, normalize scale to the target height, center the model on its footprint, and place its base on the hex tile. That keeps sizing consistent even when downloaded models use different units or origins.

## Asset constraints to preserve

- Keep collision and puzzle rules independent from render meshes. A decorative model must never silently change movement or support logic.
- Keep the current procedural mesh as a fallback if a model is missing or fails to load.
- Prefer low-poly or stylized assets with clear silhouettes; avoid photorealistic textures that conflict with the toon palette.
- Use texture atlases or compressed textures when practical, and avoid large unique textures for small hex objects.
- Bundle licenses and source URLs in an asset manifest before shipping any downloaded model or texture.
- Test model height and footprint in the editor using the existing hex size, then let the normalizer handle final scale automatically.

No external assets or texture pipeline are added in Batch 15. This is a review and proposed workflow only.
