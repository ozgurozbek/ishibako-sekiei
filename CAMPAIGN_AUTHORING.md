# Campaign Authoring Guide

Campaigns are authored in `src/campaign.ts`; each level is a standalone JSON file in `levels/`. Bundled level files are discovered automatically by Vite, keyed by their filename without `.json`.

## Add a level

1. Create `levels/<level-id>.json` using the existing level schema.
2. Set `metadata.id` to the same ID where practical, and include `name`, `description`, `difficulty`, `mechanics`, `hint`, and `solution`.
3. Validate it with `npm test`. The level test scans every JSON file in `levels/`.
4. Add a campaign node with `levelId: '<level-id>'` and a hand-authored `x`/`y` map position.

## Add a campaign

Append a `CampaignDefinition` to `campaignDefinitions` in `src/campaign.ts`:

- `id`: stable, unique identifier used for save isolation.
- `title`, `tagline`: title and subtitle shown in the atlas.
- `footerTitle`, `footerTagline`: bottom-of-map copy.
- `regionLabels`: four short labels positioned on the atlas.
- `nodes`: the hand-authored graph.

Each node needs a unique `id`, a `levelId`, title/subtitle, region, mechanics tags, map coordinates, and `requires` prerequisites. An empty `requires` array makes the starting node available. A convergence node lists every prerequisite branch endpoint. `secret: true` makes a node optional and excludes it from the default Continue selection; it still unlocks from its declared prerequisites. `final: true` changes its map marker and subtitle.

## Progress and saves

Campaign progress is persisted under `ishibako-Sekiei-campaign-v2-<campaign-id>`. Never reuse a campaign ID for an unrelated progression graph unless the old completion IDs are intentionally compatible. The old v1 save is migrated into `shattered-paths` only.

Progress records completed node IDs and best move counts. Level JSON contains no campaign completion state. Imported custom levels have no campaign node ID and cannot unlock campaign nodes.

## Map layout

The map uses a `1200 × 700` SVG viewBox. Keep node coordinates roughly within `x=60..1120` and `y=90..620`; leave room on the right for the detail panel and along the bottom for the map legend. Coordinates are presentation only; prerequisites control unlocking. Keep route lines from crossing labels and give branch routes enough visual separation to read at narrow widths.

## Puzzle design notes

- Teach one new mechanic before combining it with older mechanics.
- Put the critical mechanic in `metadata.mechanics` and explain it in the hint.
- Do not require optional collectibles to unlock the campaign.
- For a merge, list all branch endpoints in `requires`.
- Mark optional challenges `secret: true` and make sure they are not a prerequisite for the main finale.
- Treat `metadata.solution` as a proposed walkthrough until the level has been manually completed in the browser.
