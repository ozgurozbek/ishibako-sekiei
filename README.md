# Ishibako: Hexbound

**Batch 10: editor UX, bundled levels and fullscreen play.** Includes a bundled level selector, a single-hex blank canvas, docked editor, projected WASD destination markers, JSON-persisted appearance controls and resonance shard collectibles. See `BATCH10.md` and earlier batch notes for the implementation history.

A browser-based 3D hex puzzle prototype built with Three.js and TypeScript. The board, objects and mechanisms are data-driven, and levels can be imported/exported as JSON. Materials use colors and procedural geometry rather than texture maps. A four-step gradient map creates a lightweight toon-shaded, toy-diorama style.

## Bundled levels

Use the Level dropdown to load Blank Canvas, First Steps, First Light, Gap Garden, Two Plates, One Lift, Mechanics Lab, The Clockwork Garden: Grand Run, or the original JSON example. Choosing Blank Canvas opens the editor and selects the add-neighbour tool. The neighbour direction selector supports all six hex directions.

The editor appearance controls write `environment.customization` to level JSON (`tileColor`, `fogColor`, `lightX`, `lightY`, `lightZ`). Resonance shards are optional collectibles with no objective requirement.

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
- Music: click **Music: off** to play the deterministic biome track. The Vite music-catalog plugin scans each folder and lists supported audio files (`.mp3`, `.ogg`, `.wav`, `.m4a`, `.aac`, `.opus`, `.webm`) in `public/music/catalog.json`. A level selects one of the discovered files using its seed modulo the number of available tracks. Add `1.mp3` through `8.mp3`, or more numbered files, without changing code. The catalog refreshes when audio files are added or removed while the dev server is running. By default, `musicFolder` is the environment `type`; set `environment.musicFolder` when the folder name differs. Use **Load music** to audition a local file for the current session. Browser playback begins only after a user gesture.
- SFX toggle: enable or disable generated sound effects.

## Environment themes

Supported `environment.type` values are `meadow`, `hills`, `temple`, `lavaLake`, `snowMountain`, `medievalCastle`, `smallVillage`, and `witchHut`. The Level editor has a Biome selector to change the scenery without changing puzzle geometry. Each theme uses seeded decorative geometry, a matching sky/fog/ground palette, and subtle floating motes. Theme scenery is visual-only and does not affect puzzle collision.

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
- Meadow and hills include flowers and trees; temple includes sandstone columns; snow mountain has icy peaks; medieval castle has stone towers; small village has cottages; witch hut has a crooked cabin and dark trees; lava lake uses glowing rings. Scenery remains decorative and never participates in puzzle collision. Subtle motes drift in every theme.
- Reduced-motion preferences disable CSS transitions. Three.js movement easing remains brief and can be disabled in a future accessibility setting.

## Current limits

This remains a prototype rather than a production game. Laser tracing and receiver detection are deterministic, receivers can be required objectives and can activate linked gates/bridges, but arbitrary multi-step logic graphs are not yet supported. Laser paths are visualized and block entry into traced cells. The editor has JSON-based property editing rather than dedicated property panels. Gravity uses explicit unsupported cells rather than a full physical support graph. Lift transfer is a discrete action, not an animated elevator sequence. Biome music playback scans the files actually present in each biome folder and selects deterministically from that list. No actual soundtrack files were present in the project workspace when this batch was packaged, so the catalog is empty until audio is added. Browser automation and a full production build could not be run in the current environment because package installation timed out.

## Batch 7 update

Open **Level editor** and select **Load mechanics showcase** to load `levels/mechanics-showcase.json` directly. It contains the current showcase puzzle and can also be exported as JSON.

The editor's **Quick connections** panel supports drag-and-drop links: drag a plate, receiver or key chip onto a gate/bridge target, or drag one lift onto another lift to create a reciprocal pair. Select a laser emitter or mirror in the scene and use **Rotate selected laser / mirror** or press `R` to cycle its six hex directions.

WASD and arrow keys are camera-relative, and the direction mapping appears below the movement controls. Collect a key before attaching blocks if you want to walk while carrying them. Collected keys can be linked to gates and bridges.


The Batch 7 automated suite contains 19 tests, including level validation and a check that the mechanics showcase includes the expected mechanic families. Run it with `npm test`.


## Batch 8 update

- Hover over an object to see its name, ID, hex position, elevation, orientation where relevant, and connection state. A gate or bridge reports its source; a plate, receiver or key reports connected targets. Blocks show whether they are adjacent and attachable, currently attached, or need the player to move closer.
- Object picking now raycasts object meshes before board cells, avoiding tile-surface hits masking block clicks. Blocks also have clearer click affordance through the cursor.
- The procedural field now uses layered hex prisms with separate top facets, a broader range of elevations, more intentional color variation, stronger near-field fog, and a distant themed silhouette ring. These are render-only and do not affect puzzle collision.
- `npm test` passes all 19 tests. TypeScript syntax was inspected, but a complete typecheck/build could not finish because dependencies could not be installed in this environment.


## Batch 9: run recordings and the Clockwork Garden

When a level is completed, the completion dialog offers **Download run recording**. The exported `ishibako-run-recording` JSON contains the original level, timestamps, action names, and the player/object/attachment state after each action. Undo and redo are included in the timeline. This is a compact solution record, not a video file.

The mechanics showcase is now **The Clockwork Garden: Grand Run**. Open the editor and choose **Load mechanics showcase**. It demonstrates a key-gated attachment flow, two pressure plates controlling one gate, a plate-enabled lift, multiple elevations, a collectible summit key, a block dropped through a gap onto a lower plate, a laser and mirror, receiver-linked bridge, switch-controlled gate, conveyor, paired teleporters, fragile floor, and glued blocks. The showcase sets `moveLimitEnabled` to `false` and `moveLimit` to `999`. Set `moveLimitEnabled` to `true` to enforce the numeric move limit.

### Added JSON fields and mechanics

- `rules.moveLimitEnabled`: set to `false` for no move limit; the numeric `moveLimit` remains available for display or later re-enabling.
- `objectives.requiredKeyIds`: key IDs that must be collected before the exit can complete.
- `linkedToAll`: a gate or bridge opens only when every referenced plate, receiver, key, or switch is active.
- `enabledBy`: a lift can be paired to another lift through `linkedTo`, and separately enabled by a plate, receiver, key, or switch through `enabledBy`.
- `conveyor` objects use `direction` from 0 to 5 and push a player one hex when stepped onto, if the next cell is clear.
- Paired `teleporter` objects use reciprocal `linkedTo` IDs. They transfer the player and any attached blocks when entered.
- Cells with `kind: "fragile"` collapse after the player leaves them. Cells with `support: false` are drawn as gaps and allow blocks to fall to a supported lower cell at the same axial coordinate.
- Blocks sharing `assemblyId` form a glued rigid group. The render layer shows a badge, connector bar and rivet between members; attached blocks show warm tethers to the player.
