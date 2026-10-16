# Batch 21: Browser-local progress controls

Campaign progress is stored in browser `localStorage`, separately for each campaign. Added a **Clear progress** control to the campaign screen footer. It asks for confirmation, clears saved completion and best-move data for all campaigns, resets the current in-memory campaign state, and refreshes the map. The control does not delete custom level files or imported JSON.

Removed the legacy-save migration path because this project has not been released and does not need compatibility with earlier save formats.

## Verification

Automated tests cover the existing campaign graph and level suite. The UI reset action is a small browser interaction and still needs a live browser check alongside the rest of the project. Production build status is unchanged: install dependencies and run `npm run build` in a network-enabled environment before release.
