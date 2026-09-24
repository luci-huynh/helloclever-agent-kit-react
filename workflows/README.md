# Workflows

- `commands/`: multi-step slash commands with checkpoints that wait for human approval. Installed into `.claude/commands/`.
- `hooks/`: scripts that run automatically (for example lint + typecheck after the AI edits a file).

## Plan
- [ ] `/feature`: requirement → plan (wait for approval) → code → lint/typecheck/test → self-review → PR summary
- [ ] `/review`: independent AI reviewer; output grouped as blocking / should fix / suggestion, citing rule codes
- [ ] Hook: lint + typecheck on file edit
