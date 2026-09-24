# CLI (planned)

Planned commands:
- `agent-kit init`: copy templates, assemble core rules according to `config.json`, and ask whether to run AI to generate `project.md`.
- `agent-kit sync`: update core rules, skills and workflows when upgrading. Never touches `project.md`.
- `agent-kit profile --refresh`: rescan the project and propose a diff for `project.md`.

`postinstall` never invokes AI.

Pilot phase: install manually following the root README.
