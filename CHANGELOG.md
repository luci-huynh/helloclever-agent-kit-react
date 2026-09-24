# Changelog

Follows [Semantic Versioning](https://semver.org/):
- **patch**: wording fixes and rule clarifications that do not change AI behavior.
- **minor**: new rules, skills or workflows.
- **major**: changes that make the AI behave significantly differently, or that change the file layout inside projects.

## [Unreleased]
### Added
- `agent-kit init` CLI command (`cli/bin/agent-kit.js`): assembles `.agent-kit/core-rules.md`, writes `.agent-kit/config.json`, and copies the project templates (`AGENTS.md` for Codex/Cursor/Copilot, `CLAUDE.md` for Claude Code). Installable now via `yarn add -D @helloclever/agent-kit-react@<git url>` while the repo is public — no registry published yet.

## [0.1.1] - 2026-09-24
### Changed
- Translated all kit content to English.
- Added a root `CLAUDE.md` with repo context for AI agents working on the kit itself (not packaged).

## [0.1.0] - 2026-09-24
### Added
- Core rules v0.1 (9 sections, with rule codes).
- Project templates: `AGENTS.md`, `CLAUDE.md`, `project.md`, `config.json`.
- Contribution process, PR template, ADR 0001.
