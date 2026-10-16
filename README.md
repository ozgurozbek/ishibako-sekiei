# Ishibako: Sekiei

**Batch 10: editor UX, bundled levels and fullscreen play.** Includes a bundled level selector, a single-hex blank canvas, docked editor, projected WASD destination markers, JSON-persisted appearance controls and resonance shard collectibles. See `BATCH10.md` and earlier batch notes for the implementation history.

A browser-based 3D hex puzzle prototype built with Three.js and TypeScript. The board, objects and mechanisms are data-driven, and levels can be imported/exported as JSON. Materials use colors and procedural geometry rather than texture maps. A four-step gradient map creates a lightweight toon-shaded, toy-diorama style.

## Bundled levels

Open the in-game menu and choose **Level selector** to browse the bundled puzzles in a scrollable hex grid. Completed levels display a tick. The menu also provides campaign access, fullscreen, editor, replay import, and music import. Choosing Blank Canvas opens the editor and selects the add-neighbour tool. The neighbour direction selector supports all six hex directions.

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
- Music: music is enabled by default and fades between the menu soundtrack and deterministic biome tracks. The Vite music-catalog plugin scans each folder and lists supported audio files (`.mp3`, `.ogg`, `.wav`, `.m4a`, `.aac`, `.opus`, `.webm`) in `public/music/catalog.json`. A level selects one of the discovered files using its seed modulo the number of available tracks. Add `1.mp3` through `8.mp3`, or more numbered files, without changing code. The catalog refreshes when audio files are added or removed while the dev server is running. By default, `musicFolder` is the environment `type`; set `environment.musicFolder` when the folder name differs. Use **Import music** in the menu to audition a local file for the current session. The main-menu track belongs at `public/music/menu/1.mp3`. Browser autoplay policies may require a user gesture before playback starts.
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

This remains a prototype rather than a production game. Laser tracing and receiver detection are deterministic, receivers can be required objectives and can activate linked gates/bridges, but arbitrary multi-step logic graphs are not yet supported. Active laser beams and spikes are hazards to the player only; they do not block attached blocks, although blocks can interrupt laser paths. Gravity uses explicit unsupported cells rather than a full physical support graph. Lift transfer is a discrete action, not a complete animated elevator sequence. Biome music playback scans the files actually present in each biome folder and selects deterministically from that list. No soundtrack files were included in this workspace when this batch was packaged. Optional GLB/GLTF model overrides and 2D art slots are now manifest-driven; standalone external texture assignment and automatic playback of arbitrary model animation clips are not yet implemented. Browser automation and a full production build could not be run in the current environment because package installation timed out.

## Batch 7 update

Open **Level editor** and select **Load mechanics showcase** to load `levels/mechanics-showcase.json` directly. It contains the current showcase puzzle and can also be exported as JSON.

The editor's **Quick connections** panel supports drag-and-drop links: drag a plate, receiver, gloves or switch chip onto a gate/bridge target, or drag one lift onto another lift to create a reciprocal pair. Select a laser emitter or mirror in the scene and use **Rotate selected laser / mirror** or press `R` to cycle its six hex directions.

WASD and arrow keys are camera-relative, and the direction mapping appears below the movement controls. Collect gloves before walking while carrying attached blocks. Legacy `key` objects now render as gloves and remain compatible with existing level JSON. Collect a belt pickup before rotating an assembly containing a heavy block.


The Batch 7 automated suite contains 19 tests, including level validation and a check that the mechanics showcase includes the expected mechanic families. Run it with `npm test`.


## Batch 8 update

- Hover over an object to see its name, ID, hex position, elevation, orientation where relevant, and connection state. A gate or bridge reports its source; a plate, receiver or key reports connected targets. Blocks show whether they are adjacent and attachable, currently attached, or need the player to move closer.
- Object picking now raycasts object meshes before board cells, avoiding tile-surface hits masking block clicks. Blocks also have clearer click affordance through the cursor.
- The procedural field now uses layered hex prisms with separate top facets, a broader range of elevations, more intentional color variation, stronger near-field fog, and a distant themed silhouette ring. These are render-only and do not affect puzzle collision.
- `npm test` passes all 19 tests. TypeScript syntax was inspected, but a complete typecheck/build could not finish because dependencies could not be installed in this environment.


## Batch 9: run recordings and the Clockwork Garden

When a level is completed, the completion dialog offers **Download run recording**. The exported `ishibako-run-recording` JSON contains the original level, timestamps, action names, and the player/object/attachment state after each action. Undo and redo are included in the timeline. This is a compact solution record, not a video file.

The mechanics showcase is now **The Clockwork Garden: Grand Run**. Open the editor and choose **Load mechanics showcase**. It demonstrates a gloves-gated attachment flow, two pressure plates controlling one gate, a plate-enabled lift, multiple elevations, a collectible summit gloves pickup, a block dropped through a gap onto a lower plate, a laser and mirror, receiver-linked bridge, switch-controlled gate, conveyor, paired teleporters, fragile floor, and glued blocks. The showcase sets `moveLimitEnabled` to `false` and `moveLimit` to `999`. Set `moveLimitEnabled` to `true` to enforce the numeric move limit.

### Added JSON fields and mechanics

- `rules.moveLimitEnabled`: set to `false` for no move limit; the numeric `moveLimit` remains available for display or later re-enabling.
- `objectives.requiredKeyIds`: key IDs that must be collected before the exit can complete.
- `linkedToAll`: a gate or bridge opens only when every referenced plate, receiver, key, or switch is active.
- `enabledBy`: a lift can be paired to another lift through `linkedTo`, and separately enabled by a plate, receiver, key, or switch through `enabledBy`.
- `conveyor` objects use `direction` from 0 to 5 and push a player one hex when stepped onto, if the next cell is clear.
- Paired `teleporter` objects use reciprocal `linkedTo` IDs. They transfer the player and any attached blocks when entered.
- Cells with `kind: "fragile"` collapse after the player leaves them. Cells with `support: false` are drawn as gaps and allow blocks to fall to a supported lower cell at the same axial coordinate.
- Blocks sharing `assemblyId` form a glued rigid group. The render layer shows a badge, connector bar and rivet between members; attached blocks show warm tethers to the player.


## Batch 11 additions

- **Replay viewer:** use **Open replay** to import a run-recording JSON. Playback supports play/pause, step backward/forward, and seeking along the timeline.
- **Selected-object inspector:** select an object in the scene while the editor is open to edit its kind, colour, direction, assembly ID and connection references. Use the disconnect controls to remove connections without editing raw JSON.
- **Collision-safe rigid groups:** block moves, rotations and lift transfers use shared placement checks. Gravity resolves glued assemblies as rigid groups and checks blockers along fall paths and at landing cells.
- **Heavy blocks and weighted plates:** set a block's `kind` to `heavy` and a plate's `kind` to `heavyOnly`. Only heavy blocks activate those plates.
- **Fragile blocks:** set a block's `kind` to `fragile`; it breaks when it becomes unsupported and begins falling.
- **Spike hazards:** place a `spikes` object on a cell to make that hex unsafe for the player. Attached blocks can pass through or occupy it.
- **Advanced Mechanics Lab:** select it from the bundled level dropdown to explore the new heavy-block, heavy-only plate, spikes and fragile-block behaviours.

### Replay file compatibility

Replay files use `format: "ishibako-run-recording"`, version `1`, and include the initial level plus a snapshot for each recorded action. The viewer validates the structure before loading it.

## Batch 12 simulation hardening

Receiver activation now resolves to a stable state across linked gates before and after gravity. Feedback loops that do not settle fail closed. Imported run recordings are checked for supported version, sequential frames, valid counters and required state fields before playback. See `BATCH12.md` for the changes and regression coverage.


## Batch 16: terrain, sound cues and asset pipeline

- Terrain now extends farther from the puzzle, with deterministic low-amplitude undulation and biome-dependent distant ridges. Decorative field props have more variation in all eight biomes and remain separate from puzzle collision.
- Synthesized SFX now include layered cues for movement, blocked actions, attachment, rotation, key/shard collection, switches, lifts, teleporters, and completion.
- Added `public/assets/manifest.json` for optional GLB/GLTF model replacements with automatic height/footprint fitting, horizontal centring and ground alignment. Stateful mechanism models keep procedural state cues unless explicitly opted in.
- Added `public/assets/2d/manifest.json` for favicon, brand mark, stage background and panel texture, plus replaceable starter SVGs.
- See `PROJECT_STATUS.md` for the full implementation inventory and prioritized remaining work, and `ASSET_PIPELINE.md` for the artist workflow.
- `npm test` passes 56 tests. The production build remains unverified because dependencies are not installed in this workspace.


## Batch 18: campaign atlas and secret shrines

The campaign atlas can be opened from the in-game menu; the website now opens on the main menu. **The Shattered Paths** is a dedicated campaign atlas with its own illustrated-map presentation. Select any available shrine, review its mechanics, and enter it. Main-route convergence requires all three incoming branches to be completed. Optional Orbit Vault secret challenges branch off the rotation tutorial and do not block campaign progress.

Campaign nodes, map positions, mechanics tags, and prerequisite links are authored in `src/campaign.ts`. Progress and best move counts are saved separately in browser local storage. New secret rotation levels live in `levels/orbit-vault-01.json` and `levels/orbit-vault-02.json`.

Drag a valid level JSON file onto the game window to load it as a custom session, or use **Custom levels** on the campaign map. The level selector is a scrollable hex grid, and completed level IDs/names are saved locally so completion marks are shared across campaigns. Custom levels do not affect campaign unlocks. Use **Campaign Map** in the in-game menu or the completion dialog to return to the atlas.

The campaign graph and secret levels are a first framework pass. Dedicated teaching levels for dragging, springs, teleporters, and gates remain planned content. See `PROJECT_STATUS.md` for verification limits and the next work items.


## Batch 19: The Cartographer's Trials

A second campaign is now available from the campaign atlas selector: **The Cartographer's Trials**. It contains 18 nodes, including a prologue, three mechanic branches, an all-branches-required convergence, synthesis puzzles, a finale, and two optional secret shrines. The original **The Shattered Paths** campaign remains available with its own independent progress.

Sixteen new JSON levels were added for movement, rotation, heavy blocks, multi-block assemblies, switches and gates, lasers and receivers, teleporters, lifts, conveyors, fragile floors, and combination challenges. New level metadata credits `ChatGPT (OpenAI) · Campaign Design`. Bundled JSON levels are discovered automatically, so adding a level file no longer requires editing a static import map.

See `BATCH19.md`, `CAMPAIGN_AUTHORING.md`, and `PROJECT_STATUS.md` for the campaign layout, content inventory, authoring instructions, verification results, and playtest priorities.

## Batch 20: The Frontier Mechanisms

The third campaign adds twelve levels combining key-gated passages, mirror/receiver routing, heavy-only plates, AND-gates, enabled lifts, portals with attached assemblies, conveyors, fragile assemblies, spike detours, switch bridges, and a multi-mechanic finale. See `BATCH20.md` and `CAMPAIGN_AUTHORING.md` for content details.

## Batch 21: Browser-local progress controls

Campaign completion and best-move counts persist in browser `localStorage`, independently for each campaign. The campaign screen now includes **Clear progress**, which asks for confirmation and resets saved progress across all campaigns. It does not remove custom level JSON files. Because the project has not been released, the legacy save migration path was removed. See `BATCH21.md` for details and verification limitations.



## Batch 22: Sekiei interface polish

The site opens to the main menu. The level dropdown is replaced by a scrollable, responsive hex-grid selector, with completed-level marks saved in browser `localStorage` and shared across campaigns. The game menu now contains fullscreen, editor, replay import, music import, help, credits, and close controls. Music defaults to on and transitions between `/music/menu/1.mp3` and the selected biome track; place the menu soundtrack at `public/music/menu/1.mp3`.

The in-game HUD now places objectives beneath Now Playing, removes the oversized controls/field-notes bar and camera hint, and increases text sizes. WASD destination hints are rounded and translucent. Mechanism connection paths are shown during gameplay with directional animated dashes. The completion dialog fades in, the campaign map uses the brand icon, and the Two Plates, One Lift gloves pickup has been moved to `(-1, -1, 0)`.
