# Humanized Combat Feedback Design

## Goal

Make combat feedback more emotionally legible and encouraging by adding visible damage/progress effects, professor reactions, and celebratory victory moments.

## Scope

- Add professor message variants for correct answers, combos, wrong answers, timeouts, item use, low HP, victory, and game over.
- Add deterministic message selection that avoids immediate repetition.
- Add web combat effects for enemy damage, mission progress, hero damage, combo energy, and victory star bursts.
- Add mobile equivalents using lightweight React Native/Reanimated UI effects.
- Keep all gameplay rules in `game-core`; this feature only presents existing event state more clearly.

## Architecture

- `@reino/game-content` owns professor copy and message selection helpers.
- Web and mobile derive visual state from `GameEvent[]`, current HP, mission progress, and combo.
- Effects are transient and non-authoritative; they never change gameplay state.
- Reduced-motion support stays in CSS on web; mobile animations remain short and non-essential.

## UX Rules

- Success should feel rewarding: enemy burst, damage text, mission star, professor praise.
- Failure should feel recoverable: hero damage flash, clear text, professor coaching.
- Victory should feel earned: large star/medal, particle burst, stronger copy.
- Feedback must not obscure math questions or answer buttons.
- Text must communicate the same information as animation.

## Testing

- Unit test professor message selection in `@reino/game-content`.
- Verify web/mobile TypeScript compilation.
- Verify web build.
- Capture browser screenshots for correct-answer feedback and victory celebration.
