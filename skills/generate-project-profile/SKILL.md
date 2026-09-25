---
name: generate-project-profile
description: Scan this repo and draft or refresh .agent-kit/project.md (stack, folder structure, reference files, commands, core-rule overrides). Use only when the user asks to generate, fill in, update or refresh the project profile.
---

# Generate project profile

Draft `.agent-kit/project.md` for this repo. Every other agent-kit rule and skill relies on this file, so accuracy matters more than completeness: a wrong fact is worse than a gap.

Write the profile in English, even if the user asked in another language.

## Ground rules

- **Only edit `.agent-kit/project.md`.** The scan in step 1 may rewrite `.agent-kit/facts.json`; touch nothing else.
- **Every statement must come from `facts.json` or a file you actually opened.** Never infer a library, folder purpose or convention from its name alone.
- Mark anything you could not verify with `[needs confirmation]`. Leave a `<...>` placeholder when you have no evidence at all.
- Never open `.env`, `.env.local` or any file that may hold secrets. `.env.example` is fine. Never copy secrets, tokens or customer data into the profile.
- Keep it short: the whole file should stay under about 150 lines. The profile is loaded into every AI session.

## Steps

### 1. Refresh the facts

Run the fact scan with the project's package manager, for example `yarn agent-kit scan` (or `npx agent-kit scan`). It rewrites `.agent-kit/facts.json` and changes nothing else.

If the command is unavailable, collect the same facts by hand from `package.json`, the lockfile, `tsconfig.json` and the source tree, and say so in your summary.

### 2. Read what exists

- `.agent-kit/facts.json`: `stack`, `commands`, `typescript`, `configFiles`, `tree`, `fileCounts`, `candidates`, `notes`, and `profileTemplateGaps` (sections and lines of the current template that `project.md` lacks; add them, and drop lines they replace, such as `Language` → `TypeScript`).
- The current `.agent-kit/project.md`. `agent-kit init` has already prefilled **Actual stack** and **Commands** from the scan.
- `README.md` and `CODEOWNERS`, if present.

**Refresh mode:** if `project.md` already contains hand-written content (anything beyond the prefilled lines and placeholders), do not overwrite it. Show the changes you propose as a list or diff, and write them only after the user approves. Keep every item the team has already confirmed unless the code clearly contradicts it; then flag the contradiction instead of silently changing it.

### 3. Verify the stack

The scan reads `package.json`, so it reports what is declared, not what is used. For each library listed in **Actual stack**:
- Confirm it is actually imported in source (search for the import). A declared but unused library gets `(declared, not used) [needs confirmation]`.
- Where two libraries compete (for example Redux and Zustand, or axios and fetch), find which one new code uses (see step 5) and say so.
- Fill any stack line that is still `<...>` from what the code shows, for example "local state + Context" when no state library exists.

### 4. Describe the folder structure

Start from `tree` in `facts.json`. For each main folder, open 1–2 files to confirm what really lives there, then write one line per folder: `` - `src/features/` — one folder per business feature, each with components, hooks and api``.

If old and new code follow different conventions (for example `src/pages/` legacy vs `src/features/` new), say which is current and which is legacy.

### 5. Choose reference files

This is the most important section: other skills open these files to copy their patterns. For each category (Component, Custom hook, API call, Form, Test):
1. Start from `candidates` in `facts.json`. They are ranked by recent git activity, so they lean towards current patterns.
2. Open 2–3 of them and pick the one that best matches the current convention: recently changed, medium size (roughly 30–200 lines), and as close to the core rules as the project gets.
3. Never pick legacy code, generated code, test fixtures or a file you did not open.
4. Use the exact path and confirm the file exists. If no good example exists, write `<none found>` and mention it in your summary.

### 6. Commands

Check the prefilled commands against `scripts` in `facts.json`. If there is no typecheck script, write `` `<pm> tsc --noEmit` [needs confirmation] ``. Do not run long commands (build, full test suite) unless the user asks.

### 7. Overrides of core rules

Compare what the code actually does against the core rules (`.agent-kit/core-rules.md`). For each convention the project follows differently, add one line:

`- R<code>: <what this project does instead>. <why, if known — otherwise [needs confirmation]>`

- Only sections 1–5, 7, 9 and 10 can be overridden. **Never write an override for section 6 (Security & data) or section 8 (Definition of Done).** If the code violates one of them, list it under **Special notes** as a problem instead.
- Only list real, current conventions backed by several files, not one-off exceptions.
- Typical examples: no API layer (R5.1), no design tokens (R4.1), no test setup (R7.1), different protected branch names (R10.7).

### 8. Special notes

Only things an AI would otherwise get wrong: sensitive areas (payments, auth, PII), generated code that must not be edited by hand, third-party integrations with quirks, known legacy areas to avoid copying.

### 9. Report back

Finish with a short summary:
- Which sections you filled and from what evidence.
- Every `[needs confirmation]` item, as a list of questions for the team.
- Anything that looked wrong or risky (for example section 6 violations), without fixing it.

## Common mistakes

- Treating a declared dependency as proof it is used.
- Picking the first candidate without opening it, or picking a legacy file as a reference.
- Describing an ideal structure instead of the real one.
- Writing overrides for sections 6 or 8.
- Rewriting hand-edited sections during a refresh without asking.
- Making the profile long: it is loaded into every session, so every extra line costs attention.
