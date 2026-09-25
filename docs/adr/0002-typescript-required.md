# ADR 0002: TypeScript is required

- Status: Accepted
- Date: 2026-09-25

## Context
ADR 0001 allowed JavaScript projects to turn off the TypeScript rules (section 3) through `config.json`. Supporting both languages doubles what the rules, skills and reference files must cover, and weakens the automated gates (no typecheck) that the review process relies on.

## Decision
- Every project that uses this kit must be a TypeScript project.
- `agent-kit init` stops with an error if it finds neither a `typescript` dependency nor a `tsconfig.json`.
- Section 3 is always included in `core-rules.md`. The `--no-typescript` option and the `core.typescript` toggle in `config.json` are removed.

## Options considered
- Keep the JavaScript toggle: more projects could adopt the kit immediately, but every skill would need JavaScript variants and the typecheck gate would be optional.

## Consequences
- JavaScript projects must migrate to TypeScript before adopting the kit.
- `config.json` no longer has section toggles; it records the kit version.
- Skills and rules can assume TypeScript everywhere.
