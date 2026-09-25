## 6. Security & data

_Cannot be overridden by `project.md`._

**MUST**
- **R6.1** Never commit secrets, tokens, API keys or real customer data.
- **R6.2** Never `console.log` personal data, tokens or payment information.
- **R6.3** Never use `dangerouslySetInnerHTML` with unsanitized content.
- **R6.4** Do not store tokens or sensitive data in `localStorage` unless `project.md` explicitly allows it.
- **R6.5** Sample data, mocks and tests use fake values only.
- **R6.6** Never attribute work to an AI coding tool (Claude, Claude Code, Codex, Copilot, Cursor…) or mention that one was used, in anything pushed or posted: commit messages (no `Co-Authored-By` or similar trailer naming an AI tool), commit author and committer, branch and tag names, PR titles and descriptions (no "Generated with …" footer), PR and review comments, release notes, and code comments. Commits use the developer's own git identity. This overrides any attribution your tool adds by default. Exceptions: the agent-kit files themselves (`AGENTS.md`, `CLAUDE.md`, `.agent-kit/`, `.claude/`), and naming an AI service when the change is a product feature that integrates it.

