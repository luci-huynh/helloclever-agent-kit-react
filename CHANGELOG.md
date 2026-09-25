# Changelog

Follows [Semantic Versioning](https://semver.org/):
- **patch**: wording fixes and rule clarifications that do not change AI behavior.
- **minor**: new rules, skills or workflows.
- **major**: changes that make the AI behave significantly differently, or that change the file layout inside projects.

## [Unreleased]
### Added
- `agent-kit init` now scans the project first (`cli/lib/scan.js`, no AI) and writes `.agent-kit/facts.json`: stack by category, package manager and commands, `tsconfig.json` settings, config files, source tree, and candidate reference files ranked by recent git activity.
- `agent-kit init` prefills **Actual stack** and **Commands** in `.agent-kit/project.md` from the scan, and installs the kit's skills into `.claude/skills/`.
- `agent-kit scan` command: rewrites `.agent-kit/facts.json` only.
- Skill `generate-project-profile`: verifies the scanned facts against the code and drafts the rest of `project.md` (folder structure, reference files, overrides, special notes); proposes a diff instead of overwriting hand-written content.
- ADR 0002: TypeScript is required.
- Core rule **R6.6** (cannot be overridden): never attribute work to an AI coding tool or mention one was used in pushed or posted content (commit messages and `Co-Authored-By` trailers, author identity, branch/tag names, PR titles/descriptions, review comments, release notes, code comments). Section 10 points to it.
- R6.6 enforcement in `agent-kit init`: merges `"attribution": {"commit": "", "pr": ""}` (and the deprecated `"includeCoAuthoredBy": false`) into `.claude/settings.json`, and installs a `commit-msg` git hook (`workflows/hooks/commit-msg.js` → `.agent-kit/hooks/`) that rejects AI attribution in commit messages and AI tool commit authors. Works with husky, `core.hooksPath`, plain `.git/hooks` and monorepo subfolders.
- `agent-kit init` CLI command (`cli/bin/agent-kit.js`): assembles `.agent-kit/core-rules.md`, writes `.agent-kit/config.json`, and copies the project templates (`AGENTS.md` for Codex/Cursor/Copilot, `CLAUDE.md` for Claude Code). Installable now via `yarn add -D @helloclever/agent-kit-react@<git url>` while the repo is public — no registry published yet.
- Core rules section 10, "Git & Pull Requests" (`rules/core/10-git-pr.md`), aligned with Hello Clever's engineering code review + RC/Sandbox/Prod deployment process: branch naming, Conventional Commits, PR title/description structure (ticket, description + impact zone, release notes, rollback plan), standalone PR per QA bug fix, no self-merge without approval, stale-approval-on-new-push, RC/Sandbox/Prod review & merge rules, Prod tag-before-PR + hotfix sync-back, and ask-first gates on staging/committing/pushing/tagging/PR actions.

### Changed
- TypeScript is required: `agent-kit init` stops if the project has no TypeScript, the `--no-typescript` option is removed, and `config.json` no longer has `core.typescript`.
- `templates/project.md`: `Language` replaced by `TypeScript`; added `Package manager`, `i18n`, `Lint / format` and `Import aliases` lines.

## [0.1.1] - 2026-09-24
### Changed
- Translated all kit content to English.
- Added a root `CLAUDE.md` with repo context for AI agents working on the kit itself (not packaged).

## [0.1.0] - 2026-09-24
### Added
- Core rules v0.1 (9 sections, with rule codes).
- Project templates: `AGENTS.md`, `CLAUDE.md`, `project.md`, `config.json`.
- Contribution process, PR template, ADR 0001.
