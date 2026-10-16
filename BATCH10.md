# Batch 10: editor UX, bundled levels and play controls

## Included

- Full-screen toggle for the game shell.
- Bundled level selector with Blank Canvas, First Steps, First Light, Gap Garden, Two Plates, One Lift, Mechanics Lab, The Clockwork Garden: Grand Run, and the original example level. JSON import/export remains available.
- Blank Canvas is a single-hex starting point with a spawn and exit, intended as an entry point for authoring.
- Editor is docked inside the game stage on desktop, with its own scroll area, so controls remain visible without scrolling the whole page.
- Hex-neighbour placement direction selector offers all six axial directions instead of always adding east.
- WASD destination badges are projected over the actual target hexes and update as the camera rotates. Blocked destinations use a warning appearance.
- Appearance controls persist in JSON: tile top colour, fog colour, and light X/Y/Z position. Reset returns to biome defaults.
- Removed floating text labels from the player, lifts, bridges, portals and glued blocks. Shape, glow and geometry communicate state instead.
- Added resonance shard collectibles, with a shard counter and collection sound; these have no puzzle objective impact.
- Gap Garden includes a visible void under its retractable bridge. An open bridge is allowed to occupy and span a void cell.

## Validation

Run `npm test` to execute the project tests. The production build could not be checked in this environment because npm dependency installation timed out. Source syntax was checked using Node's TypeScript stripping parser.
