# Reino dos Expoentes Restructure Tasks

**Status legend:**

- `todo`: not started
- `doing`: actively being worked on
- `done`: completed and verified
- `blocked`: cannot proceed due to dependency or missing decision
- `blocker`: issue blocks other tasks

**Last updated:** 2026-04-28

## Summary

| ID | Task | Status | Blocks | Notes |
|---|---|---:|---|---|
| P0-01 | Preserve current static app and backup | done | - | Current `index.html` and `reino-dos-expoentes-backup.html` exist. |
| P0-02 | Persist restructure plan | done | - | See `docs/react-native-restructure-plan.md`. |
| P0-03 | Persist task tracker | done | - | This file. |
| P1-01 | Choose workspace package manager | done | P1-02 | npm workspaces selected. |
| P1-02 | Create root workspace config | done | P1-03, P1-04, P1-05 | Root `package.json` and `tsconfig.base.json` created. |
| P1-03 | Scaffold React web app | done | P4-* | Vite + React + TypeScript scaffolded in `apps/web`. |
| P1-04 | Scaffold Expo mobile app | done | P5-* | Expo + React Native + TypeScript scaffolded in `apps/mobile`. |
| P1-05 | Scaffold shared packages | done | P2-*, P3-*, P6-* | `game-core`, `game-content`, `logger`, `assets` created. |
| P2-01 | Define game-core types | done | P2-02 | State, actions, events, level model. |
| P2-02 | Extract question generator | done | P2-03 | Product/division/power/zero/negative/complex. |
| P2-03 | Extract combat rules | done | P2-04 | Damage, HP, combo, victory. |
| P2-04 | Extract inventory rules | done | P2-05 | Scrolls, potion, shield. |
| P2-05 | Implement game reducer/controller | done | P4-02, P5-02 | Shared gameplay state transitions. |
| P2-06 | Add game-core tests | done | P4-02, P5-02 | 16 unit tests passing. |
| P3-01 | Move level data to game-content | done | P4-02, P5-02 | Names, rules, difficulty, timers. |
| P3-02 | Add professor tips content | done | P4-04, P5-04 | First-pass tips added. |
| P3-03 | Add balancing constants | done | P2-03 | Damage and mission values. |
| P4-01 | Create React web shell | done | P4-02 | Main app and screen switching. |
| P4-02 | Wire React web to game-core | done | P4-03 | No duplicate rules in UI. |
| P4-03 | Port current visual style to React web | done | P4-05 | Current visual identity preserved. |
| P4-04 | Add web professor/inventory components | done | P4-05 | UI parity first pass. |
| P4-05 | Validate React web in browser | done | P4-06 | Screenshots saved in `.tmp/screenshots/web/`. |
| P4-06 | Prepare GitHub Pages build | done | - | Vite `base: './'` and production build verified. |
| P5-01 | Create Expo screen structure | done | P5-02 | Menu, battle, victory. |
| P5-02 | Wire Expo app to game-core | done | P5-03 | Shared rules only. |
| P5-03 | Implement mobile responsive battle UI | done | P5-04 | Portrait-first shell implemented. |
| P5-04 | Add mobile inventory/status/question components | done | P5-05 | UI parity first pass. |
| P5-05 | Run Android smoke test | blocked | P10-01 | Requires Android device/emulator runtime. |
| P6-01 | Research licensed sprite sources | done | P6-02 | Kenney Roguelike/RPG Pack selected; CC0 verified. |
| P6-02 | Record asset credits | done | P6-03 | `packages/assets/credits.md` updated. |
| P6-03 | Normalize sprite files | done | P6-04 | Initial spritesheet catalog added in `@reino/assets`. |
| P6-04 | Integrate sprites in web | done | P6-05 | Web React uses Kenney spritesheet for enemy display. |
| P6-05 | Integrate sprites in mobile | done | P10-01 | Expo component uses Kenney spritesheet crop; runtime Android smoke still pending. |
| P7-01 | Choose audio library for Expo | done | P7-03 | Selected `expo-av` for first pass. |
| P7-02 | Add audio event mapping in game-core | done | P7-03, P7-04 | `getAudioCues()` maps gameplay, start, and level transition events to audio cues. |
| P7-03 | Implement mobile audio hook | done | P10-01 | Expo music/SFX hooks use generated local WAV assets; runtime Android proof pending. |
| P7-04 | Implement web audio hook | done | P4-05 | Web music/SFX hooks use generated local WAV assets with browser unlock fallback. |
| P7-05 | Generate original music and SFX assets | done | P7-03, P7-04 | Deterministic WAV assets generated and credited in `packages/assets/credits.md`. |
| P7-06 | Add separate music/SFX controls | done | P4-05, P10-01 | Menu, battle, and victory screens expose persisted controls on web/mobile. |
| P7-07 | Add phase-specific battle themes | done | P7-03, P7-04 | Six themed loops now map to each enemy/fase. |
| P8-01 | Add web animations | done | P4-05 | CSS hit, damage, item, feedback animations added. |
| P8-02 | Add mobile animations | done | P10-01 | `react-native-reanimated` added for damage, enemy hit, inventory pulse. |
| P8-03 | Add humanized combat feedback | done | P4-05, P10-01 | Professor chat bubbles, damage floaters, mission star/blup, combo aura, bar polish, screen shake, and victory star effects added. |
| P9-01 | Add web persistence | done | P4-05 | `localStorage` progress plus migrated music/SFX preferences added. |
| P9-02 | Add mobile persistence | done | P10-01 | `AsyncStorage` progress plus migrated music/SFX preferences added; runtime Android persistence proof pending. |
| P10-01 | Validate Android through Expo | todo | P10-02 | Device/emulator proof. |
| P10-02 | Generate Android build | todo | - | EAS build. |
| P10-03 | Write Android validation report | todo | - | `.tmp/reports/android-validation.md`. |
| P11-01 | Validate iOS safe areas/audio | blocked | - | Blocked until Android is stable and iOS tooling/account is available. |
| P11-02 | Generate iOS build | blocked | - | Requires Apple/EAS setup. |
| P11-03 | Write iOS validation report | blocked | - | `.tmp/reports/ios-validation.md`. |

## Active Work

Audio system implementation is under verification; Android runtime smoke test remains pending.

## Blockers

| ID | Blocker | Status | Resolution Needed |
|---|---|---:|---|
| B-01 | Package manager not selected | done | Resolved: npm workspaces. |
| B-02 | iOS build tooling/account availability unknown | blocked | Resolve after Android validation. |
| B-03 | Sprite style and license sources not selected | done | Resolved for first pass: Kenney Roguelike/RPG Pack, CC0. |

## Next Recommended Task

Finish audio system verification, then start `P10-01`: validate Android through Expo on emulator/device.

## Progress Log

### 2026-04-28

- Created static app structure with `index.html`, `css/styles.css`, `js/app.js`, and `js/logger.js`.
- Preserved original file as `reino-dos-expoentes-backup.html`.
- Created `.tmp/screenshots/` and `.tmp/reports/` convention for test artifacts.
- Planned React web + Expo mobile restructure.
- Persisted architecture plan and task tracker in `docs/`.
- Selected npm workspaces and created monorepo structure.
- Created shared packages: `game-core`, `game-content`, `logger`, and `assets`.
- Added 16 passing `game-core` unit tests.
- Added 4 passing `game-content` professor-message unit tests.
- Created React web app in `apps/web`, built successfully, and saved browser screenshots.
- Created Expo mobile shell in `apps/mobile` and verified TypeScript compilation.
- Downloaded Kenney Roguelike/RPG Pack and recorded CC0 license evidence.
- Added initial spritesheet catalog in `packages/assets`.
- Integrated Kenney spritesheet into the React web battle screen.
- Saved sprite integration screenshot at `.tmp/screenshots/web/react-battle-sprites.png`.
- Copied Kenney spritesheet into `apps/mobile/assets/sprites/`.
- Integrated sprite cropping into Expo `EnemySprite` component using `@reino/assets` coordinates.
- Selected `expo-av` for mobile audio.
- Added shared audio cue mapping in `game-core`.
- Added synthetic Web Audio feedback hook in React web.
- Added Expo mobile audio hook prepared for local SFX files.
- Added CSS web animations for damage shake, enemy hit, item glow, inventory pulse, and feedback pop.
- Saved web animation screenshot at `.tmp/screenshots/web/react-battle-animations.png`.
- Added `react-native-reanimated` and Babel plugin to Expo app.
- Added mobile damage shake, enemy hit animation, and inventory pulse.
- Added web `localStorage` persistence for highest unlocked level and audio preference.
- Saved web persistence screenshot at `.tmp/screenshots/web/web-persistence.png`.
- Added mobile `AsyncStorage` persistence for highest unlocked level and audio preference.
- Mobile menu now displays progress, audio toggle, and reset progress controls.
- Persisted detailed audio implementation plan at `docs/superpowers/plans/2026-04-28-game-audio-system.md`.
- Generated original WAV music and SFX assets into `packages/assets/audio/`, `apps/web/public/assets/audio/`, and `apps/mobile/assets/audio/`.
- Added separate persisted music and SFX preferences for web and mobile.
- Added web and mobile music/SFX playback hooks and controls on menu, battle, and victory screens.
- Persisted humanized feedback design and implementation plan under `docs/superpowers/`.
- Added professor reaction message banks and deterministic non-repeating selector.
- Added web/mobile feedback effects for enemy damage, mission progress, professor coaching, and victory stars.
- Added six enemy-aligned phase music loops and mapped each phase to its own battle theme.
- Improved professor reactions into temporary chat bubbles with fade-out on web.
- Improved mission `+1` exit animation with spin, shrink, and blup visual effect.
- Improved bar animations and added conditional screen tremble for errors and stronger correct streaks.
