# Batch 15: Level progression and catalogue polish

## Added
- Level information strip displays the selected level's title, description, difficulty, and mechanic tags.
- Optional authored hints and solution walkthroughs are available in a compact disclosure panel.
- The level selector now includes difficulty labels where the level metadata provides them.
- Added **Plate Practice**, a guided puzzle introducing key collection, block attachment, pressure plates, detaching, and the exit.
- Added **Fragile Footing**, a short puzzle demonstrating a tile that collapses after the player leaves it.
- Extended level metadata with optional `difficulty`, `mechanics`, `hint`, and `solution` fields. Older level files remain valid.

## Asset review
- Existing visuals are generated from procedural Three.js geometry and shared toon materials. No external 3D model or texture assets are required to run the project.
- The current low-poly style is cohesive. A later art pass could improve silhouette variety, mechanism animation, material accents, and biome-specific landmarks without replacing the current models.
- External model import is intentionally not part of this batch. `ART_ASSET_REVIEW.md` records a proposed folder and normalization workflow so downloaded GLB/glTF assets can be added without manual code edits or user-managed scaling.

## Verification
- `npm test`: 40 tests passed.
- Level validation includes both new tutorial levels.
- Production build and interactive browser regression were not run because dependencies are not installed in this workspace.
