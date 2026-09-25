# ADR 0001: Rules layering and per-project customization

- Status: Accepted
- Date: 2026-09-24

## Context
Our React frontend projects are not consistent in folder structure or libraries. If core rules imposed an ideal structure on projects that do not follow it, the AI would be torn between the rules and the actual code.

## Decision
- **Core rules** contain only principles that hold regardless of structure and libraries. They are split into sections under `rules/core/`, and every rule has a code `R<section>.<number>`.
- **`project.md`** in each project describes how the project actually works and overrides conventions by rule code.
- Section 6 (Security & data) and section 8 (Definition of Done) cannot be overridden.
- Inside a project, kit files live in `.agent-kit/`. `AGENTS.md` is the shared entry point, and `CLAUDE.md` imports files with `@`.
- `config.json` can turn off a whole core section (for example TypeScript in a JavaScript project). _Superseded by [ADR 0002](0002-typescript-required.md): TypeScript is required, so this toggle was removed._
- Core rules are never edited by hand inside a project.

## Options considered
- Standardize every project first, then write rules: too slow; nobody would benefit for months.
- Let each project write its own rules: not reusable, and quality would be uneven.

## Consequences
- The kit works on existing projects immediately, with no code changes.
- The "Override core rules" section of `project.md` doubles as that project's standardization backlog.
- Rule codes must be stable: never renumber.
