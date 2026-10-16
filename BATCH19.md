# Batch 19: The Cartographer's Trials

## Campaign content

- Added a second complete campaign, **The Cartographer's Trials**, alongside **The Shattered Paths**.
- The campaign atlas now includes a campaign selector. Each campaign has its own title, tagline, region labels, footer copy, node graph, unlock state, and persistent progress.
- Progress is stored independently per campaign. The previous `ishibako-hexbound-campaign-v1` save is migrated into The Shattered Paths when no v2 save exists.
- The Cartographer's Trials has 18 nodes: a short prologue, three 3-level mechanic routes, a mandatory three-way convergence, two synthesis challenges, a finale, and two optional secret shrines.
- Any unlocked node can be selected in any order. Merge nodes require every incoming branch. Secret challenges do not block the main route.
- New levels credit `ChatGPT (OpenAI) · Campaign Design` in level metadata. The campaign design focuses on clear mechanic introduction, then combinations that require players to revisit prior ideas.

## New levels

- `atlas-compass-run.json`: camera-relative movement and optional shard.
- `atlas-prism-lesson.json`: first rotation and pressure-plate lesson.
- `atlas-belt-and-brawn.json`: belt pickup and heavy-block rotation.
- `atlas-double-drag.json`: two-block rotation and two plates.
- `atlas-weight-of-two.json`: heavy and standard blocks in one assembly.
- `atlas-switchback.json`: switch-controlled gate.
- `atlas-lantern-line.json`: laser/receiver alignment and safe routing.
- `atlas-signal-confluence.json`: receiver plus plate required at an AND gate.
- `atlas-two-doors.json`: paired teleporter route.
- `atlas-lifted-verse.json`: linked lifts and a separate upper elevation.
- `atlas-current-and-crumble.json`: conveyor and fragile-floor timing.
- `atlas-threefold-seal.json`: rotation, receiver, plate, and AND-gate synthesis.
- `atlas-quiet-machinery.json`: multi-block rotation plus switch/gate progression.
- `atlas-world-in-miniature.json`: campaign finale combining heavy blocks, belt, portal, plate, gate, and optional shards.
- `atlas-secret-triad.json`: optional three-block rotation challenge.
- `atlas-secret-no-turning-back.json`: optional fragile route and collectible challenge.

The second campaign reuses two existing levels where they are a good fit: Gap Garden and Orbit Vault I. No existing campaign levels were removed.

## Data and code changes

- Bundled levels are discovered with Vite's `import.meta.glob('../levels/*.json', ...)`, so adding a level JSON file no longer requires a matching static import and object-map entry.
- Campaign definitions are declared in `src/campaign.ts`; nodes reference level IDs, prerequisite node IDs, mechanics, map coordinates, and optional/terminal flags.
- The map campaign selector changes the active graph without mixing progress between campaigns.
- `CAMPAIGN_AUTHORING.md` documents the content workflow.

## Verification

- `npm test`: 55 tests passed, 0 failed.
- The level-validation test now scans every JSON level in `levels/`, including all newly added campaign files.
- Campaign tests verify that both graphs have unique node IDs, every prerequisite resolves, every node references a level file, convergence waits for all three routes, and optional secrets do not block the finale.
- Full production build and browser playtesting remain unverified because the workspace does not have installed Three.js/Vite dependencies. TypeScript syntax transpilation is checked separately; it is not a substitute for a production build.

## Known playtest priorities

- Manually play every new level. The metadata includes intended walkthroughs, but these are design notes and have not all been confirmed through a live browser run.
- In particular, test the multi-source gate levels, the upper-level lift route, conveyor/fragile interactions, and the finale's portal/gate route.
- Check campaign switching while a puzzle is open, narrow-screen map selection, local-storage migration, and campaign-specific save isolation in a browser.
