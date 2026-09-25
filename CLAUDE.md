# CLAUDE.md — working on agent-kit-react itself

This file gives AI agents the context for developing **this kit repo**. It is not the project template (that is `templates/CLAUDE.md`) and it is not packaged (it is outside `files` in `package.json`).

## Language

- The user may ask in Vietnamese. Reply in the user's language.
- **Everything written into this repo is English**: rules, skills, workflows, templates, docs, ADRs, commit messages, PR descriptions. No exceptions.

## What this is

`@helloclever/agent-kit-react`: rules, skills and workflows that make AI coding agents follow Hello Clever standards in React frontend projects.

- Scope for now: **React frontend only**. Backend comes later; shared parts will then move into a separate `agent-kit-core`.
- Status: v0.1.1, demo phase. `agent-kit init` CLI works; installed via `yarn add -D` from public git (see README, decision 3 below).

## Decisions already made (do not re-litigate)

1. **Three-layer rules** (see [ADR 0001](docs/adr/0001-rules-layering.md)):
   - Core rules in `rules/core/`, one file per section, every rule coded `R<section>.<number>`. Principles only; independent of folder structure and libraries.
   - `project.md` in each project describes reality and overrides by rule code.
   - `config.json` records the kit version. (It originally toggled whole sections; the only toggle, TypeScript, was removed by decision 6.)
   - Section 6 (Security & data) and section 8 (Definition of Done) **cannot be overridden**.
2. **In-project layout**: kit files live in `.agent-kit/`. `AGENTS.md` is the shared entry point for every tool; `CLAUDE.md` imports files with `@`.
3. **Distribution (later)**: private npm package with a CLI: `init` / `sync` / `profile`. **`postinstall` never invokes AI.** `init` is implemented (`cli/bin/agent-kit.js`), ahead of the roadmap order below. Temporary stopgap while no registry is chosen: the GitHub repo is public, so projects install with `yarn add -D @helloclever/agent-kit-react@<git url>` (see [cli/README.md](cli/README.md)) — `package.json` stays `"private": true` since this is not a real registry publish.
4. **`generate-project-profile` is hybrid**: a script scans deterministic facts first (package.json, lockfile, config files, folder tree, scripts), then the AI writes the profile from those facts. Implemented: `cli/lib/scan.js` → `.agent-kit/facts.json` (run by `agent-kit init` and `agent-kit scan`; no timestamps, sorted, so rescans diff cleanly), `init` prefills Actual stack + Commands in `project.md`, and `skills/generate-project-profile/SKILL.md` (installed to `.claude/skills/`) does the rest. The skill only edits `project.md` and proposes a diff instead of overwriting hand-written content.
5. **Four-layer review**: automated gates (lint/typecheck/test/build) → AI self-review → independent AI reviewer → human review. Plus a feedback loop from review back into rules (label `agent-kit-feedback`, see [contributing](docs/contributing.md)).
6. **TypeScript is required** (see [ADR 0002](docs/adr/0002-typescript-required.md)). `agent-kit init` refuses projects with no `typescript` dependency and no `tsconfig.json`; section 3 is always included; there is no `--no-typescript` option. Skills and rules may assume TypeScript.

## Conventions for this repo

- Rule codes are stable: **never renumber**; retire deleted codes, never reuse them.
- Only write rules for mistakes the AI actually makes. If lint/TypeScript can check it, it goes into lint, not prose.
- Rule levels: MUST / SHOULD / ASK FIRST.
- No internal service names/URLs, infrastructure details, customer data or secrets.
- Every change: update `CHANGELOG.md` and bump `version` in `package.json` per semver (see CHANGELOG header).
- Skills follow `skills/<name>/SKILL.md` (frontmatter `name`, `description`) + optional `examples/`. Installed into `.claude/skills/`.
- Workflows: `workflows/commands/` → `.claude/commands/`; `workflows/hooks/` for automatic scripts.

## Roadmap (in order)

1. Install into a pilot project and use it for real tasks for 1–2 sprints; record where the AI still gets things wrong.
2. Skill `generate-project-profile` (hybrid: fact-scanning script + AI-written profile, marks uncertain items `[needs confirmation]`). First version done (see decision 4); tune it from pilot results.
3. Skill `create-component`.
4. Workflows `/feature`, `/review`, and a lint hook.
5. ESLint baseline, so machine-checkable rules can be removed from prose.
6. CLI and private registry. `agent-kit init` and `agent-kit scan` already exist (see decisions 3 and 4 above); `sync` and choosing/publishing to a real registry are still open.

## Open questions

- Is a public repo acceptable under company policy? Currently public, and the CLI install above relies on that — treat this as a **temporary** stopgap, not a settled answer. If policy says no, the repo needs to go private and installs need to move to Route B (GitHub Packages under an actual `helloclever` org, or another private registry) before `agent-kit init` breaks for every project that depends on it.
- Should the repo move to a GitHub organization? Blocks a real `@helloclever/...` scope on GitHub Packages — see above.
- Which AI tools does the team actually use? Confirmed so far: Claude Code and Codex CLI (`agent-kit init` now writes `AGENTS.md` for Codex/Cursor/Copilot and `CLAUDE.md` for Claude Code).
