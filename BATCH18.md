# Batch 18: Campaign Atlas

## Included

- Dedicated full-window campaign atlas with a different art direction from the playable 3D levels: illustrated landmass, sea, route lines, region labels, shrine nodes, locked/available/completed states, and a side detail card.
- Data-driven graph in `src/campaign.ts`; node coordinates are hand-authored separately from prerequisites. Branch lengths can vary and convergence nodes can require every upstream route.
- Campaign appears on launch and can be opened from the in-game menu or completion result. Select any unlocked node, including completed nodes for replay.
- Browser-local campaign progress and best move counts are independent of level JSON.
- Optional secret Orbit Vault levels introduce two-block and three-block rotation puzzles. They do not block the main campaign route.
- JSON drag-and-drop into the game window, plus import action on the atlas. Imported custom levels are isolated from campaign progression; replay-recording JSON is rejected with a hint to use the replay viewer.
- Tests for graph progression, branch convergence, secret route behaviour, progress/best-move persistence, and campaign node file references.

## Verification

- `npm test`: 52 tests passed, 0 failed.
- JSON parse and level validation cover the new Orbit Vault levels.
- TypeScript transpile syntax check passes for source and test files.
- Full TypeScript/Vite build and browser interaction checks remain unverified because `three` and Vite dependencies are not installed in this workspace.

## Follow-up

- Run a real build and desktop/mobile browser pass.
- Playtest Orbit Vault puzzles and tune hints after hands-on testing.
- Author dedicated dragging, springs, teleporter, and gate tutorial branches.
- Add pan/zoom controls only if playtesting shows the map needs them.
