# Ishibako: Sekiei mechanics reference

This guide describes the mechanics currently represented in Batch 17. Some behaviours depend on level JSON properties and connections, so a level can configure a mechanic differently from another level.

## Player movement and puzzle rules

- **Hex movement:** WASD or the arrow keys move one neighbouring hex. Directions are camera-relative, so rotating the camera changes which world direction each key selects.
- **Walking move limit:** A successful walk spends one move. The level can disable the limit with `rules.moveLimitEnabled: false`. A blocked move does not spend a move.
- **Free rotation:** Q and E rotate attached blocks around the player by one 60-degree step. Rotation does not spend a walking move. Heavy blocks cannot rotate until the player collects a belt pickup.
- **Attach and detach blocks:** Click a block to attach or detach it. The player must be adjacent to the block on the same elevation to attach it. Attached blocks move with the player and must fit through the destination without colliding with walls, closed gates, other solid blocks, or missing board cells. Spikes and laser beams are hazards to the player but do not act as physical walls for blocks.
- **Gloves pickup:** Existing `key` objects are presented as gloves. While one or more blocks are attached, walking is locked until the player collects the gloves. This is a global unlock for the run.
- **Undo and redo:** The in-game overlay buttons and Ctrl/Cmd+Z / Ctrl/Cmd+Y restore saved game states. In the editor, undo/redo also restores level layout and object properties.
- **Win condition:** Reach the configured goal hex after every required pressure plate, receiver, and key objective has been satisfied. Required objective IDs are listed in the level's `objectives` section.

## Blocks, tiles, and elevation

- **Movable block:** Can be attached, detached, moved, and used to press a plate. Blocks can fall under gravity.
- **Glued assembly:** Blocks with the same `assemblyId` are treated as a rigid group for movement, rotation, and gravity. They cannot overlap or pass through solid obstacles as individual pieces. Spike hazards and laser beams do not block block movement. Blocks can still interrupt a laser beam, which can change receiver activation.
- **Heavy block:** A block with `kind: "heavy"`. It can activate a pressure plate configured with `kind: "heavyOnly"`; ordinary blocks cannot activate that plate.
- **Fragile block:** A block with `kind: "fragile"`. If its group needs to fall, the fragile block and its glued group are removed rather than landing.
- **Elevation / stacked platforms:** Board cells and objects have a height `h`. Separate hexes can share q/r coordinates at different elevations. Gravity resolves unsupported blocks downward to a valid supported landing or removes them if no landing exists.
- **Fragile floor:** A board cell with `kind: "fragile"` becomes a void after the player leaves it. It no longer supports objects.
- **Void / unsupported tile:** A cell marked `kind: "void"` or `support: false` does not provide support. Blocks on unsupported cells are resolved by gravity.
- **Wall tile / wall object:** Wall cells are impassable floor geometry. Wall objects are solid blockers for movement, attached assemblies, gravity, and laser beams.
- **Ice tile:** The level schema accepts `kind: "ice"`, but dedicated sliding behaviour is not implemented in the current build. Treat it as a reserved tile type for now.

## Objectives and collectibles

- **Pressure plate:** Activates when a block occupies the same hex and elevation. A `heavyOnly` plate requires a heavy block. Plates can drive gates, bridges, and lifts through connections.
- **Exit / goal:** The destination hex. It only completes the level when all required objective IDs are satisfied.
- **Gloves pickup (`type: "key"`):** Collected when the player walks onto its hex. It unlocks walking while blocks are attached and preserves compatibility with existing level JSON and required-key objectives. The pickup is rendered as gloves rather than a key.
- **Resonance shard:** Collected by walking onto its hex. It increments the shard counter and provides a separate collectible goal; shards are not currently part of the default win condition unless level logic is extended.

## Gates, bridges, lifts, and switches

- **Gate:** A solid barrier while closed. It can be linked to a pressure plate, laser receiver, gloves pickup, or switch. It opens when its configured source condition is active. `linkedToAll` makes every listed source required; otherwise `linkedTo` specifies a single source. A gate can also require collected gloves, configured with the legacy `requiresKey` JSON property.
- **Bridge:** A traversable connection over a gap when open. It can be linked to a plate, receiver, gloves pickup, or switch using the same single-source or all-sources connection rules. A bridge with `kind: "normallyOpen"` is treated as open by the linked-mechanism logic when it has no link.
- **Lift:** Paired lift objects move the player between their two elevations/positions when the player stands on one and presses F. The transfer costs one move and carries attached blocks if the full destination assembly fits. `enabledBy` can require a plate, receiver, switch, or gloves pickup to be active first.
- **Toggle switch:** Walking onto a switch toggles its active state. It can be used as a source for connected gates, bridges, or lifts.
- **Teleporter:** Paired teleporters transfer the player and attached blocks to the linked portal, preserving the relative offset and elevation difference. The destination must be valid and unblocked.
- **Conveyor:** When the player ends a move on a conveyor, it attempts to push the player and attached blocks one hex in its configured `direction` (0 to 5). The push only occurs if the destination positions are valid and safe.

## Lasers and hazards

- **Laser emitter:** Projects a beam in one of six hex directions. The beam stops at missing/void cells or solid blockers. Its direction is set by `direction` (0 to 5).
- **Mirror:** Redirects an incoming laser according to its orientation. Mirrors can be rotated in the editor. Beam tracing is bounded and stops if it detects a repeated ray state.
- **Laser receiver:** Becomes active when a traced laser reaches its hex. Receiver state is recomputed from laser paths and may control connected mechanisms. Feedback loops that fail to settle resolve to all receivers inactive.
- **Spike hazard:** A spike hex is hazardous to the player only. The player cannot move onto it, but attached blocks may pass through it or occupy it if no solid collision prevents placement.
- **Collision rules:** Closed gates, walls, solid blocks, and missing cells can prevent movement or assembly placement. Active laser beams and spikes block the player only; neither is a solid collision for blocks. Gravity checks for solid blockers while blocks fall.

## Level editor

- **Placement tools:** Add cells, erase cells, move the player spawn, and place supported object types on an existing board tile.
- **Elevation:** The elevation field controls the height for placement and neighbour-cell creation. The Raise selected / Lower selected actions move the selected object by one height step only if a board cell exists at that height under its current q/r coordinate.
- **Object browser:** Select an object by ID and type from the editor panel; selection also moves the camera target to that object.
- **Drag to reposition:** Drag an object on the scene to move it to a different existing cell. Solid-object overlap is checked.
- **Elevation grid:** The editor overlays a hex grid at the selected elevation; hovering shows axial coordinates `(q, r, h)`. Clicking an empty grid hex with Add adjacent cell places a tile directly, while clicking an existing tile adds its chosen neighbour.
- **Visual connections:** Hovering an object shows dashed connection lines: cyan for `enabledBy`, violet for paired/single links, and amber for all-required links.
- **Properties:** Change object kind, direction, colour, assembly ID, linked source, all-required source IDs, enabled-by source, and gloves requirement (legacy `requiresKey` field).
- **Connections:** Drag source chips onto target chips. Plates, receivers, gloves, and switches can connect to gates and bridges; lifts can be paired; teleporters can be paired. Disconnect controls remove links.
- **Validation:** Validate level checks structural rules before export or applying JSON. Click a validation issue to focus its referenced object when the issue identifies one.
- **JSON import/export:** Levels use JSON for board cells, objects, rules, environment, and objectives. Import a file, apply the JSON to load it, then export the current level as a JSON file.
- **Appearance and biome:** The editor can change biome, tile colour, fog colour, and light direction. Procedural scenery is separate from the puzzle collision board.
- **JSON synchronisation:** Valid textarea edits apply on blur or Ctrl/Cmd+Enter; scene edits write back to the JSON editor.
- **Run isolation:** Opening the editor resets to the saved level snapshot and pauses gameplay, so collected pickups and the live player position are not saved as level data.
- **Completion stats:** The win popup shows collected collectibles out of the total, moves used, and moves remaining or infinity.

## Presentation and replay

- **Procedural environments:** Biome selection changes the scenery palette, procedural background, fog, and environment generation. Available themes include meadow, hills, temple, lava lake, snow mountain, medieval castle, small village, and witch hut.
- **Biome music:** The music catalog selects a track from the level's biome folder when music files are supplied. Users can also load a local audio file for the current session.
- **Sound effects:** Sound can be toggled in the header. Movement, blocked actions, pickups, switches, lifts, and completion use short synthesized effects where implemented.
- **Run recording and replay:** Completed runs can be exported as JSON recordings. The replay viewer can load a recording, play/pause, step through frames, and seek along its timeline.
- **Fullscreen and camera:** Fullscreen is available from the in-game menu. Drag to orbit the camera and scroll to zoom.

## Controls quick reference

| Input | Action |
|---|---|
| WASD / arrow keys | Move one camera-relative hex |
| Click a block | Attach / detach (in play mode) |
| Q / E | Rotate attached blocks counter-clockwise / clockwise |
| F | Use a paired lift while standing on it |
| Space | Detach all attached blocks |
| Drag source chip to target chip | Connect mechanisms (editor) |
| Drag a scene object to another tile | Move an object (editor) |
| R | Rotate selected laser / mirror (editor) |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Y | Redo |
