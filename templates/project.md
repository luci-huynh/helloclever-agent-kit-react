# Project Profile — <project name>

<!-- Project-specific file. Maintained by the team. -->
<!-- `<...>` = not filled in yet. `[needs confirmation]` = filled in but not yet verified by the team. -->
<!-- `agent-kit init` prefills Actual stack and Commands from .agent-kit/facts.json; the generate-project-profile skill drafts the rest. -->

## Overview
- Purpose: <what this project does, and for whom>
- Owner / contact: <name or team>

## Actual stack
- React: <version>
- TypeScript: <version; strict mode on/off>
- Package manager: <yarn / npm / pnpm>
- Build: <Vite / Next.js / CRA / webpack…>
- Router: <library + version>
- State: <local state / Zustand / Redux / Context…>
- Data fetching: <TanStack Query / SWR / axios + hooks…>
- Styling: <Tailwind / SCSS modules / styled-components…>
- Forms: <React Hook Form / Formik / custom…, plus validation library>
- Tests: <Vitest / Jest + Testing Library…>
- UI library / design system: <name, or "none yet">
- i18n: <react-i18next / react-intl / none>
- Lint / format: <ESLint / Prettier / Biome…>
- Import aliases: <e.g. `@/*` → `src/*`, or none>

## Folder structure
<!-- Briefly describe the main folders and what lives where. If old and new code follow different conventions, say so. -->
- `src/...` — <contents>

## Reference files to imitate
<!-- Most important section: the AI opens these files to learn the patterns. -->
- Component: `<path>`
- Custom hook: `<path>`
- API call: `<path>`
- Form: `<path>`
- Test: `<path>`

## Commands
- Install: `<yarn install>`
- Dev: `<yarn dev>`
- Lint: `<yarn lint>`
- Typecheck: `<yarn typecheck>`
- Test: `<yarn test>`
- Build: `<yarn build>`

## Override core rules
<!-- Rule code + how this project does it differently + why. Sections 6 and 8 cannot be overridden. -->
<!-- Examples:
- R5.1: No API layer yet; existing code calls axios directly inside `useXxx` hooks. New code follows the same approach until migration.
- R4.1: No design tokens yet; use the SCSS variables in `src/styles/_vars.scss`.
-->

## Special notes
<!-- Things the AI often gets wrong in this project, sensitive code areas, third-party integrations… -->
