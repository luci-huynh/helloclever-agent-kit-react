## 10. Git & Pull Requests

**MUST**
- **R10.1** Never push to a remote branch — including a branch pushed earlier in the same task — without explicit confirmation for that specific push. An earlier "push" request does not carry over to later commits.
- **R10.2** Never force-push, rebase a pushed branch, or amend a pushed commit without explicit confirmation.
- **R10.3** Before any command that can discard uncommitted work (`checkout`/`restore`/`reset --hard`/`clean`), run `git status` first and stash or commit what is there.
- **R10.4** Never skip hooks (`--no-verify`) or bypass commit signing unless the user explicitly asks.
- **R10.5** Commit message: short imperative summary line, Conventional Commits prefix (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`), body explains *why*, not what the diff already shows.
- **R10.6** Never commit secrets, credentials, or internal-only URLs. After a broad `git add`, review what got staged before committing.

**SHOULD**
- **R10.7** Pull/rebase onto the latest target branch before opening a PR. Keep commits small and focused — one logical change per commit.
- **R10.8** PR description covers: what changed, why, how it was verified, and what is left undone. Follow the repo's PR template when one exists.
- **R10.9** Link the related issue/ticket in the PR description when one exists.

**ASK FIRST**
- **R10.10** Pushing any commit, new or amended, to a remote branch.
- **R10.11** Creating, merging or closing a pull request.
- **R10.12** Force-pushing, deleting a branch, or any history-rewriting operation on a branch that has already been pushed.
