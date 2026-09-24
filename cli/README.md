# CLI

- `agent-kit init [--no-typescript] [--force]`: assembles `.agent-kit/core-rules.md` from `rules/core/`, writes `.agent-kit/config.json`, and copies `templates/project.md`, `templates/AGENTS.md` and `templates/CLAUDE.md` into the target project. Existing files are left untouched unless `--force` is passed. Does not invoke AI — `project.md` is still filled in by hand until the `generate-project-profile` skill exists.
- `agent-kit sync` (planned): update core rules, skills and workflows when upgrading. Never touches `project.md`.
- `agent-kit profile --refresh` (planned): rescan the project and propose a diff for `project.md`.

There is no `postinstall` script, and none is planned to invoke AI.

## Install (temporary: public git, no registry)

Not published to any npm registry yet — `package.json` still has `"private": true`, and which registry to use is an open question (see root `CLAUDE.md`). The GitHub repo itself is currently **public**, so in the meantime any project can install straight from it:

```bash
yarn add -D @helloclever/agent-kit-react@https://github.com/luci-huynh/helloclever-agent-kit-react.git
yarn agent-kit init
```

Notes:
- The `@https://...` suffix is required — a bare `yarn add -D @helloclever/agent-kit-react` would try npm's registry and 404, since nothing is published there.
- Pin a version instead of always tracking `main` by appending `#v0.2.0` (a tag) or `#<commit-sha>` to the URL; bump it on purpose when you want the project to pick up kit changes.
- `yarn agent-kit init` runs the bin from `node_modules/.bin`; `npx agent-kit init` works too.
- Because this is a git install (not a registry tarball), the whole repo is copied into `node_modules`, not just the `files` allowlist in `package.json` — harmless, just slightly more than what a real publish would ship.

## Works with both Codex and Claude Code

`agent-kit init` writes both:
- `AGENTS.md` at the project root — read natively by Codex CLI, Cursor, Copilot and other AGENTS.md-aware tools.
- `CLAUDE.md` at the project root — read by Claude Code, and `@`-imports `AGENTS.md`, `.agent-kit/core-rules.md` and `.agent-kit/project.md` so Claude sees the same rules through one entry point.

No tool-specific setup beyond running `init` and committing the generated files.
