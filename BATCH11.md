# Batch 11: simulation, authoring and replay

## Rigid placement and gravity
- Added a shared assembly-placement validator for moves, rotations and lift transfers.
- Candidate rigid groups are checked as a transaction against the board and external solids. Declared void cells are valid transient positions for blocks so gravity can resolve them immediately after an action.
- Gravity now considers other solid objects along fall paths and at landing cells, and treats glued groups as rigid units. Assemblies with no common supported landing are removed together.
- Fragile blocks break when they become unsupported and begin to fall.

## New mechanics
- Heavy blocks have a distinct visual treatment and activate heavy-only pressure plates.
- Spike hazards are placeable from the level editor and prevent movement into their cells.
- Added `Advanced Mechanics Lab`, a bundled level featuring a key, heavy block, heavy-only plate, gate, spike hazard and fragile block above a gap.

## Editor
- Added a selected-object property inspector for kind, direction, colour, assembly ID, `linkedTo`, `linkedToAll`, `enabledBy`, and key requirements.
- Added disconnect controls to connection targets and a Disconnect links action for the selected object. Disconnecting a source also removes its inbound references and clears reciprocal lift/teleporter pairs.
- Property and connection changes update the restart baseline.

## Replay viewer
- Added Open replay to import a run-recording JSON file.
- Replay playback supports play/pause, previous/next frame, timeline seeking, and exit.
- Playback restores the recorded level and each frame's player, object, attachment and counter state.
- Added recording schema validation and tests for malformed input and frame bounds.

## Verification
- 31 automated tests pass.
- Core simulation, mechanics, level and replay modules pass strict TypeScript checking.
- The main browser entry passes Node's TypeScript syntax check.
- Full Vite build and browser rendering remain unverified because dependency installation timed out in this environment.
