# Ishibako: Hexbound

**Batch 5: presentation and animation pass.** This pass adds a soft cel-shaded look, a friendlier player character, biome-tinted atmosphere, and eased movement transitions. See `BATCH5.md` for details.

A browser-based 3D hex puzzle prototype built with Three.js and TypeScript. The board, objects and mechanisms are data-driven, and levels can be imported/exported as JSON. Materials use colors and procedural geometry rather than texture maps. A four-step gradient map creates a lightweight toon-shaded, toy-diorama style.

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
- Music: click **Music: off** to play the deterministic biome track. Each environment selects `1.mp3`, `2.mp3`, or `3.mp3` from `public/music/<musicFolder>/` using `((seed % 3) + 3) % 3 + 1`, so a given biome and level seed always choose the same track. By default, `musicFolder` is the environment `type`; set `environment.musicFolder` when the folder name differs. Use **Load music** to audition a local file for the current session. A loaded level resets the custom override and selects its own biome track. Browser playback begins only after a user gesture.
- SFX toggle: enable or disable generated sound effects.

## Included levels

- `levels/example.json`: the compact starter puzzle. Carry the orange prism onto the mint plate, then reach the violet exit within the walking move limit.
- `levels/mechanics-lab.json`: a multi-elevation sandbox containing a glued pair, a mirrored laser, a receiver, and two linked lifts. Open Level editor, import the JSON file, then apply it to load the lab.

The app starts from the equivalent of `levels/example.json` embedded in `src/level.ts` so it can launch without a special asset loader.

## JSON format

Top-level fields are `version`, `metadata`, `rules`, `board`, `objects`, `environment`, `presentation`, and `objectives`. Hex positions use axial coordinates `(q, r)` and elevation `h`. A cell is a board surface. Decorative scenery is generated separately from the puzzle board and does not participate in collision.

Supported object types include `player`, `block`, `plate`, `goal`, `wall`, `gate`, `bridge`, `lift`, `laser`, `mirror`, and `receiver`.

- Glued blocks share an `assemblyId`. Attaching any member attaches the whole group; group translation and rotation preserve the relative hex layout.
- A laser uses `direction` from 0 to 5, indexing the six axial directions in `src/types.ts`. Mirrors use `direction` as their reflection axis. Walls, blocks, and closed gates absorb the beam. Receiver activation is recomputed from the current laser paths. Add `objectives.requiredReceiverIds` to require one or more receivers before the exit can complete the level.
- A lift's `linkedTo` field references the ID of its paired lift. Stand on a lift and press F to transfer to its destination. Lift transfers consume one walking move.
- Gates and bridges can use `linkedTo` to reference a pressure plate or a laser receiver. Plate-linked mechanisms activate while a block occupies the plate; receiver-linked mechanisms activate while the receiver is lit. A bridge with `kind: "normallyOpen"` starts walkable.
- `direction` must be an integer from 0 through 5. Elevation is an integer-like layer value used in cell/object positions.

## Editor

Open **Level editor** to edit JSON, import a `.json` file, validate/apply the level, and export the current level. The canvas tools can move the spawn, add an adjacent tile, erase a tile, or place supported object types. Set Elevation to target a different `h` layer, then click a board tile to use its axial coordinate at the selected elevation. For mechanism linking, assembly IDs, mirror direction, or lift destinations, use JSON properties directly.

## Validation and tests

The validator checks required entities, duplicate object IDs/cells, object positions, solid overlaps, objective references, lift links, gate/bridge plate links, assembly properties, and valid direction indices. The automated test suite covers axial rotation, gravity and void falls, rigid glued-block falls, assembly lookup, laser paths and receivers, receiver-linked gates, pressure-plate-linked mechanism state, and deterministic biome music selection.

```bash
npm test
```

## Presentation notes

- A small shared gradient texture quantizes lighting into four pastel bands for toon shading. It is a lighting ramp, not a surface texture map.
- The player has a simple face and blush accents; board pieces retain clean hexagonal silhouettes.
- Movement and lift transfers ease between grid positions over a short interval. Puzzle logic remains discrete and resolves before the visual tween.
- Meadow and hills biomes include sparse stylized flowers. The environment remains decorative and never participates in puzzle collision.
- Reduced-motion preferences disable CSS transitions. Three.js movement easing remains brief and can be disabled in a future accessibility setting.

## Current limits

This remains a prototype rather than a production game. Laser tracing and receiver detection are deterministic, receivers can be required objectives and can activate linked gates/bridges, but arbitrary multi-step logic graphs are not yet supported. Laser paths are visualized and block entry into traced cells. The editor has JSON-based property editing rather than dedicated property panels. Gravity uses explicit unsupported cells rather than a full physical support graph. Lift transfer is a discrete action, not an animated elevator sequence. Biome music playback expects three numbered audio files in each biome folder. No actual soundtrack files were present in the project workspace when this batch was packaged, so only the deterministic music routing is included. Browser automation and a full production build could not be run in the current environment because package installation timed out.
