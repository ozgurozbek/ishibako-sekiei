# Ishibako: Hexbound

A browser-based, color-material prototype for a minimalist 3D hex puzzle game. The project is deliberately self-contained: no image textures or external game assets are required. Three.js renders the puzzle and seeded decorative environment; level data is JSON.

## Requirements

- Node.js 20 or newer recommended
- npm
- A modern browser with WebGL

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Play the example

1. Use W/A/S/D or the arrow keys to walk on the hex grid. Each successful walk costs one move.
2. Click the orange prism when adjacent to attach it. Attached blocks move with the player.
3. Carry the prism from `(1,0)` to the mint pressure plate at `(1,1)`. One walk in the `(0,1)` direction places it on the plate.
4. Detach the block with a click or Space, then walk to the violet exit at `(-2,1)`. The example move limit is five.
5. Q and E rotate attached blocks in 60-degree increments around the player. Rotations are free. Invalid moves do not spend a move.
6. Drag to orbit the camera and use the mouse wheel to zoom. Restart restores the level.

## Level JSON

`levels/example.json` is the example level. The running game starts from the equivalent in-source `starterLevel` so Vite does not require special JSON loading. Open **Level editor** to inspect or modify JSON, apply a level, import a JSON file, or export the current level.

Top-level fields:

- `version`: schema version.
- `metadata`: stable id, display name, author and description.
- `rules`: walking move limit and gravity setting.
- `board`: hex cells, elevation and optional cell kind.
- `objects`: player, blocks, pressure plates, goals and supported prototype mechanisms.
- `environment`: biome type, deterministic seed, decorative radius and density.
- `objectives`: required pressure plate IDs and goal ID.

Hex coordinates use axial `(q,r)` coordinates. World coordinates are derived from those values. Elevation is `h`. Cells and decorative environment are independent: scenery is render-only and does not participate in puzzle collision.

The editor validates JSON syntax, required entities, duplicate IDs, objective references and object positions against board cells. It is a JSON authoring panel rather than a full drag-and-drop tile painter in this prototype.

## Implemented prototype features

- Three-dimensional hexagonal board and isometric orbit camera.
- Player walking, move budget, restart and win condition.
- Multi-block attachment set, carried translation and 60-degree horizontal rotations.
- Pressure plate and exit objectives.
- Block collision checks and optional simple downward gravity.
- JSON import, apply, validate and export.
- Seeded meadow, hills, temple and lava-lake decorative palettes.
- Procedural geometric player/block/plate/goal visuals, emissive accents and animated details.
- Generated Web Audio click/step/rotation feedback and sound toggle.
- Responsive UI and HUD.

## Prototype limitations

This is a functional starter project, not a finished commercial game. Attachment rotation is a simple axial-grid transform; complex multi-block collision shapes, full rigid assemblies, dynamic gates, laser logic, lift routing, undo/redo, advanced gravity/support analysis, level solvability proofs, and a full visual tile-painting editor are not implemented. Object types such as `wall`, `lift`, `bridge`, `laser`, and `mirror` have basic visual placeholders only. The current gravity routine is intentionally conservative and should be replaced with a full support graph before authoring multi-storey production levels. The included example uses one elevation and is designed to be completed using the controls above.

## Suggested next engineering steps

1. Move state transitions into a pure deterministic simulation module with unit tests.
2. Add transaction-based undo and redo.
3. Formalize vertical support, falls, voids and collision for assemblies.
4. Implement mechanism graph updates for plates, gates, lifts, lasers and mirrors.
5. Add a visual editor for board cells, elevations and object placement.
6. Add browser test coverage and accessibility improvements.
