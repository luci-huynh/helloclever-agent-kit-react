# @helloclever/agent-kit-react

Rules, skills and workflows that help AI coding agents (Claude Code, Cursor, Copilot…) work to standard in Hello Clever's React frontend projects.

## Contents

| Folder | Contents |
|---|---|
| `rules/core/` | Core rules shared by every React project, split into sections; every rule has a code (`R2.3`). |
| `skills/` | Instructions for specific kinds of task. `generate-project-profile` is available; more are in progress. |
| `workflows/` | Slash commands (`/feature`, `/review`) and hooks. _In progress._ |
| `templates/` | Files created in a project on install. |
| `cli/` | `agent-kit init` and `agent-kit scan`. `sync` is planned. |
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

`init` does three things:

1. **Scans the project** without AI: `package.json`, lockfile, `tsconfig.json`, config files, scripts and the source tree. The facts go to `.agent-kit/facts.json`. If the project has no TypeScript, `init` stops here.
2. **Installs the kit**: assembles `.agent-kit/core-rules.md`, writes `.agent-kit/config.json`, creates `.agent-kit/project.md` with **Actual stack** and **Commands** prefilled from the scan, copies `AGENTS.md` and `CLAUDE.md` to the project root, and installs the kit's skills into `.claude/skills/`.
3. **Blocks AI attribution** (core rule R6.6): turns off Claude Code's commit trailer and PR footer in `.claude/settings.json`, and adds a `commit-msg` git hook that rejects commits crediting an AI tool (for example `Co-Authored-By: Claude …` or "Generated with …").

Existing `config.json`, `project.md`, `AGENTS.md` and `CLAUDE.md` are left alone; pass `--force` to overwrite them. `AGENTS.md` is read by Codex, Cursor, Copilot and other AGENTS.md-aware tools; `CLAUDE.md` is read by Claude Code and imports the rest. See [cli/README.md](cli/README.md) for details.

## Complete the project profile

The scan cannot tell what folders are for, which files are good examples, or where the project departs from the core rules. Let the AI draft that part:

- **Claude Code**: run `/generate-project-profile`.
- **Other tools**: ask the agent to follow `.claude/skills/generate-project-profile/SKILL.md`.

The skill verifies the scanned stack against the code, describes the folder structure, picks reference files, and proposes core-rule overrides. It only edits `.agent-kit/project.md` and marks anything it could not verify with `[needs confirmation]`. Review those items with the team, then commit `.agent-kit/`, `.claude/`, `AGENTS.md` and `CLAUDE.md` to the project repo (plus `.husky/commit-msg` if the project uses husky).

To refresh the facts later (for example after upgrading dependencies), run `yarn agent-kit scan`, then run the skill again: it proposes changes instead of overwriting hand-written content.

## Layout in a project after install

```
project/
├── AGENTS.md              # entry point for Cursor, Codex, Copilot…
├── CLAUDE.md              # entry point for Claude Code (imports the files below)
├── .claude/
│   ├── settings.json      # init turns AI attribution off here; the team's other settings are kept
│   └── skills/            # kit skills — refreshed by init, DO NOT edit by hand
└── .agent-kit/
    ├── core-rules.md      # assembled from rules/core — DO NOT edit by hand
    ├── facts.json         # output of the scan — regenerated, DO NOT edit by hand
    ├── hooks/             # commit-msg check called by the git hook — DO NOT edit by hand
    ├── project.md         # project-specific — maintained by the team
    └── config.json        # kit version
```

## Per-project customization

- **Describe reality** in `project.md`.
- **Override a specific rule** by its code, in the "Override core rules" section of `project.md`.
- **Folder-scoped rules**: add a small `AGENTS.md` in a subfolder (for example `src/legacy/`).

Never edit `core-rules.md` inside a project. To change core rules, open a PR in this repo — see [docs/contributing.md](docs/contributing.md).
