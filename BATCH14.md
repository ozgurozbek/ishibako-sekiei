# Batch 14: Replay inspection and hazard collision rules

## Hazard rule corrections
- Spike hazards block the player only. Attached blocks and glued assemblies can move through or occupy spike cells, subject to normal solid-object and board collision rules.
- Active laser paths are hazards to the player, not solid barriers for blocks. Attached blocks can cross or occupy beam cells.
- Blocks still intercept laser beams during beam tracing, so moving a block can alter which receivers are illuminated.
- Updated move previews and conveyor movement to apply hazard checks only to the player, not carried blocks. Rotation and lift transfers no longer reject blocks solely because they cross a spike or beam.

## Replay improvements
- The replay panel now inspects each frame with player coordinates, attached-block count, key and shard counts, active pressure plates and receivers, and gate states.
- Replay import validation rejects frames whose player coordinates are missing or non-numeric.
- Updated `MECHANICS.md` to describe the corrected hazard semantics.

## Verification
- Run `npm test` for automated simulation, mechanics, replay, audio, and level tests.
- Production build and interactive browser regression should be run in an environment with project dependencies installed.
