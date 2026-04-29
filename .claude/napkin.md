# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-04-29] FOCO changes need reducer proof**
   Do instead: update `packages/game-core/src/__tests__/game-reducer.test.ts` before changing focus timing or damage behavior.
2. **[2026-04-29] Question generation changes need flow proof**
   Do instead: update `questions.test.ts` and `game-reducer.test.ts`, then browser-proof several sequential questions for no repeats.
3. **[2026-04-29] Web-visible changes need browser evidence**
   Do instead: save screenshots and behavior reports under `.tmp/screenshots/...` and `.tmp/reports/...` before claiming the UI works.
4. **[2026-04-29] Validate all packages from repo root**
   Do instead: run `npm test`, `npm run typecheck --workspaces --if-present`, and `npm run build` before completion.

## Shell & Command Reliability
1. **[2026-04-29] `.tmp/` holds browser/runtime proof**
   Do instead: write screenshots, logs, and proof artifacts under `.tmp/` and keep committed docs separate.
2. **[2026-04-29] Vite may auto-select occupied ports**
   Do instead: read the dev server log for the actual `http://127.0.0.1:<port>/` before browser navigation.
3. **[2026-04-29] Puppeteer screenshots may not persist to workspace paths**
   Do instead: use a CDP/headless Chrome script when the user explicitly needs PNG files saved in `.tmp/`.

## Domain Behavior Guardrails
1. **[2026-04-29] Settings modal should pause battle runtime**
   Do instead: pass modal-open state into web/mobile controllers and stop countdown/FOCO intervals while it is open.
2. **[2026-04-29] `game-core` must stay platform-pure**
   Do instead: keep React, React Native, DOM, storage, CSS, audio, and asset-loader code in app packages.
3. **[2026-04-29] Question flow must avoid repeats**
   Do instead: preserve `usedQuestionTexts` and choose from `buildQuestionPool()` excluding used question text.
4. **[2026-04-29] Options must remain shuffled**
   Do instead: keep `buildOptions()` using `shuffle()` and test that different random sources change option order.
5. **[2026-04-29] Professor needs a visible portrait**
   Do instead: use `professorSpritesByKey.guide` in both web and mobile battle/victory surfaces.
6. **[2026-04-29] Assets require license evidence**
   Do instead: add or update `packages/assets/credits.md` before wiring new runtime art/audio.

## User Directives
1. **[2026-04-29] Mobile validation order**
   Do instead: validate Android first; validate iOS only after Android is stable.
2. **[2026-04-29] Keep proof artifacts local**
   Do instead: place browser proof, runtime logs, and screenshots in `.tmp/` unless the user explicitly asks to commit them.
3. **[2026-04-29] Preserve João Manoel attribution**
   Do instead: keep README and product docs clear that João Manoel is the author/student identity.
