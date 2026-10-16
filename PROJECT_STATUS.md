# Ishibako: Sekiei — Complete Project Status

**Status snapshot:** Batch 19, 15 October 2026  
**Purpose:** One reference for the implemented app, known limitations, verification status, asset conventions, and remaining release work.

This report describes the current source tree and its tests. “Implemented” means a code path exists; it does not imply every edge case has been browser-tested. The project has not yet passed a complete production build or end-to-end browser regression in this workspace because package installation timed out and the Three.js/Vite dependencies were unavailable.

## Executive summary

The project is a playable, single-player browser prototype for a small 3D hex-grid puzzle game. It has a JSON level format, a visual level editor, a suite of puzzle mechanisms, multiple procedural biomes, level selection, run recording/replay, and automated tests. Batch 16 expanded the distant terrain and biome props and established optional manifest-driven asset slots. Batch 17 moves the app to a full-window game presentation and improves editor object manipulation, elevation-aware placement, connection visualisation, state isolation, pickup rules, and completion stats. Batch 18 adds the illustrated campaign atlas. Batch 19 adds a second full campaign, sixteen new level files, campaign-specific progress, and automatic discovery of bundled level JSON.

The highest-priority outstanding work is verification of the complete application, not a new architecture: install dependencies, run the production build, launch in a browser, then systematically test gameplay, editor, replay, audio, fullscreen, and custom asset loading.

## Feature inventory

### Core gameplay — implemented, regression work ongoing

- Six-direction axial hex grid and camera-relative WASD/arrow movement.
- Player spawn, walk move counter, configurable move limit, restart, undo and redo.
- Click-to-attach and detach blocks; glued assemblies share an `assemblyId` and move as a rigid group.
- Q/E rotations in 60-degree steps; rotations do not consume walking moves.
- Gloves-gated movement while blocks are attached (legacy JSON `type: "key"` remains compatible).
- Belt pickup gates rotation of attached heavy blocks; ordinary blocks remain freely rotatable.
- Gravity for unsupported blocks, falling to supported lower cells, falling away into voids, and glued-group gravity.
- Collision checks for walls, closed gates, blocks, destination cells, elevation, and assembly placement.
- Spike and active-laser hazards block the player. Spikes and laser beams do not make attached blocks physically impassable. A block may still intercept a laser beam and alter receiver activation.
- Fragile floor cells collapse when the player leaves; fragile blocks break when unsupported and falling.
- Heavy blocks and heavy-only plates.
- Player/object position easing and camera orbit/zoom controls.

### Mechanisms and objectives — implemented with known edge-case limits

- Pressure plates, including heavy-only activation.
- Gates and bridges connected to plates, keys, switches, and laser receivers.
- `linkedToAll` multi-source requirements and lift `enabledBy` activation.
- Paired lifts activated with F; transfer costs one move and can carry attached blocks when placement is valid.
- Laser emitters, six-direction beam tracing, mirrors, and laser receivers.
- Keys, resonance shards, goal/exit, and optional required key/receiver objectives.
- Toggle switches, conveyors, paired teleporters, fragile cells, walls, and void/support-false cells.
- Deterministic receiver/mechanism settling with fail-closed handling for feedback that does not settle.

Known limitation: this is not yet a general-purpose logic graph engine. Some mechanism interactions and combinations require targeted tests. Lift and teleporter effects are mostly discrete transfers rather than complete bespoke animations.

### Level authoring — implemented, usability refinements remain

- JSON import, export, apply, and validation; textarea edits apply on blur when valid, and Ctrl/Cmd+Enter applies explicitly.
- Blank Canvas starter level and bundled example/tutorial/showcase levels.
- Visual placement and removal tools, player spawn placement, elevation grid, direct empty-hex tile creation, six-direction neighbour creation, drag-to-move objects, object selection/browser, property inspector, quick connection chips, and editor undo/redo.
- Validation for duplicate IDs/cells, references, overlaps, directions, assemblies, and mechanism links.
- Level catalogue metadata for descriptions, difficulty, mechanic tags, hints, and solutions.
- Full-window game UI with in-game start/level selection, How to Play, Credits, HUD, objectives, and overlay controls; no website navbar/footer presentation.
- Hovered connections are shown as dotted colour-coded lines; hovered grid cells show `(q, r, h)`.

Remaining editor work: validate the new drag workflow in a real browser, make validation navigation cover every error type, broaden the property inspector, test unfamiliar custom JSON round trips, and add a clear prompt for discarding or preserving unsaved edits when changing levels.

### Campaign atlas and content — two data-driven campaigns

- The Shattered Paths remains the original 10-node campaign. The Cartographer's Trials adds an 18-node campaign with a prologue, three branches of three levels each, a convergence requiring all branch endpoints, two synthesis levels, a finale, and two optional secret challenges.
- Players may choose any currently unlocked node. Branches may be completed in any order; convergence prerequisites are all-required. Secret nodes never block the main route.
- The campaign selector changes the atlas title, tagline, region labels, and graph. Each campaign has an independent local-storage save and best-move record. The old v1 campaign save is migrated into The Shattered Paths if no v2 save exists.
- Sixteen new JSON levels cover movement, block rotation, heavy blocks and belt pickup, multi-block rotation, switches/gates, lasers/receivers, paired teleporters, linked lifts, conveyors, fragile floors, AND-gates, and synthesis puzzles. New level files are credited to ChatGPT (OpenAI) · Campaign Design.
- Bundled levels are discovered through Vite's JSON glob import, so a new level file can be added without a corresponding static import or hard-coded object-map entry.
- `CAMPAIGN_AUTHORING.md` documents adding campaigns, nodes, levels, prerequisites, map coordinates, and save compatibility.

The authored hints/solutions are proposed walkthroughs and should be confirmed through hands-on browser playtesting. Several combination levels require particular attention during the first manual pass.

### Run recording and replay — implemented, determinism verification remains

- Completed runs can be exported as JSON with a level snapshot and action/state frames.
- Replay import validates the recording format/version and basic frame structure.
- Replay viewer supports play/pause, step backward/forward, seek, and selected state inspection.

Remaining replay work: browser tests across longer runs, backward compatibility policy for future format versions, and explicit export/re-import tests proving the same final state is reached.

### Visual presentation — implemented with refinement opportunities

- Three.js rendering, pastel toon/gradient-ramp lighting, player face, hex tile facets, block highlights, attachment tethers, glued-assembly connectors, and mechanism state cues.
- Eight biome themes: meadow, hills, temple, lava lake, snow mountain, medieval castle, small village, and witch hut.
- Deterministic decorative terrain seeded by the environment configuration; terrain remains separate from gameplay collision.
- Fog, themed skies, distant silhouettes, landmark structures, flowers/motes, editable tile/fog colours, and adjustable light direction.
- Fullscreen control, level selector, move previews, tooltips, and HUD/objective status.

This pass makes the distant field wider, adds deterministic terrain undulation and stronger biome-specific ridge profiles, adds more distinct low-poly props for all biomes, and keeps the decorative world non-colliding. The environment generator is still a procedural art pass, not a hand-authored environment library. Performance must be profiled on representative lower-end hardware.

### Audio — implemented, asset content is supplied separately

- Biome music catalogue scanner discovers audio files in `public/music/<biome>/` and supports variable track counts/formats.
- Deterministic per-level music selection from the available tracks; user can load local music and toggle playback.
- Synthesized SFX are generated by Web Audio, not external sound files. This pass adds distinct layered cues for walking, blocked actions, attachment, rotation, collecting keys/shards, switches, lifts, teleporters, and success.
- No music tracks are bundled in this workspace. Place owned/licensed tracks in the biome folders and allow the music scanner to regenerate `public/music/catalog.json`.

Remaining audio work: browser checks for autoplay restrictions, volume control, SFX mixing, and music transitions; add dedicated authored SFX assets if desired.

### Asset integration — first pass implemented; user asset library not yet supplied here

- `public/assets/manifest.json` controls optional GLB/GLTF replacement models.
- The runtime clones model geometry/materials, fits a configured target height and footprint, centres the X/Z position, aligns the model to the tile surface, and falls back to procedural geometry if loading fails.
- Static visual overrides can be configured for supported object types. Stateful mechanisms keep procedural visuals by default so their open/closed/active state remains readable. Replacing stateful visuals requires explicit `replaceStateVisuals: true` and a model that communicates the states appropriately.
- `public/assets/2d/manifest.json` supports favicon, brand mark, stage background, and panel texture paths. Starter SVGs are included and can be replaced.
- Texture folders and workflow documentation are included. Standalone in-world texture assignment is not yet a separate runtime feature; embedded GLB/GLTF textures are the recommended route at present.

No external asset packs were included in this workspace, so the pipeline is prepared but has not been validated against the user's actual Unity exports or modeller output.

## Terrain generation pass in Batch 16

- Terrain radius now scales with the environment radius, bounded between 30 and 52 hex rings.
- Decorative height includes repeatable coordinate-based undulation plus biome-dependent ridge lift.
- Snow and hills use stronger distant elevation, while other biomes have their own more restrained profiles.
- The prop set now varies per biome: temple pillars/stone pieces, snow pines and icy rocks, castle battlements and spires, lava spires/obsidian rocks, witch-hut mushrooms and dark growth, village lantern posts/rocks, and meadow/hill shrubs and stones.
- Terrain placement remains seeded and is not part of puzzle collision.
- New pure-function tests cover terrain radius bounds, deterministic height, and relative ridge profiles.

## Batch 17 interaction and UI pass

- The canvas now occupies the full window; toolbar, HUD, level context, objective panel, controls, editor, and completion dialog are overlays inside the game experience. The former website footer is hidden.
- Added an in-game start/level selection screen, How to Play panel, Credits panel, and in-game menu button.
- Editor open state resets to the saved level snapshot and blocks gameplay input, preventing collected pickups or moved player state from leaking into the level JSON.
- Added elevation-aligned hex grid overlays and hover coordinate readouts. The Add adjacent cell tool also creates a tile directly when clicking an empty grid hex.
- Added drag-to-move for player spawn and placed objects, with solid-object overlap checks and camera orbit disabled during object dragging.
- Added hover-only dotted connection lines: cyan for enabled-by links, violet for single/pair links, amber for all-required links.
- Legacy `key` collectibles now render as gloves and unlock movement while carrying. New `belt` collectibles unlock rotation of attached heavy blocks. Existing level JSON remains compatible.
- Open bridge destinations now retain the WASD direction previews. Completion dialog reports collectibles collected out of total and remaining moves (including unlimited).
- JSON edits apply on blur when valid; Ctrl/Cmd+Enter applies manually. Scene edits update the JSON text.

## Automated tests and build status

Latest run in this workspace: **55 automated tests passed, 0 failed** (`npm test`). Tests cover audio selection, level validation, tutorial metadata, mechanics/laser/receiver behaviour, gravity and assemblies, hazard collision rules, replay parsing, and the new terrain profile functions.

A full TypeScript/Vite build could not be verified. `npm install` timed out; a global TypeScript check confirms the missing `three`, `vite/client`, and related declarations prevent meaningful compilation here. No claim is made that browser interactions or production bundling passed.

## Remaining work, prioritised

### P0 — Establish a verified build

1. Install project dependencies in a network-enabled workspace.
2. Run `npm test`, `npm run build`, and fix all genuine type/build errors. Batch 17 source parses successfully with TypeScript transpilation, but a full type-check/build is still blocked by missing installed dependencies.
3. Launch the production preview and test startup with no custom assets and with missing optional manifests.
4. Test current supported desktop browsers and at least one narrow/mobile viewport.

### P1 — Gameplay and state regression

1. Create integration fixtures for multi-elevation assemblies, fall paths, closed gates, lifts, teleporters, conveyors, spikes, and lasers.
2. Verify spike/laser player-only hazard semantics in movement, rotation, lift, teleporter, and conveyor flows.
3. Test receiver/gate feedback loops and mechanism order after gravity.
4. Test restart/undo/redo for keys, shards, fragile floors, attached blocks, and mechanism states.

### P1 — Editor and replay

1. Round-trip every bundled level through JSON export/import.
2. Make validation errors focus the relevant object/cell whenever possible.
3. Verify visual links, editor history, elevation controls, and playtest return flows in-browser.
4. Export, import, seek, and replay long recordings; compare final snapshots.

### P2 — Asset pipeline validation

1. Validate real `.glb` models from the Unity library, including embedded textures and multiple mesh/material hierarchies.
2. Add a small model set first: player, ordinary block, goal, and one environment prop.
3. Check scale/pivot fit, toon shading compatibility, animation clips, material colour space, memory use, and disposal on level reload.
4. Expand stateful mechanism overrides only when active/open/closed state remains visually obvious.
5. Decide whether standalone texture assignment needs a dedicated manifest or whether GLB-embedded materials are sufficient.
6. Connect further 2D art slots as actual assets are supplied (level cards, buttons, loading/brand art, and in-game icons).

### P2 — Content and presentation

1. Manually play every new Cartographer level and verify each advertised walkthrough, especially multi-source gates, elevation transfer, conveyor/fragile interactions, and the finale route.
2. Add more hand-designed levels only after the current campaign is playtested and difficulty pacing is adjusted.
3. Profile larger procedural worlds and tune terrain radius/density if necessary.
4. Add dedicated mechanism animations, collection/fall/landing effects, volume controls, and optional authored SFX.
5. Consider ice sliding, spring blocks, timed mechanisms, and more complex laser logic only after the core regression pass.

### P3 — Release packaging

1. Write player-facing controls and editor documentation, plus an asset import guide for artists.
2. Document browser support, known limitations, and level JSON schema/versioning.
3. Add a changelog/release version and a clean reproducible packaging process.
4. Verify favicon, 2D art, music files, bundled levels, and external models in the packaged output.

## Asset conventions

See `public/assets/README.md`, `public/assets/models/README.md`, and `ASSET_PIPELINE.md` for the hands-on workflow. The intended principle is that artists place files in predictable folders and edit a small JSON manifest, rather than manually scaling meshes or editing rendering code. Unity source files and unsupported shader graphs are not directly portable; export models to GLB/GLTF and bake/convert materials as needed.

## Batch history

- Batches 2–5: editor foundations, validation, deterministic mechanics, assemblies/laser/lifts, biome music selection, toon rendering and character polish.
- Batches 6–8: more biomes and procedural scenery, level mechanics, camera-relative movement, collectibles, tooltips, editor connections and rendering refinements.
- Batches 9–11: run recording/replay, additional mechanisms, level selector, full-screen, editor properties, heavy/fragile blocks, hazards, and replay viewer.
- Batch 12: simulation hardening and replay input validation.
- Batch 13: editor object browser, elevation controls, validation navigation, and editor history polish.
- Batch 14: player-only spike/laser hazard semantics, replay frame inspection, and replay validation refinements.
- Batch 15: tutorial/level metadata and catalogue polish.
- Batch 16: terrain generation and biome prop variety, synthesized SFX cues, optional 3D model and 2D art manifests.
- Batch 18: illustrated campaign atlas, prerequisite graph, optional secret rotation shrines, independent campaign progress, and JSON drag-and-drop.
- Batch 19: The Cartographer's Trials, sixteen new JSON levels, multiple campaign selection, campaign-isolated saves, automatic JSON level discovery, and campaign authoring documentation.
- Batch 17 (this pass): full-window game UI, in-game menu/help/credits, editor grid and object dragging, colour-coded hover connections, JSON/scene sync, gameplay state isolation, gloves/belt pickups, heavy-block rotation rules, bridge direction previews, and completion collectible/move stats.


## Batch 18 campaign atlas

- Added a distinct full-window campaign screen with a hand-authored illustrated map, branching paths, region labels, shrine markers, completion states, available/locked states, and a selected-level detail panel. This interface has its own visual language and does not reuse the in-level 3D diorama presentation.
- Campaign progression is data-driven in `src/campaign.ts`. Hand-authored map coordinates are independent of prerequisite logic. Nodes can have different branch lengths, multiple prerequisites at convergence points, and optional secret nodes that do not block the main route.
- Players can select any unlocked node in any order. The main synthesis level requires all three mechanic routes to be completed. Campaign completion and best move counts persist in browser local storage, separately from level JSON.
- Added two optional rotation challenge levels, `orbit-vault-01.json` and `orbit-vault-02.json`, with two-block and three-block assemblies that rotate onto multiple pressure plates. These are optional secret shrines, not prerequisites for the main route.
- The campaign appears on initial launch. Completing a campaign level updates progress before the results dialog; Campaign Map returns to the newly updated atlas. The in-game menu can also reopen it.
- Added JSON file drag-and-drop on the game window and a campaign import action. Imported levels run as custom sessions and do not unlock campaign nodes. Run recordings are rejected with guidance to use Open replay.
- Added campaign graph tests for initial unlock state, branch selection, all-prerequisite convergence, secret routes, and best-move persistence.

Latest automated suite: **52 tests passed, 0 failed**. All bundled level JSON files, including the new secret levels, pass level validation. A production TypeScript/Vite build and browser interaction pass remain outstanding because dependencies are not installed in this workspace; no claim is made that the campaign has been browser-tested.

## Batch 18 remaining work

1. Install dependencies in a network-enabled environment, run `npm run build`, and fix any genuine TypeScript or Vite issues.
2. Browser-test the campaign atlas at desktop and mobile sizes, including map panning/zooming needs, node hit targets, selected-node panel layout, and progress persistence across refreshes.
3. Playtest both Orbit Vault levels to confirm the rotation sequence and walkthroughs are understandable and solvable.
4. Verify drag-and-drop JSON import from both the campaign overlay and active gameplay, including malformed JSON and run-recording files.
5. Add more authored campaign levels for dedicated dragging, springs, teleporter, and gate teaching routes as those level designs are finalized. The current graph demonstrates branch/convergence logic using existing mechanics and levels; it is a framework, not the final campaign content count.
6. Add a small minimap or pan/zoom controls if playtesting shows that the whole map is difficult to navigate on narrow screens.

## Batch 20 update

Added The Frontier Mechanisms, a third campaign with 12 new level JSON files. New authored combinations include key-gates, laser-controlled bridges, heavy-only plates, AND-gates, signal-enabled lifts, portals with attached blocks, conveyors, fragile assemblies, spike detours, and a synthesis finale. Campaign progress remains separated by campaign ID. Automated tests cover level validation and campaign graph references; production build and live browser playtesting remain unverified.


## Batch 21 update

Added a confirmed **Clear progress** action to the campaign screen. It removes each campaign's browser-local progress record, clears cached in-memory progress, resets the active campaign, and redraws the map. Campaign saves continue to use `localStorage` with independent keys per campaign. Removed legacy save migration, as the project has not been released. This small UI change has not been browser-tested; production build and live playtesting remain outstanding.


## Batch 22 update

Rebranded the UI to **Sekiei**. Replaced the dropdown with a responsive, scrollable hex-grid level selector, added browser-local passed-level records keyed by ID/name and shared completion marks across campaigns, moved settings/tools into the main menu, and made the menu the first screen. The menu soundtrack path is `public/music/menu/1.mp3`; the audio file itself is not included in this archive and must be supplied. Music transitions fade between tracks. The game HUD now places objectives under Now Playing, removes the bottom controls/field-notes bar and camera hint, and uses larger type. WASD previews are rounded and translucent; mechanism links are always visible with directional animated flow. The completion modal fades in, the campaign logo uses the brand icon, duplicate JSON-import UI and decorative map line are removed, and `plate-and-lift.json` has its gloves pickup at `(-1, -1, 0)`.

Latest tests: **56 passed, 0 failed**. TypeScript syntax transpilation passed for all source files. A full production build and live browser interaction pass remain unverified because project dependencies are not installed in this workspace.


## Batch 23 update

Fixed the startup DOM exception caused by appending the removed bottom bar, which had prevented all subsequent event handlers from registering. Completion actions now prioritize Continue, with Download run recording secondary. See `BATCH23.md`.
