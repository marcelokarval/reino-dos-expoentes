# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-04-29] FOCO changes need reducer proof**
   Do instead: update `packages/game-core/src/__tests__/game-reducer.test.ts` before changing focus timing or damage behavior.

## Shell & Command Reliability
1. **[2026-04-29] `.tmp/` holds browser/runtime proof**
   Do instead: write screenshots, logs, and proof artifacts under `.tmp/` and keep committed docs separate.

## Domain Behavior Guardrails
1. **[2026-04-29] Settings modal should pause battle runtime**
   Do instead: pass modal-open state into web/mobile controllers and stop countdown/FOCO intervals while it is open.

## User Directives
1. **[2026-04-29] Mobile validation order**
   Do instead: validate Android first; validate iOS only after Android is stable.
