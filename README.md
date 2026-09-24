# @helloclever/agent-kit-react

Rules, skills and workflows that help AI coding agents (Claude Code, Cursor, Copilot…) work to standard in Hello Clever's React frontend projects.

## Contents

| Folder | Contents |
|---|---|
| `rules/core/` | Core rules shared by every React project, split into sections; every rule has a code (`R2.3`). |
| `skills/` | Instructions for specific kinds of task (create a component, integrate an API…). _In progress._ |
| `workflows/` | Slash commands (`/feature`, `/review`) and hooks. _In progress._ |
| `templates/` | Files created in a project on install. |
| `cli/` | `agent-kit init` (working). `sync` / `profile` _planned._ |
| `docs/` | ADRs and the contribution process. |

## Requirements

- React frontend project written in **TypeScript**. The TypeScript rules (section 3) are always included.
- Node.js and Yarn.

## Install into a project

```bash
yarn add -D @helloclever/agent-kit-react@https://github.com/luci-huynh/helloclever-agent-kit-react.git
yarn agent-kit init
```

To pin a specific kit version, append `#<commit-sha>` to the URL and bump it when you want the project to pick up kit changes.

`init` assembles `.agent-kit/core-rules.md`, writes `.agent-kit/config.json`, and copies `templates/project.md`, `templates/AGENTS.md` and `templates/CLAUDE.md` into the project. Existing files are left alone; pass `--force` to overwrite. `AGENTS.md` is read by Codex, Cursor, Copilot and other AGENTS.md-aware tools; `CLAUDE.md` is read by Claude Code and imports the rest. See [cli/README.md](cli/README.md) for details.

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
- **Folder-scoped rules**: add a small `AGENTS.md` in a subfolder (for example `src/legacy/`).

Never edit `core-rules.md` inside a project. To change core rules, open a PR in this repo — see [docs/contributing.md](docs/contributing.md).
