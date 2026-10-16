# Batch 22: Sekiei interface and progression polish

- Rebranded the game to Sekiei throughout the project.
- Corrected the Two Plates, One Lift gloves pickup to (-1, -1, 0).
- Simplified the game HUD: removed direction labels and the oversized bottom controls/field-notes panel; objectives now sit under Now Playing.
- Made projected WASD hints rounded, smaller, and transparent.
- Added menu soundtrack routing to `public/music/menu/1.mp3`, with fades between menu and biome music; music defaults to on (browser autoplay policy may require an initial interaction).
- Moved fullscreen, editor, replay import, and music import into the menu. Added close-menu controls and made the menu the initial screen.
- Added a scrollable responsive hex-grid level selector, replacing the dropdown. Completed levels show a tick.
- Persisted passed level IDs/names in local storage and reflected prior clears across campaigns and the level selector.
- Made mechanism connection lines visible during normal play, with thicker dashed directional flow and animated dashes.
- Increased UI typography and slowed the completion-modal transition.
- Removed duplicate Import level JSON action and the decorative map line; replaced the campaign letter with the supplied icon.

Verification limitations: production build and live browser interaction testing are not claimed. The menu music asset itself must be supplied at `public/music/menu/1.mp3`.
