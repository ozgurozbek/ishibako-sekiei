# Batch 4

## Implemented

- Deterministic biome soundtrack selection based on level seed modulo three.
- Convention-based audio paths: `public/music/<biome>/1.mp3`, `2.mp3`, and `3.mp3`.
- Optional `environment.musicFolder` to map a visual biome to a differently named audio folder.
- Loading a new level selects its biome track; choosing a local file overrides the track for the current session until a level is loaded.
- Laser receivers now have a live active state, visual feedback, and can be required level objectives through `objectives.requiredReceiverIds`.
- Gates and bridges may link to a pressure plate or a lit receiver.
- Mechanics Lab now requires its mirror/laser receiver to be lit before the exit can complete the puzzle.
- Added tests for stable seed-based music selection, negative seeds, custom music folders, and receiver-linked gates.

## Audio assets

No actual soundtrack files were present in the project directory during packaging. The folder layout and selection logic are ready for the user's three numbered tracks per biome. Add those audio files under `public/music/<biome>/`.

## Verification

- `npm test`: 14 tests passed.
- `npm run build`: could not complete because dependencies are not installed in this environment; TypeScript reported missing `three` and `OrbitControls` module declarations before a full build could run.
