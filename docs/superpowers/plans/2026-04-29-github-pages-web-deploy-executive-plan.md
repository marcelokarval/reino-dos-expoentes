# Executive Plan: GitHub Pages Web Deploy

Date: 2026-04-29
Status: in_progress

## Objective

Publish the React/Vite web build of Reino dos Expoentes to GitHub Pages at the repository Pages URL and prove the deployed browser runtime loads correctly.

Expected public URL:

- `https://marcelokarval.github.io/reino-dos-expoentes/`

## Deployment Strategy

- Keep deployment static: Vite emits `index.html`, JS/CSS bundles, and public assets into `apps/web/dist`.
- Use GitHub Actions with `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
- Trigger deploys on pushes to `main` and allow manual `workflow_dispatch` runs.
- Set Vite `base` to `/reino-dos-expoentes/` so generated asset URLs resolve under the repository Pages path.

## Execution Slices

1. Update `apps/web/vite.config.ts` with the GitHub Pages base path.
2. Add `.github/workflows/pages.yml` to install dependencies, build `@reino/web`, upload `apps/web/dist`, and deploy Pages.
3. Validate locally with tests, typecheck, and build.
4. Commit and push directly to `main`.
5. Monitor the GitHub Actions Pages workflow until it completes.
6. Open the published URL and save browser-proof screenshots/report under `.tmp/`.

## Guardrails

- Do not commit `.tmp` browser proof artifacts.
- Do not move runtime assets out of the existing web public asset structure.
- Keep the workflow scoped to web deployment only; mobile remains Expo runtime.
- If GitHub Pages repository settings are not enabled, configure Pages to use GitHub Actions.

## Acceptance Criteria

- `npm test` passes.
- `npm run typecheck --workspaces --if-present` passes.
- `npm run build` passes.
- GitHub Pages workflow succeeds on `main`.
- Published URL returns the web app without broken JS/CSS/assets.
- Browser proof is saved under `.tmp/screenshots/github-pages-proof/` and `.tmp/reports/github-pages-proof/`.
