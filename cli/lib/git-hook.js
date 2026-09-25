'use strict';

// Wires the kit's commit-msg check (workflows/hooks/commit-msg.js) into the project's git hooks.
// The script itself is copied to .agent-kit/hooks/; the hook file only gets one line calling it,
// so an existing commit-msg hook (husky or hand-written) keeps working.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { writeIfChanged, relTo } = require('./install');

const MARKER = '# agent-kit: R6.6 no AI attribution';

function git(cwd, args) {
  try {
    return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

// Where the commit-msg hook should live. Each target says whether it is committed (shared with the team).
function resolveHookFiles(topLevel) {
  const hooksPath = git(topLevel, 'config core.hooksPath');
  const gitHooksDir = path.resolve(topLevel, git(topLevel, 'rev-parse --git-path hooks') || '.git/hooks');
  if (fs.existsSync(path.join(topLevel, '.husky'))) {
    const targets = [{ file: path.join(topLevel, '.husky', 'commit-msg'), shared: true }];
    // husky activates itself (sets core.hooksPath) in `prepare`, which runs after postinstall on a fresh
    // clone, or not at all if husky was removed. Cover that window with a local hook as well.
    if (!hooksPath) targets.push({ file: path.join(gitHooksDir, 'commit-msg'), shared: false });
    return targets;
  }
  if (hooksPath) {
    return [{ file: path.join(path.resolve(topLevel, hooksPath), 'commit-msg'), shared: !hooksPath.startsWith('.git') }];
  }
  return [{ file: path.join(gitHooksDir, 'commit-msg'), shared: false }];
}

function addHookLine(file, hookLine) {
  const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n') : ['#!/usr/bin/env sh', ''];
  const existing = lines.findIndex((line) => line.includes(MARKER));
  if (existing !== -1) {
    lines[existing] = hookLine;
  } else {
    // Insert right after the shebang and any husky bootstrap line, so a later `exit` cannot skip it.
    let insertAt = 0;
    while (insertAt < lines.length && /^(#!|\. ")/.test(lines[insertAt])) insertAt++;
    lines.splice(insertAt, 0, hookLine);
  }
  return writeIfChanged(file, lines.join('\n'), 0o755);
}

// Returns { entries, localOnly }. localOnly: the hook lives in .git/hooks, so it is not shared via the repo.
function installCommitMsgHook(kitRoot, projectRoot) {
  const topLevel = git(projectRoot, 'rev-parse --show-toplevel');
  if (!topLevel) {
    return { entries: [{ path: 'git hook', status: 'skipped', note: 'not a git repository' }], localOnly: false };
  }

  const scriptDest = path.join(projectRoot, '.agent-kit', 'hooks', 'commit-msg.js');
  const script = fs.readFileSync(path.join(kitRoot, 'workflows', 'hooks', 'commit-msg.js'), 'utf8');
  const entries = [{ path: relTo(projectRoot, scriptDest), status: writeIfChanged(scriptDest, script) }];

  // Git runs hooks from the repository top level; the project may be a subfolder (monorepo).
  // `|| exit 1` is required: hook scripts usually run without `set -e`, so a later `exit 0` would swallow the failure.
  const hookLine = `node "${relTo(topLevel, scriptDest)}" "$1" || exit 1 ${MARKER}`;
  const targets = resolveHookFiles(topLevel);
  for (const { file, shared } of targets) {
    const entry = { path: relTo(projectRoot, file), status: addHookLine(file, hookLine) };
    if (!shared) Object.assign(entry, { local: true, note: 'local to this clone, not committed' });
    entries.push(entry);
  }
  return { entries, localOnly: !targets.some((t) => t.shared) };
}

module.exports = { installCommitMsgHook };
