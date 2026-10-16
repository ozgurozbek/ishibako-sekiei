# Ishibako: Hexbound

A browser-based 3D hex puzzle prototype built with Three.js and TypeScript. The board, objects and mechanisms are data-driven, and levels can be imported/exported as JSON. Materials use colors and procedural geometry rather than texture maps.

## Run locally

Requirements: Node.js 20+, npm, and a browser with WebGL. Node.js 22.6+ is recommended for the built-in TypeScript test runner.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Production build and preview:

```bash
npm run build
npm run preview
```

## Controls

- W/A/S/D or arrow keys: walk on the hex grid. A successful walk costs one move.
- Click an adjacent block: attach or detach it. Blocks with the same `assemblyId` are treated as a glued assembly.
- Q/E: rotate attached blocks by 60 degrees around the player. Rotations are free.
- F: use a linked lift while standing on it. A successful lift transfer costs one move.
- Space: detach all attached blocks.
- Ctrl/Cmd+Z and Ctrl/Cmd+Y: undo and redo.
- Drag to orbit the camera; scroll to zoom.
- Load music: select an audio file from your device to loop it during play. Playback is local to the current browser session and the file is not copied into the project automatically. To bundle the soundtrack as the default, add the supplied track at `public/music/ishibako-theme.mp3` and wire it as the default source.
- SFX toggle: enable or disable generated sound effects.

## Included levels

- `levels/example.json`: the compact starter puzzle. Carry the orange prism onto the mint plate, then reach the violet exit within the walking move limit.
- `levels/mechanics-lab.json`: a multi-elevation sandbox containing a glued pair, a mirrored laser, a receiver, and two linked lifts. Open Level editor, import the JSON file, then apply it to load the lab.

The app starts from the equivalent of `levels/example.json` embedded in `src/level.ts` so it can launch without a special asset loader.

## JSON format

Top-level fields are `version`, `metadata`, `rules`, `board`, `objects`, `environment`, `presentation`, and `objectives`. Hex positions use axial coordinates `(q, r)` and elevation `h`. A cell is a board surface. Decorative scenery is generated separately from the puzzle board and does not participate in collision.

Supported object types include `player`, `block`, `plate`, `goal`, `wall`, `gate`, `bridge`, `lift`, `laser`, `mirror`, and `receiver`.

- Glued blocks share an `assemblyId`. Attaching any member attaches the whole group; group translation and rotation preserve the relative hex layout.
- A laser uses `direction` from 0 to 5, indexing the six axial directions in `src/types.ts`. Mirrors use `direction` as their reflection axis. Walls, blocks, and closed gates absorb the beam. The trace is deterministic and receiver hits are returned by the simulation helper.
- A lift's `linkedTo` field references the ID of its paired lift. Stand on a lift and press F to transfer to its destination. Lift transfers consume one walking move.
- Gates and bridges can use `linkedTo` to reference a pressure plate. Gates open and bridges activate while a block occupies that plate. A bridge with `kind: "normallyOpen"` starts walkable.
- `direction` must be an integer from 0 through 5. Elevation is an integer-like layer value used in cell/object positions.

## Editor

Open **Level editor** to edit JSON, import a `.json` file, validate/apply the level, and export the current level. The canvas tools can move the spawn, add an adjacent tile, erase a tile, or place supported object types. Set Elevation to target a different `h` layer, then click a board tile to use its axial coordinate at the selected elevation. For mechanism linking, assembly IDs, mirror direction, or lift destinations, use JSON properties directly.

## Validation and tests

The validator checks required entities, duplicate object IDs/cells, object positions, solid overlaps, objective references, lift links, gate/bridge plate links, assembly properties, and valid direction indices. The automated test suite covers axial rotation, gravity and void falls, rigid glued-block falls, assembly lookup, laser paths and receivers, and pressure-plate-linked mechanism state.

```bash
npm test
```

## Current limits

This remains a prototype rather than a production game. Laser tracing and receiver detection are deterministic, but receivers do not yet participate in the win condition or trigger arbitrary mechanism graphs. Laser paths are visualized and block entry into traced cells. The editor has JSON-based property editing rather than dedicated property panels. Gravity uses explicit unsupported cells rather than a full physical support graph. Lift transfer is a discrete action, not an animated elevator sequence. Audio selection is session-local until the soundtrack file is supplied and bundled. Browser automation and a full production build could not be run in the current environment because package installation timed out.
