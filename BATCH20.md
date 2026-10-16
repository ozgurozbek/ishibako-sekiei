# Batch 20: The Frontier Mechanisms

## New campaign

Added **The Frontier Mechanisms**, a third campaign with 12 new levels and its own campaign progress/save slot. Its route introduces and recombines key-locked gates, laser mirrors and receiver-controlled bridges, heavy-only plates, multi-source AND gates, signal-enabled lifts, portals carrying attached blocks, conveyors, fragile assemblies, spike detours, switch-controlled bridges, keys plus plate gates, and a final multi-mechanic synthesis.

## New level files

- `frontier-key.json`: key-gated passage.
- `frontier-mirror-maze.json`: laser reflection opens a bridge.
- `frontier-heavy-seal.json`: belt pickup and heavy-only plate.
- `frontier-two-signals.json`: switch and plate AND-gate.
- `frontier-lift-lock.json`: switch-enabled lift pair across elevations.
- `frontier-portal-weight.json`: teleport with an attached block.
- `frontier-conveyor-cross.json`: directional conveyor and shard.
- `frontier-fragile-assembly.json`: glued assembly with a fragile block.
- `frontier-spike-detour.json`: spike avoidance and optional collectible.
- `frontier-bridge-timing.json`: switch-controlled bridge.
- `frontier-shard-circuit.json`: key, plate, gate, and shard combination.
- `frontier-cartographers-end.json`: heavy block, laser receiver, and enabled lift synthesis.

All levels include authored hint/solution metadata and ChatGPT (OpenAI) campaign-design credit. The project owner retains the core game concept and project direction.

## Verification

Run `npm test` for level validation, mechanic tests, campaign graph tests, and campaign metadata checks. A production build and hands-on browser playtest remain separate outstanding checks because this workspace has not had its Vite/Three.js dependencies installed successfully. Walkthroughs are design intent, not claims of verified playability.
