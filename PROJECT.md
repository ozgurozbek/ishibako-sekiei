# Ishibako: Sekiei — Project File

**One-page reference for the whole project: what it is, how it's built, where it stands, and what's next.**
For deep detail, see `README.md` (controls/JSON format), `MECHANICS.md` (every mechanic), `PROJECT_STATUS.md` (full batch-by-batch history and verification log), `CAMPAIGN_AUTHORING.md` (level/campaign authoring), and `ASSET_PIPELINE.md` (artist workflow).

## 1. What this is

A browser-based, single-player 3D hex-grid puzzle game, rebuilt from an original Unity concept. The player walks a hex board, attaches to one or more blocks, and pivots them 60° at a time around themselves to solve spatial puzzles — pressure plates, gates, lifts, lasers/mirrors/receivers, conveyors, teleporters, fragile floors, heavy/fragile blocks, ice, fire, and multi-elevation falls. Levels are plain JSON, loaded and validated by the same engine the in-game visual editor uses, so anything built in the editor is immediately playable and anything played is exportable as a level.

Three campaigns ship today — **The Shattered Paths** (10 nodes), **The Cartographer's Trials** (18 nodes), **The Frontier Mechanisms** (12 levels) — plus a standalone level selector, a run-recording/replay system, and 8 procedurally-decorated biome themes (meadow, hills, temple, lava lake, snow mountain, medieval castle, small village, witch hut).

## 2. Tech stack

| Layer | Choice |
|---|---|
| Language | TypeScript |
| Rendering | Three.js (toon-shaded, procedural geometry — no texture/model dependency required to run) |
| Build | Vite |
| Audio | Web Audio (synthesized SFX) + HTML5 audio for music, with a Vite plugin that auto-scans `public/music/<biome>/` |
| Tests | Node's built-in test runner (`node --test`) over `src/*.test.ts` — no Vitest/Playwright installed despite earlier docs mentioning them as aspirational |
| Persistence | Browser `localStorage` only (campaign progress, best moves, settings) — no backend, no account |

Source layout (`src/`): `main.ts` (engine + render + UI, intentionally monolithic for a project this size), `types.ts`, `level.ts` (starter level + schema helpers), `campaign.ts` (campaign graph data), `mechanics`/gravity/laser logic inline in `main.ts`, plus `*.test.ts` files colocated per concern (gravity, lasers, campaign, replay, terrain, etc.).

## 3. Current status — Batch 27 (17 Oct 2026)

**The project now has a verified, reproducible production build and a passing real-browser smoke test — the first time in its 27-batch history.** Every prior status report said the build was unverified because `npm install` "timed out"; the actual cause was that this workspace had no Node.js installed at all. That's fixed:

- Node.js 24 LTS installed and permanently on `PATH`.
- `npm ci` is clean and reproducible (esbuild's postinstall script approval is persisted in `package.json`'s `allowScripts`, no manual step needed).
- `npm test` → **60/60 passing**.
- `npm run build` → clean `tsc -b && vite build` (two real TypeScript errors found and fixed in `src/main.ts`, both type/dead-code issues with no behavior change — see `PROJECT_STATUS.md` Batch 27 for specifics).
- Verified in actual headless Chromium via Playwright: menu renders, **Start game → First Light** tutorial level loads with a correct 3D scene, WASD movement works, move counter updates correctly, zero console errors.

**Not yet done:** this was one smoke test on one level. The large P1 backlog below — systematic gameplay/editor/replay regression testing across all three campaigns — has not been exercised.

**Also worth knowing:** this workspace is **not a git repository**. 27 batches of work have no version history or backup beyond the files on disk. This hasn't been acted on — it's a separate decision for whoever owns the project.

## 4. Known limitations (as of now)

- Mechanism logic is a fixed catalogue (plates/gates/AND-links/etc.), not a general scripting/logic-graph system — by design, for level-file safety.
- Laser/receiver settling is deterministic but fails closed on contradictory configs rather than looping forever.
- Lift and teleporter transfers are discrete state changes, not fully animated sequences.
- No external 3D/2D assets are bundled; the manifest-driven GLB/GLTF override pipeline (`ASSET_PIPELINE.md`) exists but is untested against real artist output.
- Authored level `solution`/`hint` fields are proposed walkthroughs, not solver-verified.
- Single ~830 KB JS bundle; Vite warns about chunk size (no code-splitting yet — not a problem at this project's current scale, but will matter if content grows a lot more).

## 5. Short-term plan (next working sessions)

Ordered by what unblocks the most downstream confidence first.

1. **Systematic gameplay regression, in-browser** — not just unit tests. Play through representative levels from all three campaigns (at minimum: one per mechanic tag — plates, gates, lifts, lasers/mirrors, teleporters, conveyors, fragile floor, heavy blocks, ice, fire, multi-elevation falls) using the same Playwright setup already proven to work. Confirm each advertised `hint`/`solution` actually completes the level.
2. **Editor round-trip test** — for every bundled level file: open in editor → export JSON → re-import → confirm identical/equivalent state. This is explicitly flagged as unverified in `PROJECT_STATUS.md`.
3. **Replay determinism check** — complete a run, export the recording, re-import it, step through, and confirm the final state matches. Test at least one run involving gravity/falling and one involving undo.
4. **Drag-and-drop JSON import** — verify both valid and malformed level files, and the run-recording-rejected-with-guidance path, from both the campaign screen and live gameplay.
5. **Fix whatever the above turns up** — expect this phase to surface real bugs; it always does on a first full regression pass.
6. **Decide on version control** — `git init` + first commit, before any of the above regression work risks losing track of what changed. Flagged above; raise with whoever owns the project if not already planned.

Longer-horizon items (asset pipeline validation with real models, release packaging, performance profiling, code-splitting the bundle) are tracked in `PROJECT_STATUS.md` under P2/P3 and are intentionally out of scope until the P1 regression pass above is done.
