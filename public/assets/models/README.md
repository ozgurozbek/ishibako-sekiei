# 3D model library

Use `.glb` for the simplest drop-in workflow. Put files in the matching role folder and register them in `../manifest.json`. The runtime clones models, fits them to a target height and footprint, centres the X/Z pivot, and places the model on the tile surface. This avoids requiring manual scale edits in code.

Example manifest entry:

```json
{
  "version": 1,
  "models": {
    "block": {
      "src": "/assets/models/blocks/prism.glb",
      "targetHeight": 0.9,
      "targetFootprint": 1.35,
      "yawDegrees": 0,
      "yOffset": 0
    },
    "player": {
      "src": "/assets/models/characters/player.glb",
      "targetHeight": 1.05,
      "targetFootprint": 0.9
    }
  }
}
```

Supported model keys match object types: `player`, `block`, `heavyBlock`, `fragileBlock`, `plate`, `goal`, `wall`, `lift`, `bridge`, `gate`, `laser`, `mirror`, `key`, `switch`, `conveyor`, `teleporter`, `shard`, `spikes`, and `receiver`. Use target dimensions in game world units. The pipeline fits within both dimensions, so a model may end up shorter than its target height when the footprint is the limiting dimension. Make collision independent of visual geometry; imported meshes are visual only. Keep polygon counts and texture sizes reasonable for browser performance.
