# Ishibako: Hexbound

A browser-based, color-material prototype for a minimalist 3D hex puzzle game. The project is deliberately self-contained: no image textures or external game assets are required. Three.js renders the puzzle and seeded decorative environment; level data is JSON.

## Requirements

- Node.js 20 or newer for the game; Node.js 22.6+ for the built-in TypeScript test runner
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

The editor supports both JSON authoring and basic board-canvas editing. Choose a canvas tool, then click a tile: place/move objects, erase a tile, or add a tile one hex east of the clicked tile. The elevation field selects the target height for editor operations. JSON validation checks required entities, duplicate IDs and cells, objective references, solid-object overlaps, linked plate references, and object positions.

## Implemented prototype features

- Three-dimensional hexagonal board and isometric orbit camera.
- Player walking, move budget, restart and win condition.
- Multi-block attachment set, carried translation and 60-degree horizontal rotations.
- Pressure plate and exit objectives.
- Block collision checks and optional simple downward gravity.
- JSON import, apply, validate and export.
- Gameplay undo/redo (toolbar buttons or Ctrl/Cmd+Z and Ctrl/Cmd+Y), including walking, attachment and rotation.
- Deterministic simulation helpers with tests for axial rotation and unsupported-block gravity.
- Basic visual board editor for adding cells, removing cells, moving the spawn, and placing blocks, plates, exits, walls, gates, lifts and bridges.
- Pressure-plate-linked gates and retractable bridges using each mechanism's `linkedTo` plate ID.
- Gravity handling for cells explicitly marked `support: false`; blocks fall to the highest lower supported cell or are removed if no landing exists.
- Seeded meadow, hills, temple and lava-lake decorative palettes.
- Procedural geometric player/block/plate/goal visuals, emissive accents and animated details.
- Generated Web Audio click/step/rotation feedback and sound toggle.
- Responsive UI and HUD.

## Prototype limitations

This is a functional starter project, not a finished commercial game. Attachment rotation is a simple axial-grid transform; complex multi-block rigid assembly collision, laser reflection logic, lift routing, a dedicated height-layer painting view, and level solvability proofs are not implemented. The canvas editor is intentionally basic. Gravity only reacts to cells explicitly marked `support: false`; it is not a full physical support solver. Object types such as `wall`, `lift`, `bridge`, `laser`, and `mirror` have basic visual placeholders only. The current gravity routine is intentionally conservative and should be replaced with a full support graph before authoring multi-storey production levels. The included example uses one elevation and is designed to be completed using the controls above.

## Suggested next engineering steps

1. Move all player, assembly and mechanism transitions into the deterministic simulation module.
2. Add true rigid assemblies for glued blocks and exhaustive collision validation for rotated groups.
3. Add lift routing and laser emitter, mirror and receiver logic.
4. Add browser-level interaction tests and keyboard/screen-reader accessibility checks.
5. Add a visual height-layer inspector and richer object property controls to the editor.
6. Add a solvability checker for small levels and a set of multilevel sample puzzles.
