# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Nuxt dev server on `http://localhost:3000`. **Do not run this yourself** — the user starts the dev server to test functionality.
- `npm run build` — production build.
- `npm run generate` — static site generation.
- `npm run preview` — preview production build locally.
- `npm run lint` — run ESLint and Stylelint together (both must pass).
- `npm run lint:fix` — auto-fix ESLint + Stylelint.
- `npm run lint:style` / `npm run lint:style:fix` — Stylelint only.
- `postinstall` runs `nuxt prepare` automatically; a Husky `pre-commit` hook runs `lint-staged` (ESLint on `*.{js,ts,vue}`, Stylelint on `*.{css,vue}`).

There is no test runner wired up despite `@nuxt/test-utils` being installed.

## Architecture

Single-page Nuxt 3 app (Vue 3, Composition API) that renders a 3D CSS cube with animated "sparkle" decorations on each face. The project is intentionally small; most interesting logic is CSS-driven.

- `app.vue` → `<NuxtPage />` → `pages/index.vue` mounts a single `TheCube` with a `ProfileCard` in the `front` slot.
- `components/TheCube.vue` is the central widget: it owns the six-side cube state (`side` ref + `SIDES` tuple), handles click-to-spin by picking a random next side (`getRandomAvailableSideIndex`), and renders six named slots (`front`/`back`/`left`/`right`/`top`/`bottom`) — each wrapped with a `SparklesSparkles` of a distinct `type`. 3D transforms on `.cube[data-side="…"]` drive the rotation.
- `components/SparklesSparkles.vue` (and `SparklesSparkles2.vue`) generates per-type sparkle particles. Positions come from a fixed `SPARKLE_POSITIONS_BASE` table + random offset, re-randomised on each CSS `animationiteration` via `updateSparklePosition`. Type-specific counts are clamped by `MAX_PARTICLES`. When modifying sparkle shapes, note that `star` renders an inline SVG while the others (`cross`/`plus`/`asterisk`/`diamond`) are built entirely from `::before`/`::after` pseudo-elements styled via `--sparkle-*` custom properties.
- `components/ui/` (`Button`, `Card`, `Badge`) are shared primitives consumed via Nuxt auto-import as `UiButton`, `UiCard`, `UiBadge` (the `Ui` prefix comes from the `ui/` subfolder, per Nuxt's component-name convention).
- `assets/css/global.css` is imported via `nuxt.config.ts` `css:` — `body` has `overflow: hidden` and a 500×500 minimum because the cube is a fixed-size viewport widget.

There is **no FSD structure currently in use** despite `README_FSD.md`. Commit `9a11a3e removed FSD` explicitly reverted it. Do not reintroduce `app/widgets/features/entities/shared/` directories unless the user asks — put new work under `components/`, `pages/`, etc.

## Code style specifics (beyond the user-global rules in `~/.claude/CLAUDE.md`)

The ESLint + Stylelint configs here are strict and opinionated. Run `npm run lint` after edits; do not manually reformat against these rules if lint will auto-fix them.

- **TypeScript**: `tsconfig.json` enables `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, and `noImplicitOverride`. Array/record accesses return `T | undefined` — narrow before use (see `TheCube.vue` guards on `nextSide`).
- **ESLint**: `@typescript-eslint/explicit-function-return-type` is on — always annotate return types on functions. `no-explicit-any` is an error (use `unknown`). `consistent-type-definitions` requires `interface` over `type` for object shapes. `padding-line-between-statements` enforces blank lines around `const`/`let`/`return`/control-flow blocks — most whitespace "weirdness" you see is mandated.
- **Vue template rules**: `component-name-in-template-casing: PascalCase`, `attribute-hyphenation: always`, strict attribute ordering (`DEFINITION → LIST_RENDERING → CONDITIONALS → … → EVENTS`), and `first-attribute-linebreak: below` for multiline elements.
- **Stylelint `order/properties-order`**: CSS properties must follow a fixed order (positioning → box model → typography → background → border → effects → animation → cursor → content). See `.stylelintrc.json` for the full list. Also: `color-named: never` (use hex), `declaration-no-important: true`, strings use double quotes.
