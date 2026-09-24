# Contributing to agent-kit-react

## When to propose a change

When the AI makes **the same mistake a second time** (caught by a human or AI reviewer), or when an existing rule is misleading or no longer useful. In project PR reviews, label such comments `agent-kit-feedback` so they can be collected periodically.

## Where it goes

Pick in this order and stop at the first level that fits:

1. **Lint / TypeScript config**: if a machine can check it. Do not write it as a prose rule.
2. **Core rules** (`rules/core/`): if it holds for every React project.
3. **Skill** (`skills/`): if it only concerns one kind of task.
4. **That project's `project.md`**: if it only holds for one project. Do not open a PR here.

## How to write a rule

- Be specific and verifiable. "Write clean code" is useless; "split a component once it exceeds about 200 lines" is usable.
- Only write down things the AI actually gets wrong. Every extra line dilutes the important ones.
- Assign the right level: MUST, SHOULD or ASK FIRST.
- Use the next rule code in that section (`R<section>.<number>`). **Never renumber** existing rules, because projects override by code. When a rule is deleted, retire its code; do not reuse it.

## Keep out of this repo

Many people may read this repo. Do not include internal service names or URLs, infrastructure details, customer data, secrets, or details specific to one project. Those belong in the `project.md` of each project repo.

## Process

1. Create a branch, make the change, update `CHANGELOG.md` and `version` in `package.json` per semver.
2. Open a PR and fill in the template.
3. An owner (see `.github/CODEOWNERS`) approves before merge.
4. About every 2 weeks, the owner reviews collected feedback and prunes rules that no longer help.
