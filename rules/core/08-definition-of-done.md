## 8. Definition of Done

_Cannot be overridden by `project.md`._

Only report a task as done when all of the following hold:

- **R8.1** Lint, typecheck, tests and build all pass (exact commands in `project.md`). If something fails, fix it; do not disable rules or skip tests.
- **R8.2** No leftover `console.log`, commented-out code, or TODOs that were not requested.
- **R8.3** You have checked your diff against the core rules and `project.md`.
- **R8.4** You send a summary covering:
  - What changed and why.
  - How you verified it.
  - What is not done yet or needs human confirmation.
  - Problems found outside the task's scope (if any).

