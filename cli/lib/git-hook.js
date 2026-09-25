'use strict';

// Wires the kit's commit-msg check (workflows/hooks/commit-msg.js) into the project's git hooks.
// The script itself is copied to .agent-kit/hooks/; the hook file only gets one line calling it,
// so an existing commit-msg hook (husky or hand-written) keeps working.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MARKER = '# agent-kit: R6.6 no AI attribution';

function git(cwd, args) {
  try {
    return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

// Where the commit-msg hook should live, and whether that location is committed (shared with the team).
function resolveHookFile(topLevel) {
  if (fs.existsSync(path.join(topLevel, '.husky'))) {
    return { file: path.join(topLevel, '.husky', 'commit-msg'), shared: true };
  }
  const hooksPath = git(topLevel, 'config core.hooksPath');
  if (hooksPath) {
    return { file: path.join(path.resolve(topLevel, hooksPath), 'commit-msg'), shared: !hooksPath.startsWith('.git') };
  }
  const gitHooksDir = git(topLevel, 'rev-parse --git-path hooks');
  return { file: path.join(path.resolve(topLevel, gitHooksDir || '.git/hooks'), 'commit-msg'), shared: false };
}

function installCommitMsgHook(kitRoot, projectRoot, log) {
  const topLevel = git(projectRoot, 'rev-parse --show-toplevel');
  if (!topLevel) {
    log('  skip git hook: not a git repository');
    return;
  }

  const scriptDest = path.join(projectRoot, '.agent-kit', 'hooks', 'commit-msg.js');
  fs.mkdirSync(path.dirname(scriptDest), { recursive: true });
  fs.copyFileSync(path.join(kitRoot, 'workflows', 'hooks', 'commit-msg.js'), scriptDest);
  log(`  wrote ${path.relative(projectRoot, scriptDest)}`);

  // Git runs hooks from the repository top level; the project may be a subfolder (monorepo).
  const scriptFromTop = path.relative(topLevel, scriptDest).split(path.sep).join('/');
  const hookLine = `node "${scriptFromTop}" "$1" ${MARKER}`;
  const { file, shared } = resolveHookFile(topLevel);
  const rel = path.relative(projectRoot, file);

  let lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n') : ['#!/usr/bin/env sh', ''];
  const existing = lines.findIndex((line) => line.includes(MARKER));
  if (existing !== -1) {
    lines[existing] = hookLine;
  } else {
    // Insert right after the shebang and any husky bootstrap line, so a later `exit` cannot skip it.
    let insertAt = 0;
    while (insertAt < lines.length && /^(#!|\. ")/.test(lines[insertAt])) insertAt++;
    lines.splice(insertAt, 0, hookLine);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join('\n'));
  fs.chmodSync(file, 0o755);
  log(`  wrote ${rel} (${existing !== -1 ? 'updated' : 'added'} commit-msg check)`);
  if (!shared) {
    log('  note: this hook is local to your clone. Each developer runs `agent-kit init` once,');
    log('        or the project adopts husky so the hook is committed and shared.');
  }
}

module.exports = { installCommitMsgHook };
