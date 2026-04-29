# Reino dos Expoentes React Native Restructure Plan

**Status:** planned
**Last updated:** 2026-04-28
**Owner:** Marcelo / OpenCode

## Goal

Restructure Reino dos Expoentes from a static HTML game into a shared game platform with:

- React web version for GitHub Pages.
- Expo React Native version for installable Android first.
- iOS validation after Android is stable.
- Shared game logic, content, logger, sprites, and audio assets.

## Confirmed Decisions

- Use Expo for mobile.
- Migrate web to React.
- Validate Android first, then iOS.
- Search for internet sprite/art assets with clear licenses.
- Keep current static HTML as a backup/reference.
- Store screenshots and test artifacts under `.tmp/` with organized subfolders.

## Current Context

Current project root:

```text
/home/marcelo-karval/Backup/Downloads/joaomanoel
```

Current files:

```text
joaomanoel/
├── .tmp/
├── css/
│   └── styles.css
├── images/
├── index.html
├── js/
│   ├── app.js
│   └── logger.js
└── reino-dos-expoentes-backup.html
```

The current `index.html` is the improved static web version. The backup file preserves the original standalone HTML.

## Target Architecture

```text
joaomanoel/
├── apps/
│   ├── web/
│   │   └── React + Vite app for GitHub Pages
│   └── mobile/
│       └── Expo React Native app
├── packages/
│   ├── game-core/
│   │   └── Pure game engine: rules, state, reducers, events
│   ├── game-content/
│   │   └── Levels, enemies, texts, balancing, professor tips
│   ├── logger/
│   │   └── Shared logger API adapted from current logger
│   └── assets/
│       └── Sprites, images, audio, license credits
├── legacy/
│   └── static-html/
│       └── Current static implementation and backup reference
├── docs/
│   ├── react-native-restructure-plan.md
│   └── react-native-restructure-tasks.md
└── .tmp/
    ├── screenshots/
    └── reports/
```

## Architectural Rule

The game rules must live in `packages/game-core`, not inside React components, Expo screens, DOM handlers, or CSS.

The core must not use:

- `document`
- `window`
- HTML
- CSS
- React
- React Native
- direct audio playback

The UI layers render state and dispatch actions. The core owns rules.

## Recommended Tech Stack

### Root

- npm workspaces or pnpm workspaces.
- TypeScript across new code.
- Shared scripts for test/build.

### Web

- React.
- Vite.
- TypeScript.
- CSS modules or plain CSS initially.
- GitHub Pages deployment.

### Mobile

- Expo.
- React Native.
- TypeScript.
- `react-native-reanimated` for animation.
- `react-native-gesture-handler` if gestures become necessary.
- `expo-audio` or `expo-av` for sound.
- `@react-native-async-storage/async-storage` for progress persistence.

### Shared Packages

- `packages/game-core`: pure TypeScript.
- `packages/game-content`: JSON/TypeScript content.
- `packages/logger`: shared logger facade.
- `packages/assets`: normalized asset catalog and credits.

## Phase 1: Monorepo Foundation

Objective: create the new project structure without changing gameplay behavior yet.

Expected actions:

1. Create root `package.json` with workspaces.
2. Create `apps/web` with React + Vite.
3. Create `apps/mobile` with Expo.
4. Create `packages/game-core`.
5. Create `packages/game-content`.
6. Create `packages/logger`.
7. Create `packages/assets`.
8. Move current static implementation into `legacy/static-html` after React web is ready or keep root static files until replacement is verified.

Verification:

- Root install succeeds.
- Web app dev server starts.
- Expo app starts.
- Current static web remains recoverable.

## Phase 2: Extract Game Core

Objective: isolate gameplay rules from DOM/UI code.

Proposed files:

```text
packages/game-core/src/
├── combat.ts
├── events.ts
├── game-reducer.ts
├── inventory.ts
├── questions.ts
├── random.ts
├── types.ts
└── index.ts
```

Core responsibilities:

- Current level.
- Player HP.
- Enemy HP.
- Current question.
- Mission progress.
- Combo.
- Inventory.
- Shield state.
- Timer/timeout consequences.
- Victory and game-over states.
- Emitted gameplay events for audio/animation.

Verification:

- Unit tests cover all exponent properties.
- Unit tests cover damage, timeout, mission, inventory, victory, and game over.

## Phase 3: Extract Game Content

Objective: make game content editable without touching engine code.

Proposed files:

```text
packages/game-content/src/
├── levels.ts
├── enemies.ts
├── professor-tips.ts
├── balance.ts
└── index.ts
```

Content responsibilities:

- Level names.
- Property type per level.
- Difficulty.
- Timer duration.
- Rule explanation.
- Enemy identity.
- Professor tips.
- Item labels.

Verification:

- Content imports cleanly from `game-core` consumers.
- No UI-specific references in content package.

## Phase 4: Migrate Web To React

Objective: replace the static DOM implementation with React while preserving the current game experience.

Proposed files:

```text
apps/web/src/
├── App.tsx
├── main.tsx
├── screens/
│   ├── BattleScreen.tsx
│   ├── MainMenuScreen.tsx
│   └── VictoryScreen.tsx
├── components/
│   ├── AnswerGrid.tsx
│   ├── EnemyDisplay.tsx
│   ├── InventoryPanel.tsx
│   ├── QuestionCard.tsx
│   └── StatusBars.tsx
├── hooks/
│   └── useGameController.ts
└── styles/
    └── game.css
```

React web responsibilities:

- Render menu, battle, and victory screens.
- Dispatch user actions to `game-core`.
- Play web audio later from core events.
- Keep responsive layout.
- Preserve GitHub Pages compatibility.

Verification:

- Web build succeeds.
- Browser smoke test passes.
- Screenshots saved under `.tmp/screenshots/web/`.
- Static backup remains available.

## Phase 5: Create Expo Mobile App

Objective: create installable mobile client using the same core.

Proposed files:

```text
apps/mobile/src/
├── App.tsx
├── screens/
│   ├── BattleScreen.tsx
│   ├── MainMenuScreen.tsx
│   └── VictoryScreen.tsx
├── components/
│   ├── AnswerGrid.tsx
│   ├── EnemySprite.tsx
│   ├── InventoryPanel.tsx
│   ├── QuestionCard.tsx
│   └── StatusBars.tsx
├── hooks/
│   ├── useGameAudio.ts
│   └── useGameController.ts
└── theme/
    └── tokens.ts
```

Mobile responsibilities:

- Render native screens.
- Use `game-core` for all gameplay state.
- Run offline.
- Use portrait layout first.
- Prepare Android validation before iOS.

Verification:

- Expo starts.
- Android emulator/device loads app.
- Basic battle loop works.
- Screenshots saved under `.tmp/screenshots/android/`.

## Phase 6: Sprites And Art Assets

Objective: replace emoji placeholders with licensed art assets.

Candidate sources:

- OpenGameArt.
- Kenney.nl.
- Itch.io free assets with explicit license.
- CraftPix free assets with explicit license.
- CC0/public-domain asset packs.

Asset rules:

- Do not use unclear-license art.
- Record source URL and license in `packages/assets/credits.md`.
- Normalize filenames.
- Keep raw downloads separate if needed.
- Prefer transparent PNG sprites for enemies/items.

Proposed structure:

```text
packages/assets/
├── credits.md
├── raw/
├── sprites/
│   ├── enemies/
│   ├── hero/
│   └── items/
└── audio/
    ├── music/
    └── sfx/
```

Verification:

- Asset credits are complete.
- Web loads sprites.
- Android loads sprites.

## Phase 7: Audio

Objective: add feedback sounds and later background music.

Core event names:

```text
ANSWER_CORRECT
ANSWER_WRONG
PLAYER_DAMAGED
ITEM_USED
LEVEL_COMPLETE
GAME_OVER
TIMEOUT_WARNING
```

Web audio:

- Start with simple `HTMLAudioElement` or Web Audio wrapper.

Mobile audio:

- Use `expo-audio` or `expo-av`.

Initial sounds:

- Button click.
- Correct answer.
- Wrong answer.
- Damage.
- Item use.
- Victory.
- Game over.
- Timer warning.

Verification:

- Web audio plays after user interaction.
- Android audio plays with acceptable latency.
- iOS audio behavior validated later.

## Phase 8: Animation And Game Feel

Objective: improve user feedback without changing rules.

Web:

- CSS transitions first.
- Add animation library only if CSS becomes limiting.

Mobile:

- Use `react-native-reanimated`.

Animations:

- Enemy hit flash.
- Wrong-answer shake.
- HP bar interpolation.
- Correct answer glow.
- Item use pulse.
- Victory flourish.

Verification:

- Animations do not block input incorrectly.
- Reduced-motion handling considered later.

## Phase 9: Persistence

Objective: save player progress and settings.

Persisted data:

- Highest unlocked level.
- Last level.
- Audio enabled/disabled.
- Volume.
- Optional: best combo and completion stats.

Web:

- `localStorage`.

Mobile:

- `AsyncStorage`.

Verification:

- Progress survives reload on web.
- Progress survives app restart on Android.

## Phase 10: Android Validation

Objective: produce the first installable target.

Steps:

1. Run app in Expo Go or development build.
2. Validate small Android screen layout.
3. Validate battle loop.
4. Validate audio.
5. Validate sprite loading.
6. Generate EAS Android build.
7. Install on physical device if available.
8. Save screenshots and notes under `.tmp/`.

Verification artifacts:

```text
.tmp/screenshots/android/
.tmp/reports/android-validation.md
```

## Phase 11: iOS Validation

Objective: validate iOS after Android is stable.

Steps:

1. Validate safe areas.
2. Validate audio behavior.
3. Validate notch/dynamic island layouts.
4. Build via EAS for iOS.
5. Test on simulator/device if available.
6. Save screenshots and notes under `.tmp/`.

Verification artifacts:

```text
.tmp/screenshots/ios/
.tmp/reports/ios-validation.md
```

## Risks

- Sprite licensing can block asset usage if sources are unclear.
- Expo audio API choice may change depending on current package stability.
- Migrating web and mobile at the same time can cause drift if `game-core` is not extracted first.
- GitHub Pages routing must stay simple unless React Router is introduced carefully.
- iOS build requires Apple account/tooling not guaranteed in local environment.

## Open Questions

- Use npm workspaces or pnpm workspaces?
- Use TypeScript strict mode from the start?
- Use React Router in web, or keep screen state local because the game has only three screens?
- Use portrait-only mobile initially?
- Which exact sprite style should define the visual direction?

## Recommended Next Step

Start with Phase 1 and Phase 2 only:

1. Create monorepo/workspaces.
2. Create `packages/game-core`.
3. Extract and test pure game rules before touching Expo screens.
