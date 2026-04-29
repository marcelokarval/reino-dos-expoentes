# AGENTS.md

This repository is a cross-platform educational game for exponent rules. Future agents should treat it as a shared-rule monorepo: web and mobile are consumers, while gameplay truth lives in packages.

## Project Identity

- Product name: Reino dos Expoentes.
- Author/student identity: João Manoel.
- Goal: teach exponent properties through short RPG-style battles with mission progress, FOCO, feedback, professor coaching, items, sprites, music, and SFX.
- Platforms: React/Vite web and Expo/React Native mobile.
- Current preferred validation order: web for fast browser proof, Android for mobile runtime, iOS after Android is stable.

## Repository Map

- `apps/web`: React + Vite web runtime, CSS, browser storage, web audio hooks, public runtime assets.
- `apps/mobile`: Expo + React Native runtime, AsyncStorage, Expo AV audio, mobile image/sprite wiring.
- `packages/game-core`: pure gameplay rules, reducer, question generation, combat, inventory, events, random utilities, tests.
- `packages/game-content`: phase definitions, balance config, enemies, professor tips/messages, content tests.
- `packages/assets`: asset catalog, sprite metadata, audio metadata, raw Kenney archives, credits.
- `docs/superpowers`: execution plans and task trackers from prior implementation work.
- `.tmp`: local-only runtime proof, screenshots, reports, logs. It is intentionally ignored by Git.
- `.claude/napkin.md`: curated repo runbook for recurring agent guidance.

## Architecture Rules

- Keep `packages/game-core` pure. Do not import React, React Native, DOM APIs, storage, CSS, audio, platform paths, or app-specific modules there.
- Put editable learning content and balance values in `packages/game-content`, not inside app screens.
- Put sprite/audio metadata and license evidence in `packages/assets`, not duplicated in app code beyond platform-specific loading maps.
- Web and mobile controllers may handle timers, persistence, audio, and UI effects, but should dispatch game actions rather than duplicating game rules.
- Do not add backward compatibility unless persisted data, shipped behavior, or an explicit requirement needs it.
- Prefer small, behavior-focused changes over broad rewrites.

## Gameplay Rules To Preserve

- FOCO starts at zero, grows on correct answers, persists across phases, absorbs damage before HP, and has per-level caps.
- FOCO decay waits for `focusDecayDelaySeconds`, then drains in full `focusDecayIntervalSeconds` steps.
- Settings modal must pause battle runtime: countdown, FOCO decay, answers, and pending question generation.
- Questions should not repeat within the current phase flow until that phase pool is exhausted.
- Answer options must be shuffled for each generated question.
- Professor feedback should remain humanized, contextual, visible with portrait, and not become a static label-only message.
- Mission gain feedback should remain overlay-style and not push the battle layout.

## Question Generation Guidance

- Update `packages/game-core/src/questions.ts` and `packages/game-core/src/__tests__/questions.test.ts` together.
- Use `buildQuestionPool()` for phase variety and uniqueness guarantees.
- Preserve `usedQuestionTexts` in `GameState` as the current anti-repeat mechanism.
- When adding a new exponent property, update `ExponentProperty`, `buildQuestionPool`, phase content, tests, and UI summaries.

## Asset And License Rules

- Only use assets with explicit license evidence.
- Kenney CC0 assets are approved when recorded in `packages/assets/credits.md`.
- Do not introduce random web assets, scraped images, or unverified OpenGameArt files without recording exact license and source.
- Runtime apps should use curated spritesheets and semantic keys, not bulk-import every raw file.
- Keep credits current whenever assets are added, moved, or replaced.

## Validation Gates

Run these before claiming completion for code changes:

```bash
npm test
npm run typecheck --workspaces --if-present
npm run build
```

For browser-visible changes, also capture proof under `.tmp/`, for example:

```bash
npm run dev:web
```

Then store screenshots/reports in `.tmp/screenshots/...` and `.tmp/reports/...`.

## Browser Proof Expectations

- Browser proof is required when changing screens, timers, settings, question flow, sprites, professor UI, or feedback animations.
- Proof should include screenshots plus a short report when behavior is not obvious from a single screenshot.
- Do not commit `.tmp` proof unless the user explicitly asks; reference it in final summaries.

## Mobile Expectations

- Keep mobile behavior aligned with web when changing core game flow.
- For settings pause, timer behavior, FOCO drain, professor portrait, and sprite loading, update both web and mobile.
- Validate Android before iOS when real mobile runtime validation is requested.

## Git And PR Rules

- Do not commit unless the user asks.
- Do not amend commits unless the user explicitly asks.
- Do not use destructive Git commands unless explicitly approved.
- Keep unrelated user changes intact.
- If asked to create a PR, use `gh` when available and include validation commands in the PR body.

## Known Local Proof Pattern

Question-flow browser proof can be generated with a headless Chrome/CDP script in `.tmp/reports/question-browser-proof/`, saving PNGs under `.tmp/screenshots/question-browser-proof/` and a markdown/json report under `.tmp/reports/question-browser-proof/`.
