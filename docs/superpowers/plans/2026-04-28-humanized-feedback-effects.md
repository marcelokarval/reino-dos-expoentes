# Humanized Feedback Effects Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add humanized professor reactions, improved combat feedback, and victory star/explosion effects across web and mobile.

**Architecture:** Store copy and deterministic message selection in `@reino/game-content`; render visual feedback in platform UI from existing `GameEvent[]` and state. No gameplay rule changes beyond tests for content helper behavior.

**Tech Stack:** TypeScript, Vitest, React/Vite CSS animations, React Native, `react-native-reanimated`.

---

## Task 1: Professor Messages

**Files:**
- Create: `packages/game-content/src/professor-messages.ts`
- Modify: `packages/game-content/src/index.ts`
- Modify: `packages/game-content/package.json`
- Test: `packages/game-content/src/__tests__/professor-messages.test.ts`

- [ ] Write failing tests for event-based professor messages and immediate-repeat avoidance.
- [ ] Run `npm run test -w @reino/game-content` and confirm RED.
- [ ] Implement `getProfessorMessage()` and message banks.
- [ ] Run `npm run test -w @reino/game-content` and confirm GREEN.

## Task 2: Web Combat Feedback

**Files:**
- Modify: `apps/web/src/screens/BattleScreen.tsx`
- Modify: `apps/web/src/components/StatusBars.tsx`
- Modify: `apps/web/src/styles/game.css`

- [ ] Add derived feedback values for damage, mission progress, combo, and professor reaction.
- [ ] Render floating damage, mission star, hero damage note, and combo aura.
- [ ] Add CSS keyframes and reduced-motion-safe behavior.

## Task 3: Web Victory Celebration

**Files:**
- Modify: `apps/web/src/screens/VictoryScreen.tsx`
- Modify: `apps/web/src/styles/game.css`

- [ ] Render star award and particle burst.
- [ ] Improve victory copy based on mission completion and game status.

## Task 4: Mobile Feedback

**Files:**
- Modify: `apps/mobile/src/screens/BattleScreen.tsx`
- Modify: `apps/mobile/src/screens/VictoryScreen.tsx`

- [ ] Add event-driven professor message text.
- [ ] Add floating damage/mission text and victory star elements.
- [ ] Keep animation lightweight and typecheck-safe.

## Task 5: Verification

**Files:**
- Modify: `docs/react-native-restructure-tasks.md`
- Create: `.tmp/reports/humanized-feedback-verification.md`

- [ ] Run `npm run test`.
- [ ] Run `npm run typecheck --workspaces --if-present`.
- [ ] Run `npm run build`.
- [ ] Capture web screenshots for battle feedback and victory effects.
