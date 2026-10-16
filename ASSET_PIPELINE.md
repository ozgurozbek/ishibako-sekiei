# Artist-friendly asset pipeline

The asset folders are designed so a modeller or artist can contribute without editing TypeScript.

## 3D models

1. Export an asset from Blender or Unity to `.glb` where possible. Keep the model's intended forward direction consistent and use a sensible real-world scale.
2. Put it in a role folder under `public/assets/models/`: `characters/`, `blocks/`, `mechanisms/`, or `environment/`.
3. Add its path and target dimensions to `public/assets/manifest.json`.
4. Start the dev server or rebuild. The game loads the manifest and normalises the model to the configured height/footprint, centres its horizontal pivot, aligns the bottom to the hex surface, and uses procedural geometry if loading fails.
5. Test it in several levels, elevations, and camera angles. Visual geometry does not change gameplay collision.

Example:

```json
{
  "version": 1,
  "models": {
    "player": { "src": "/assets/models/characters/player.glb", "targetHeight": 1.05, "targetFootprint": 0.9 },
    "block": { "src": "/assets/models/blocks/prism.glb", "targetHeight": 0.9, "targetFootprint": 1.35 },
    "goal": { "src": "/assets/models/mechanisms/portal.glb", "targetHeight": 1.25, "targetFootprint": 1.35, "yawDegrees": 0 }
  }
}
```

Model keys are `player`, `block`, `heavyBlock`, `fragileBlock`, `plate`, `goal`, `wall`, `lift`, `bridge`, `gate`, `laser`, `mirror`, `key`, `switch`, `conveyor`, `teleporter`, `shard`, `spikes`, and `receiver`. Use `heavyBlock` and `fragileBlock` entries for those special block variants; if no dedicated model is registered, their procedural markings remain visible. Static models can replace procedural visuals by default. Stateful mechanisms retain their procedural visuals by default to preserve open/closed/active cues. To replace one, add `"replaceStateVisuals": true` to that entry only when the custom model itself communicates all relevant states or those states have another unmistakable visual cue.

Dimensions are world units. `targetHeight` and `targetFootprint` define a maximum fit box, not a promise that both dimensions are filled. The smaller fitting scale is used to preserve the original aspect ratio. `yawDegrees` corrects the model's forward orientation; `yOffset` is a small optional ground-alignment correction.

## 2D art

Edit `public/assets/2d/manifest.json`:

- `favicon`: favicon URL.
- `brandMark`: small header mark.
- `stageBackground`: optional stage background image.
- `panelTexture`: optional bottom-panel texture.

Only paths under `/assets/` are accepted. Empty strings leave the built-in styling unchanged. The starter SVGs are replaceable examples, not required final art.

Additional 2D slots (level thumbnails, button icons, title/loading artwork, in-game objective icons) can be added when the actual image set is available and the desired mapping is agreed.

## Textures and materials

The current runtime uses embedded model materials. For predictable GLB delivery, include base colour, normal, roughness/metallic and emissive textures inside the exported asset where needed, and avoid depending on Unity-only shader graphs. Standalone texture files can be stored under `public/assets/textures/`, but assigning arbitrary external texture maps to a model through a separate manifest is not yet implemented.

## Performance and rights

- Keep low-detail collision out of imported visual meshes; puzzle collision is defined by the hex level data.
- Use a modest polygon budget, compressed/appropriately sized textures, and GLB where practical.
- Avoid large transparent textures and excessive material slots.
- Preserve animation clips only where the app has an animation state to drive them; generic animated GLBs are not yet guaranteed to play automatically.
- Confirm that every imported asset is owned, appropriately licensed, or otherwise permitted for redistribution.
