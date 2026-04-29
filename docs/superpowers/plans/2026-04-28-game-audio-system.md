# Game Audio System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete game audio layer with original music loops, event SFX, separate music/SFX controls, persistence, and web/mobile playback.

**Architecture:** Keep gameplay events and audio cue mapping in `@reino/game-core`, keep asset metadata in `@reino/assets`, and implement platform playback in web/mobile hooks. Preferences stay platform-local because persistence APIs differ.

**Tech Stack:** TypeScript, Vitest, React/Vite Web Audio + `HTMLAudioElement`, Expo React Native, `expo-av`, AsyncStorage.

---

## File Map

- Modify: `packages/game-core/src/types.ts` to add start/level transition event types.
- Modify: `packages/game-core/src/game-reducer.ts` to emit start and next-level audio events.
- Modify: `packages/game-core/src/audio-events.ts` to map game events to expanded audio cues.
- Test: `packages/game-core/src/__tests__/game-reducer.test.ts` for reducer-emitted transition events.
- Test: `packages/game-core/src/__tests__/audio-events.test.ts` for audio mapping.
- Modify: `packages/assets/src/index.ts` to expose audio catalog and music selection helper.
- Create: `packages/assets/audio/music/*.wav` and `packages/assets/audio/sfx/*.wav` as generated original placeholder-ready assets.
- Modify: `packages/assets/credits.md` to document generated original audio.
- Modify: `apps/web/src/lib/progress-storage.ts` for `musicEnabled` and `sfxEnabled` migration.
- Create: `apps/web/src/hooks/useGameSfx.ts` for event SFX playback.
- Create: `apps/web/src/hooks/useGameMusic.ts` for menu/battle/victory music playback.
- Modify: `apps/web/src/App.tsx` to wire music and SFX preferences.
- Modify: `apps/web/src/hooks/useGameController.ts` to expose separate toggles.
- Modify: `apps/web/src/screens/MainMenuScreen.tsx` for separate audio controls.
- Modify: `apps/web/src/screens/BattleScreen.tsx` for in-game audio controls.
- Modify: `apps/web/src/screens/VictoryScreen.tsx` for post-level audio controls.
- Modify: `apps/web/src/styles/game.css` for audio controls layout.
- Modify: `apps/mobile/src/storage/progress-storage.ts` for `musicEnabled` and `sfxEnabled` migration.
- Create: `apps/mobile/src/hooks/useGameSfx.ts` for Expo SFX playback.
- Create: `apps/mobile/src/hooks/useGameMusic.ts` for Expo music playback.
- Modify: `apps/mobile/src/App.tsx` to wire music and SFX preferences.
- Modify: `apps/mobile/src/hooks/useGameController.ts` to expose separate toggles.
- Modify: `apps/mobile/src/screens/MainMenuScreen.tsx` for separate audio controls.
- Modify: `apps/mobile/src/screens/BattleScreen.tsx` for in-game audio controls.
- Modify: `apps/mobile/src/screens/VictoryScreen.tsx` for post-level audio controls.
- Modify: `docs/react-native-restructure-tasks.md` to mark new audio tasks.

## Task 1: Core Audio Events

**Files:**
- Modify: `packages/game-core/src/types.ts`
- Modify: `packages/game-core/src/game-reducer.ts`
- Modify: `packages/game-core/src/audio-events.ts`
- Test: `packages/game-core/src/__tests__/game-reducer.test.ts`
- Test: `packages/game-core/src/__tests__/audio-events.test.ts`

- [ ] Step 1: Write failing tests for `GAME_STARTED`, `LEVEL_STARTED`, `NEXT_LEVEL_REQUESTED`, and cue mapping.
- [ ] Step 2: Run `npm run test -w @reino/game-core` and confirm failure is due to missing events/cues.
- [ ] Step 3: Add event types and reducer emissions.
- [ ] Step 4: Expand cue mapping.
- [ ] Step 5: Run `npm run test -w @reino/game-core` and confirm pass.

## Task 2: Audio Assets And Catalog

**Files:**
- Create: `packages/assets/audio/music/menu-theme.wav`
- Create: `packages/assets/audio/music/battle-basic.wav`
- Create: `packages/assets/audio/music/battle-intermediate.wav`
- Create: `packages/assets/audio/music/battle-advanced.wav`
- Create: `packages/assets/audio/music/game-complete.wav`
- Create: `packages/assets/audio/sfx/*.wav`
- Modify: `packages/assets/src/index.ts`
- Modify: `packages/assets/credits.md`

- [ ] Step 1: Generate original WAV files using deterministic synthesis.
- [ ] Step 2: Add audio catalog with stable IDs and relative paths.
- [ ] Step 3: Add `getBattleMusicCue(levelIndex)` helper.
- [ ] Step 4: Document audio as original generated assets.

## Task 3: Web Playback And Controls

**Files:**
- Modify: `apps/web/src/lib/progress-storage.ts`
- Create: `apps/web/src/hooks/useGameSfx.ts`
- Create: `apps/web/src/hooks/useGameMusic.ts`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/hooks/useGameController.ts`
- Modify: `apps/web/src/screens/MainMenuScreen.tsx`
- Modify: `apps/web/src/screens/BattleScreen.tsx`
- Modify: `apps/web/src/screens/VictoryScreen.tsx`
- Modify: `apps/web/src/styles/game.css`

- [ ] Step 1: Migrate `audioEnabled` to `musicEnabled` and `sfxEnabled` while accepting old stored data.
- [ ] Step 2: Implement Web SFX hook with `HTMLAudioElement` and fallback oscillator.
- [ ] Step 3: Implement Web music hook with looped `HTMLAudioElement` and browser autoplay-safe start after user gesture.
- [ ] Step 4: Wire hooks in `App`.
- [ ] Step 5: Add menu, battle, and victory controls for music/SFX.

## Task 4: Mobile Playback And Controls

**Files:**
- Modify: `apps/mobile/src/storage/progress-storage.ts`
- Create: `apps/mobile/src/hooks/useGameSfx.ts`
- Create: `apps/mobile/src/hooks/useGameMusic.ts`
- Modify: `apps/mobile/src/App.tsx`
- Modify: `apps/mobile/src/hooks/useGameController.ts`
- Modify: `apps/mobile/src/screens/MainMenuScreen.tsx`
- Modify: `apps/mobile/src/screens/BattleScreen.tsx`
- Modify: `apps/mobile/src/screens/VictoryScreen.tsx`

- [ ] Step 1: Migrate mobile persistence to separate `musicEnabled` and `sfxEnabled` flags.
- [ ] Step 2: Implement Expo SFX hook using static `require()` asset mapping.
- [ ] Step 3: Implement Expo music hook using static `require()` asset mapping, looping, and cleanup.
- [ ] Step 4: Add menu, battle, and victory controls.

## Task 5: Verification And Evidence

**Files:**
- Modify: `docs/react-native-restructure-tasks.md`
- Create/Update: `.tmp/reports/audio-system-verification.md`
- Create/Update: `.tmp/screenshots/web/audio-menu.png`
- Create/Update: `.tmp/screenshots/web/audio-battle.png`

- [ ] Step 1: Run `npm run test`.
- [ ] Step 2: Run `npm run typecheck --workspaces --if-present`.
- [ ] Step 3: Run `npm run build`.
- [ ] Step 4: Run web app and capture browser screenshots for menu and battle audio controls.
- [ ] Step 5: Save verification report with exact commands and outcomes.
