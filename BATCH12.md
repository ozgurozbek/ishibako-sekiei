# Batch 12: simulation hardening

## Deterministic mechanism updates
- Laser receiver states now iterate to a stable state rather than relying on a fixed two-pass refresh.
- Receiver-linked gates can open in the same resolution step when an upstream receiver becomes lit.
- Feedback loops that repeat a prior receiver state fail closed, preventing activation from depending on an arbitrary pass count.
- Gravity resolution refreshes laser receivers before and after falling objects settle, so collision checks use current mechanism state.

## Replay file validation
- Run recording imports now require the supported schema version and complete run metadata.
- Each frame is checked for sequential indexing, action/state fields, non-negative counters and elapsed time, object IDs/types, and attachment IDs.
- Invalid or future-version recordings are rejected with a targeted error rather than partially loaded.

## Regression coverage
- Added tests for receiver-to-gate chains, fail-closed receiver feedback, deterministic gravity without input mutation, falling-block gate collision, and malformed replay versions/indices.
- `npm test`: 36 tests pass.
- Core simulation, mechanics, and replay modules pass a focused TypeScript check. A full production build/browser regression was not confirmed in this batch.
