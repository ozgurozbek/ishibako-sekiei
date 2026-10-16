# Batch 3 change log

- Added glued rigid assemblies through shared `assemblyId` values. Attaching a member attaches all members; translation and rotation operate on the group.
- Updated gravity so glued blocks drop by the same vertical distance or fall together into the void.
- Added deterministic axial laser tracing, mirror reflection, receiver hit detection, beam visualization, and blocked movement into traced laser cells.
- Added linked-lift routing. Stand on a lift and press F to transfer to the linked lift; a successful transfer consumes one walking move and validates the destination for the player and attached group.
- Expanded the level editor with object tools for laser emitters, mirrors, receivers, plus an elevation field for editing alternate height layers.
- Added a local music file picker with looping playback and separate SFX controls. The soundtrack file has not been bundled because it was not attached to this conversation.
- Added `levels/mechanics-lab.json`, a multi-elevation sandbox featuring a glued block pair, a mirror/laser/receiver route, and paired lifts.
- Added mechanic-focused automated tests and updated the README.

## Verification

- `npm test`: 10 tests passed.
- TypeScript source syntax checks passed using Node's TypeScript stripping.
- Both included level JSON files passed the project level validator.
- `npm install` timed out in the environment, so a full Vite production build and browser runtime test could not be completed here.
