# Executive Plan: Kenney Sprite Expansion

Date: 2026-04-29
Status: in_progress

## Objective

Expand the game's visual asset library with license-safe Kenney packs, then apply a curated subset to improve enemy variety, RPG UI affordances, and phase identity without changing game rules.

## Source Policy

- Primary source: Kenney official asset pages.
- Accepted license for this slice: Creative Commons CC0 only.
- OpenGameArt is research-only for now because licenses vary per asset.
- Every downloaded pack must be recorded in `packages/assets/credits.md` before use.

## Packs

- `Roguelike Characters`: enemies, professor/hero options, phase-specific creatures.
- `Tiny Dungeon`: cave/dungeon ambience and compact environmental props.
- `Roguelike Caves & Dungeons`: stronger cave/abyss/throne identity.
- `UI Pack (RPG Expansion)`: RPG panels/buttons/sliders/resource affordances.
- `Micro Roguelike`: small status/resource icons to replace remaining generic symbols.

## Execution Slices

1. Download packs into `packages/assets/raw/` and preserve license files.
2. Copy only curated runtime assets into web/mobile public asset folders.
3. Extend `@reino/assets` catalog with new sprite sheets and semantic keys.
4. Apply curated sprites to existing enemies/resources where low-risk.
5. Run tests, typecheck, build, and browser-proof the changed screens.

## Guardrails

- Do not add non-CC0 assets.
- Do not replace game logic or question rules.
- Do not bulk-wire every file from each pack into runtime bundles.
- Keep fallback behavior intact if a sprite key is missing.

## Acceptance

- Credits include source URL, download URL, license, local paths, and date.
- Web and mobile builds can resolve all referenced assets.
- Existing tests/typecheck/build pass.
- Browser proof confirms no obvious visual/layout breakage.
