# @helloclever/agent-kit-react

Rules, skills and workflows that help AI coding agents (Claude Code, Cursor, Copilot…) work to standard in Hello Clever's React frontend projects.

> Status: **v0.1 — pilot**. No CLI yet; install manually as described below.

## Contents

| Folder | Contents |
|---|---|
| `rules/core/` | Core rules shared by every React project, split into sections; every rule has a code (`R2.3`). |
| `skills/` | Instructions for specific kinds of task (create a component, integrate an API…). _In progress._ |
| `workflows/` | Slash commands (`/feature`, `/review`) and hooks. _In progress._ |
| `templates/` | Files created in a project on install. |
| `cli/` | `agent-kit init` (working). `sync` / `profile` _planned._ |
| `docs/` | ADRs and the contribution process. |

## Install into a project (pilot phase — temporary public-git install, no registry)

Not published to a registry yet, but the repo is currently public, so `yarn add` can install straight from git:

```bash
yarn add -D @helloclever/agent-kit-react@https://github.com/luci-huynh/helloclever-agent-kit-react.git
yarn agent-kit init
# projects without TypeScript:
yarn agent-kit init --no-typescript
```

This assembles `.agent-kit/core-rules.md`, writes `.agent-kit/config.json`, and copies `templates/project.md`, `templates/AGENTS.md` and `templates/CLAUDE.md` into the project (existing files are left alone; pass `--force` to overwrite). `AGENTS.md` is read by Codex CLI and other AGENTS.md-aware tools; `CLAUDE.md` is read by Claude Code and imports the rest — see [cli/README.md](cli/README.md) for details and version pinning.

Then fill in `.agent-kit/project.md` (stack, structure, reference files, commands, overrides) and commit everything to the project repo.

## Layout in a project after install

```
project/
├── AGENTS.md              # entry point for Cursor, Codex, Copilot…
├── CLAUDE.md              # entry point for Claude Code (imports the files below)
└── .agent-kit/
    ├── core-rules.md      # assembled from rules/core — DO NOT edit by hand
    ├── project.md         # project-specific — maintained by the team
    └── config.json        # kit version, core sections on/off
```

## Per-project customization

- **Describe reality** in `project.md`.
- **Override a specific rule** by its code, in the "Override core rules" section of `project.md`.
- **Turn off a whole section** (for example TypeScript) in `config.json`.
- **Folder-scoped rules**: add a small `AGENTS.md` in a subfolder (for example `src/legacy/`).

Never edit `core-rules.md` inside a project. To change core rules, open a PR in this repo — see [docs/contributing.md](docs/contributing.md).
