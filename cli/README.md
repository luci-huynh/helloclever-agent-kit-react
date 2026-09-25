# CLI

- `agent-kit init [--force]`:
  1. Scans the project (see below) and writes `.agent-kit/facts.json`. Stops with an error if the project has no TypeScript (no `typescript` dependency and no `tsconfig.json`).
  2. Assembles `.agent-kit/core-rules.md` from all of `rules/core/`.
  3. Writes `.agent-kit/config.json` and `.agent-kit/project.md` from `templates/`, with **Actual stack** and **Commands** in `project.md` prefilled from the scan.
  4. Copies `templates/AGENTS.md` and `templates/CLAUDE.md` to the project root.
  5. Installs every `skills/<name>/` that has a `SKILL.md` into `.claude/skills/<name>/`.
  6. Turns off AI attribution (core rule R6.6), see below.

  `core-rules.md`, `facts.json`, `hooks/commit-msg.js` and `.claude/skills/<name>/` are kit-owned and rewritten on every run. `config.json`, `project.md`, `AGENTS.md` and `CLAUDE.md` are left untouched if they exist, unless `--force` is passed.
- `agent-kit scan`: reruns the scan and rewrites `.agent-kit/facts.json` only. The `generate-project-profile` skill runs this first.
- `agent-kit sync` (planned): update core rules, skills and workflows when upgrading. Never touches `project.md`.

Neither command invokes AI. There is no `postinstall` script, and none is planned to invoke AI. Refreshing `project.md` from new facts is done by the `generate-project-profile` skill, which proposes changes instead of overwriting hand-written content.

## Blocking AI attribution (R6.6)

Core rule R6.6 (cannot be overridden) forbids crediting an AI tool in anything pushed or posted. A prose rule is not enough, because tools add attribution on their own, so `init` also enforces it:

- **Claude Code settings.** Merges `"attribution": {"commit": "", "pr": ""}` and the deprecated `"includeCoAuthoredBy": false` (for older versions) into the committed `.claude/settings.json`, keeping every other key. This turns off Claude Code's `Co-Authored-By` trailer and "Generated with Claude Code" PR footer for the whole team.
- **`commit-msg` git hook.** Copies `workflows/hooks/commit-msg.js` to `.agent-kit/hooks/commit-msg.js` and adds one line calling it to the project's `commit-msg` hook, placed before any existing commands so an `exit` cannot skip it. The check rejects AI `Co-Authored-By`/`Generated-by` trailers, "generated with/by <AI tool>" footers, Claude/Anthropic/ChatGPT links, the 🤖 footer emoji, and an AI tool as commit author. It matches attribution patterns only, so a commit about `CLAUDE.md` or about a feature that integrates an AI API still passes. It catches any tool, not just Claude Code.
  - Hook location: `.husky/commit-msg` if the project has `.husky/` (committed, shared with the team); otherwise the directory in `core.hooksPath`; otherwise `.git/hooks/commit-msg`, which is local to each clone, so every developer must run `agent-kit init` once.
  - Running `init` again updates the line in place; it never adds a second one.

Limits: a developer can override the setting in `.claude/settings.local.json` or skip the hook with `--no-verify` (itself forbidden by R10.14), and neither covers PR descriptions written by other tools. For hard enforcement, set `attribution` in Claude Code managed settings (organization policy, cannot be overridden) and add a CI check on commit messages and PR descriptions.

## What the scan collects

`cli/lib/scan.js` reads only local files, with no network access and no AI. Output is deterministic (sorted, no timestamps), so rescans produce clean diffs.

- `package.json`: name, description, scripts, and known libraries by category (build, router, state, data fetching, styling, forms, validation, testing, UI library, i18n, lint/format). Versions come from `node_modules` when installed, otherwise from the declared range.
- Package manager (from `packageManager` or the lockfile) and the run command for dev / lint / typecheck / test / build.
- `tsconfig.json`: TypeScript version, `strict`, `extends`, path aliases.
- Known config files at the root (Vite, Next, ESLint, Prettier, Tailwind, Jest/Vitest, Playwright, `.env.example`, CI workflows…). `.env` files other than examples are never read.
- Source tree: file counts per extension, the first two folder levels under `src/` with file counts, and up to 5 candidate reference files per category (component, hook, API, form, test), ranked by recent git activity.
- `notes`: anything worth a human look, such as a missing typecheck script or a monorepo root.

The scan reports what is **declared**; the skill checks what is actually **used**.

## Install (temporary: public git, no registry)

Not published to any npm registry yet — `package.json` still has `"private": true`, and which registry to use is an open question (see root `CLAUDE.md`). The GitHub repo itself is currently **public**, so in the meantime any project can install straight from it:

```bash
yarn add -D @helloclever/agent-kit-react@https://github.com/luci-huynh/helloclever-agent-kit-react.git
yarn agent-kit init
```

Notes:
- The `@https://...` suffix is required — a bare `yarn add -D @helloclever/agent-kit-react` would try npm's registry and 404, since nothing is published there.
- Pin a commit instead of always tracking `main` by appending `#<commit-sha>` to the URL (no version tags are cut during the demo phase — see `CHANGELOG.md`'s `[Unreleased]` section); bump it on purpose when you want the project to pick up kit changes.
- `yarn agent-kit init` runs the bin from `node_modules/.bin`; `npx agent-kit init` works too.
- Because this is a git install (not a registry tarball), the whole repo is copied into `node_modules`, not just the `files` allowlist in `package.json` — harmless, just slightly more than what a real publish would ship.

## Works with both Codex and Claude Code

`agent-kit init` writes both:
- `AGENTS.md` at the project root — read natively by Codex CLI, Cursor, Copilot and other AGENTS.md-aware tools.
- `CLAUDE.md` at the project root — read by Claude Code, and `@`-imports `AGENTS.md`, `.agent-kit/core-rules.md` and `.agent-kit/project.md` so Claude sees the same rules through one entry point.

No tool-specific setup beyond running `init` and committing the generated files.
