# Batch 27: CSS geometry pass

- Set the in-game HUD top offset to `5rem` at desktop and responsive breakpoints.
- Removed the topbar bottom border and reset topbar padding to zero.
- Removed the brand background, retaining its existing blur/translucent treatment where applied.
- Set the level information panel to the same 390px maximum width as the Now Playing panel, constrained to the viewport.
- Standardized in-game overlay edge spacing to 10px for the HUD, level information, toast, crosshair note, move previews, and tooltip.

The existing stylesheet contains styling for many independently developed game/editor/menu/campaign features. This batch applies a focused final geometry override rather than deleting feature-specific rules that could regress those screens. Full browser visual verification remains outstanding.
