# Batch 13: Editor completion

## Changes
- Added a searchable-by-scanning object browser list showing each placed object's ID, type, and elevation. Selecting an entry moves the camera target to that object.
- Added Raise selected / Lower selected controls. These move the selected object one elevation step only when a board cell exists at the target height.
- Added a Validate level button and navigable validation issue buttons. Issues that identify an object let the user focus it in the scene.
- Fixed undo/redo restoration to refresh the JSON editor, object list, connection cards, and property inspector alongside the rendered level.
- Added `MECHANICS.md`, a reference for current mechanics, controls, configuration fields, and explicitly unimplemented/reserved behaviours.

## Verification
- `npm test`: 36 tests passed, 0 failed.
- The archive includes all project source, levels, existing tests, and the mechanics reference.
- A production TypeScript/Vite build was not run because dependencies are not installed in this workspace. Browser interaction tests were not run.
