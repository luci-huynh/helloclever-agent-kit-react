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
| `cli/` | `init` / `sync` / `profile` commands. _Planned._ |
| `docs/` | ADRs and the contribution process. |

## Install into a project (manual, pilot phase)

Run at the root of the target project:

```bash
KIT=/path/to/agent-kit-react
mkdir -p .agent-kit
cat $KIT/rules/core/*.md > .agent-kit/core-rules.md
cp $KIT/templates/project.md $KIT/templates/config.json .agent-kit/
cp $KIT/templates/AGENTS.md $KIT/templates/CLAUDE.md .
```

For projects without TypeScript: leave out `03-typescript.md` when concatenating.

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
