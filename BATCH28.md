# Sekiei Batch 28

## CSS rewrite
- Rewrote `src/style.css` into a consistently formatted, readable stylesheet rather than leaving the prior minified blocks and final override patch.
- Removed the Batch 27 append-only override block and established a final shared layout contract with CSS custom properties for the in-game edge gutter and level panel width.
- Top bar has zero padding and no bottom border; brand background is transparent; HUD top offset is 5rem; in-game overlays use a 10px screen-edge gutter.
- The level information panel and Now Playing panel now share the same declared width.

## Hover connection visibility
- Increased the thickness and opacity of connection tubes, dashed flow lines, and arrowheads.
- Set the connection visuals to render above scene geometry with depth testing and depth writing disabled.
- Corrected hover routing so editor mode shows all connections while normal play mode scopes connections to the hovered object.

## Validation
- ZIP integrity checked after packaging.
- No live browser session was available, so hover visibility and responsive layout still require in-browser confirmation.
