# Batch 17 — Full-window game UI and editor interaction

**Version:** 0.9.0
**Date:** 15 October 2026

## Included changes

### Game presentation
- The Three.js stage now fills the entire window. The toolbar, HUD, level context, objectives, controls, field notes, editor, replay controls, menu, and completion dialog are layered over the game instead of being laid out as website sections.
- Removed the visible site footer and compacted the branding into an in-game corner mark.
- Added a start menu with level selection, How to Play, and Credits panels. The menu remains in the same game surface, not a new tab.
- Kept fullscreen, restart, level selection, editor, replay, audio, undo, and redo available through the in-game toolbar.

### Editor usability and state safety
- Added an elevation-specific hex grid and hover readout for axial `(q, r, h)` coordinates.
- The Add adjacent cell tool can add a tile directly when an empty grid hex is clicked; clicking an existing tile creates the selected neighbour.
- Scene objects and the player spawn can be dragged onto existing cells. Solid objects cannot be dragged onto another solid object. Camera orbit is disabled while dragging an object.
- Hovering an object in the editor draws dashed connections. Cyan means `enabledBy`, violet means `linkedTo`/pair links, and amber means an all-required `linkedToAll` relationship.
- Valid JSON textarea edits apply on blur; Ctrl/Cmd+Enter explicitly applies JSON. Scene edits refresh the JSON text.
- Opening the editor resets the live run to the saved level snapshot and blocks gameplay input. Closing the editor restarts from the edited snapshot, preventing collected pickups or player movement from accidentally becoming the saved level state.

### Pickups and puzzle rules
- Existing `type: "key"` objects now render as gloves and unlock walking while carrying attached blocks. This preserves existing JSON and required-key objective compatibility.
- Added `type: "belt"` pickups. A belt unlocks rotation when the attached assembly contains a heavy block; without a belt, the rotation is rejected.
- Added a belt pickup to Advanced Mechanics Lab so the rule can be explored in a bundled level.
- Added optional 2D manifest slots for menu logo/background, level-card background, button texture, and gloves/belt/shard HUD icons.
- Added distinct synthesized sound cues for gloves and belt collection, alongside the existing movement and mechanism cues.
- Open bridge hexes now remain visible in camera-relative movement previews.
- Completion dialog now shows collected collectibles out of the level's total collectible count, moves used, and moves remaining or infinity.

## Files of note
- `PROJECT_STATUS.md`: complete current feature inventory and remaining-work list.
- `MECHANICS.md`: updated rules for gloves, belts, editor coordinates and visual links.
- `ASSET_PIPELINE.md`: asset setup workflow.
- `public/assets/2d/manifest.json`: expanded optional UI-art slots.
- `src/main.ts`, `src/assets.ts`, `src/types.ts`, `src/level.ts`: runtime changes.

## Verification
- `npm test`: **46 passed, 0 failed**.
- All level JSON files and both asset manifests parse successfully.
- TypeScript transpile-only syntax check passes for changed TypeScript modules.
- Full `tsc -b` / Vite production build remains unverified because dependency installation timed out and `three` plus `vite/client` types are unavailable in this workspace.
- Browser interaction testing was not performed. In particular, the new object-drag and full-window overlay flows should be playtested locally before treating the batch as release-ready.

## Remaining priorities
1. Install dependencies in a network-enabled environment and complete `npm run build`.
2. Browser-test all toolbar/menu states and full-window sizing at desktop and mobile sizes.
3. Test editor drag/drop, elevation grid placement, connection overlays, undo/redo, JSON sync, and level switching with unsaved edits.
4. Test gloves/belt collection, heavy-block rotation denial/allowance, and collectible/move statistics on completion.
5. Validate optional GLB/GLTF and 2D assets against the actual Unity/modeller asset library.
6. Complete gameplay/replay regressions, then continue campaign expansion, visual effects, and release documentation.
