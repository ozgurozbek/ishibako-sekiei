# Batch 7: Hex controls, editor wiring, collectibles and world presentation

## Editor usability
- Added a visual Quick connections area. Drag a pressure plate, laser receiver or key chip onto a gate or bridge to set `linkedTo`.
- Drag one lift chip onto another lift to link the pair in both directions.
- Click an object in the 3D scene while the editor is open to select it. The selection note shows its ID, type, coordinate, elevation and direction.
- Rotate the selected laser emitter or mirror with the editor button or press `R`. Laser emitter meshes now point in their configured direction.
- Added a collectible key placement tool.
- Gate visuals are now portal-like frames with posts, a lintel and a closed panel rather than a single solid cylinder.

## Hex controls and movement rules
- WASD and arrow keys now choose the nearest hex direction in screen space relative to the current camera. The HUD shows the current mapping and updates when the camera rotates.
- Attaching a block anchors the player. Walking is disabled until the player collects a key. After collecting one, movement while attached is enabled.
- Collected keys are persistent level-state collectibles, increment the HUD counter, and can open gates/bridges connected to their key ID.
- Restart and undo/redo restore key collection state.

## Environment
- Replaced the single circular ground plane with a large seeded field of hexagonal terrain tiles with varied height, color and sparse decorative objects.
- Terrain hexes use instanced rendering to avoid thousands of individual draw calls.
- Expanded fog distance and camera zoom limits to make the surrounding world feel much larger.
- Existing biome silhouettes remain at a greater distance from the puzzle board.

## New showcase level
`levels/mechanics-showcase.json` is a larger course containing glued blocks, a key, a key-linked gate, a pressure-plate gate, a pressure plate, a receiver-linked bridge, a laser, a mirror, a receiver, paired lifts, a wall and an elevated exit. The plate and receiver begin activated so the main route stays clear for a first playthrough. Collect the key, reach `lift-low`, press `F`, then walk to `exit-high`.

## Controls
- WASD / arrow keys: move in camera-relative screen directions
- Click a block: attach or detach during gameplay
- Q / E: rotate attached blocks, free
- F: use a linked lift
- Space: detach all blocks
- In editor mode, click a laser/mirror then use `Rotate selected laser / mirror` or `R`
- Drag a source chip to a target chip to connect mechanisms

## Verification
- 19 automated tests pass, including a new test for key-linked gate activation.
- `node --experimental-strip-types --check src/main.ts` passes.
- Both showcase and example JSON files parse successfully.
- All shipped level JSON files pass the game validator. A full TypeScript/Vite build could not be completed in this environment because npm dependency installation timed out. Install dependencies locally and run `npm test` and `npm run build`.
