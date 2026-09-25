# Workflows

- `commands/`: multi-step slash commands with checkpoints that wait for human approval. Installed into `.claude/commands/`.
- `hooks/`: scripts that run automatically (for example lint + typecheck after the AI edits a file).
  - `commit-msg.js`: git hook that rejects commits crediting an AI tool (core rule R6.6). Installed by `agent-kit init`, see [cli/README.md](../cli/README.md#blocking-ai-attribution-r66).

## Plan
- [ ] `/feature`: requirement → plan (wait for approval) → code → lint/typecheck/test → self-review → PR summary
- [ ] `/review`: independent AI reviewer; output grouped as blocking / should fix / suggestion, citing rule codes
- [ ] Hook: lint + typecheck on file edit
