# Batch 25: UI and connection-flow refinement

- Removed the old shell fullscreen sizing assumptions. The menu button now requests fullscreen on the document root, and the shell/canvas use viewport-sized flex layout so fullscreen does not preserve page padding or leave unused space.
- Restyled How to Play and Credits as centered modal screens consistent with the Level Library rather than raw full-screen text panels.
- Removed accidental top-edge borders/outlines and normalized root viewport sizing to address the black line at the top.
- Mechanism connections are hidden during ordinary play until the player hovers a connected object. Hovering either endpoint reveals its connected edges. In the level editor, all connections remain visible.
- Increased connection tubes and dash spacing/weight, and increased dash animation speed to make flow more legible.
- Explicitly close the editor when starting a level or entering a campaign node.

Validation in this workspace is limited to source checks and automated tests; a live browser visual check is still recommended for fullscreen behavior across browsers.
