## 10. Git & Pull Requests

_No AI attribution in commits, PRs or anything else you push: see **R6.6** (cannot be overridden)._

**MUST**
- **R10.1** Branch names: `<type>/<ticket-id>-<short-description>`, with `<type>` one of `feat/`, `fix/`, `hotfix/`, `chore/`. A sprint branch is named `s<sprint-no>/<sprint-name>`.
- **R10.2** Commit messages follow Conventional Commits: `<type>(<scope>): <description>`. Common types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`.
- **R10.3** PR title: `[<type>] <ticket-id>: <short description>`.
- **R10.4** PR description covers, in order: **Ticket** (id/link) · **Description** (bullet summary, plus an explicit **Impact Zone**: modules/APIs/DB tables/features touched) · **Release Notes** (env vars, scripts/backfills — omit this section entirely if none apply) · **Rollback Plan**. Never paste a real secret value into a PR description — use a placeholder and share the value out of band.
- **R10.5** A bug found during QA gets its own standalone PR. Never fold a QA-phase fix into an unrelated PR.
- **R10.6** One PR = one scope / one logical change. Don't bundle unrelated changes into the same PR.
- **R10.7** Never push directly to a protected branch — `RC`, `Sandbox`, `Prod` (or whatever `project.md` names them). All changes to those branches go through a PR.
- **R10.8** Never merge a PR (including your own) before it has at least one reviewer's approval and every review comment is resolved.
- **R10.9** If new commits land on a PR after it was approved, treat the approval as stale — it needs re-review before merging.
- **R10.10** A PR into `Prod` — normal release or hotfix — requires a Git tag on the release commit, created and pushed *before* the PR is opened, and a Team Lead review before merge.
- **R10.11** After a `Prod` hotfix is merged, sync the fix back into the other active branches (`Sandbox`, `RC`, current sprint branch) so they don't drift from `Prod`.
- **R10.12** Never commit secrets, credentials or internal-only URLs. After a broad `git add`, check what actually got staged before committing.
- **R10.13** Before any command that can discard uncommitted work (`checkout`/`restore`/`reset --hard`/`clean`), run `git status` first and stash or commit what is there.
- **R10.14** Never skip hooks (`--no-verify`) or bypass commit signing unless the user explicitly asks.

**SHOULD**
- **R10.15** Pull/rebase onto the latest target branch before opening a PR. Keep commits small and focused — one logical change per commit.
- **R10.16** Link every ticket the PR addresses. For a release PR (sprint branch → `Sandbox`/`Prod`), list every ticket it bundles and flag any missing env var or backfill script before it is approved.
- **R10.17** Route PRs by target: `Feature → PR → RC` needs peer review only (no mandatory Team Lead); `RC`/`Feature → PR → Sandbox` and any PR into `Sandbox` or `Prod` needs a Team Lead assigned as reviewer.
- **R10.18** A `hotfix/` branch is cut from the latest release tag, not from the sprint or `RC` branch.
- **R10.19** `Sandbox` deploys from the `Sandbox` branch by default. If it must deploy from another branch temporarily, that needs the Team Lead's sign-off first, and the deploy config should move back to `Sandbox` once testing is done.

**ASK FIRST**
- **R10.20** Staging (`git add`) or committing changes. Wait for the user's explicit go-ahead rather than doing it as an automatic part of finishing a task.
- **R10.21** Pushing any commit, new or amended, to a remote branch — including a branch pushed earlier in the same task.
- **R10.22** Creating, approving, merging or closing a pull request.
- **R10.23** Force-pushing, deleting a branch, or any history-rewriting operation on a branch that has already been pushed.
- **R10.24** Cutting or pushing a release tag, changing what branch an environment deploys from, or rolling back a deployed release.
