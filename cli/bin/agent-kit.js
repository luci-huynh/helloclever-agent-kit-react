#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { scanProject } = require('../lib/scan');
const { renderProjectProfile, profileGaps } = require('../lib/profile');
const { installCommitMsgHook } = require('../lib/git-hook');
const {
  writeCoreRules, syncSkills, applyClaudeSettings, upsertConfig, ensurePostinstall,
} = require('../lib/install');

const KIT_ROOT = path.join(__dirname, '..', '..');
const CWD = process.cwd();
const AGENT_KIT_DIR = path.join(CWD, '.agent-kit');
const PROJECT_MD = path.join(AGENT_KIT_DIR, 'project.md');

function readKitVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}

function readTemplate(name) {
  return fs.readFileSync(path.join(KIT_ROOT, 'templates', name), 'utf8');
}

function parseArgs(argv, allowed) {
  const args = { force: false };
  for (const arg of argv) {
    if (arg === '--force' && allowed.includes('--force')) args.force = true;
    else {
      console.error(`Unknown option: ${arg}`);
      printUsage();
      process.exit(1);
    }
  }
  return args;
}

// Prints what changed and returns how many committable files changed; unchanged entries stay silent.
function report(entries) {
  let changed = 0;
  for (const { path: file, status, note, local } of entries) {
    if (status === 'unchanged') continue;
    if (status !== 'skipped' && !local) changed++;
    console.log(`  ${status} ${file}${note ? ` (${note})` : ''}`);
  }
  return changed;
}

function writeIfAbsent(destPath, content, force) {
  const rel = path.relative(CWD, destPath);
  const existed = fs.existsSync(destPath);
  if (existed && !force) return { path: rel, status: 'skipped', note: 'already exists' };
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content);
  return { path: rel, status: existed ? 'updated' : 'created' };
}

function scanOrExit() {
  try {
    return scanProject(CWD, readKitVersion());
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function currentProfileGaps() {
  if (!fs.existsSync(PROJECT_MD)) return [];
  return profileGaps(readTemplate('project.md'), fs.readFileSync(PROJECT_MD, 'utf8'));
}

function writeFacts(facts) {
  // Template gaps are included so the generate-project-profile skill knows which lines to add.
  const content = JSON.stringify({ ...facts, profileTemplateGaps: currentProfileGaps() }, null, 2) + '\n';
  fs.mkdirSync(AGENT_KIT_DIR, { recursive: true });
  // Regenerated every run: derived output, never hand-edited.
  fs.writeFileSync(path.join(AGENT_KIT_DIR, 'facts.json'), content);
  console.log('  wrote .agent-kit/facts.json');
}

function printFactsSummary(facts) {
  const list = (items) => (items.length ? items.join(', ') : '-');
  const rows = [
    ['React', facts.react || '-'],
    ['TypeScript', facts.typescript.version || (facts.typescript.detected ? 'tsconfig.json only' : '-')],
    ['Package manager', facts.packageManager.name],
    ['Build', list(facts.stack.build)],
    ['Router', list(facts.stack.router)],
    ['State', list(facts.stack.state)],
    ['Data fetching', list(facts.stack.dataFetching)],
    ['Styling', list(facts.stack.styling)],
    ['Tests', list(facts.stack.testing)],
  ];
  for (const [label, value] of rows) console.log(`  ${(label + ':').padEnd(17)}${value}`);
  for (const note of facts.notes) console.log(`  note: ${note}`);
}

function printProfileGaps(gaps) {
  if (!gaps.length) return;
  console.log('  .agent-kit/project.md is behind the current template:');
  for (const gap of gaps) console.log(`    - ${gap}`);
  console.log('  Run /generate-project-profile in Claude Code to update it.');
}

// Kit-owned files: identical in every project on the same kit version, refreshed by both init and sync.
function syncKitOwnedFiles(kitVersion) {
  const config = upsertConfig(CWD, kitVersion);
  const hook = installCommitMsgHook(KIT_ROOT, CWD);
  const entries = [
    ...writeCoreRules(KIT_ROOT, CWD),
    ...syncSkills(KIT_ROOT, CWD),
    ...applyClaudeSettings(CWD),
    ...hook.entries,
    ...config.entries,
  ];
  return { entries, previousVersion: config.previousVersion, hookLocalOnly: hook.localOnly };
}

function cmdScan(argv) {
  parseArgs(argv, []);
  console.log('Scanning project...');
  const facts = scanOrExit();
  writeFacts(facts);
  printFactsSummary(facts);
}

function cmdInit(argv) {
  const args = parseArgs(argv, ['--force']);

  console.log('Scanning project...');
  const facts = scanOrExit();
  if (!facts.typescript.detected) {
    console.error('\nError: no TypeScript found (no `typescript` dependency and no tsconfig.json).');
    console.error('agent-kit-react requires a TypeScript project. Migrate to TypeScript first, then run init again.');
    process.exit(1);
  }
  printFactsSummary(facts);

  console.log('Writing project files...');
  report([
    writeIfAbsent(PROJECT_MD, renderProjectProfile(readTemplate('project.md'), facts), args.force),
    // AGENTS.md: shared entry point read natively by Codex CLI, Cursor, Copilot and others.
    writeIfAbsent(path.join(CWD, 'AGENTS.md'), readTemplate('AGENTS.md'), args.force),
    // CLAUDE.md: Claude Code entry point; @-imports AGENTS.md + the files above.
    writeIfAbsent(path.join(CWD, 'CLAUDE.md'), readTemplate('CLAUDE.md'), args.force),
    ...ensurePostinstall(CWD),
  ]);
  writeFacts(facts);

  console.log('Installing kit files (rules, skills, R6.6 AI-attribution block)...');
  const { entries, hookLocalOnly } = syncKitOwnedFiles(facts.kitVersion);
  report(entries);
  if (hookLocalOnly) {
    console.log('  note: the commit-msg hook lives in .git/hooks (not committed); the postinstall');
    console.log('        `agent-kit sync` installs it for every developer on `yarn install`.');
  }
  printProfileGaps(currentProfileGaps());

  console.log('\nNext steps:');
  console.log('  1. Finish .agent-kit/project.md. Actual stack and Commands are prefilled from the scan.');
  console.log('     Claude Code: run /generate-project-profile');
  console.log('     Other tools: ask the agent to follow .claude/skills/generate-project-profile/SKILL.md');
  console.log('  2. Review every [needs confirmation] item with the team.');
  console.log('  3. Commit package.json, .agent-kit/, .claude/, AGENTS.md and CLAUDE.md to this project repo');
  console.log('     (plus .husky/commit-msg if the project uses husky).');
}

// Runs from the project's postinstall on every `yarn install`: quiet when up to date, never touches
// team-owned files (project.md, AGENTS.md, CLAUDE.md), never fails the install.
function cmdSync(argv) {
  parseArgs(argv, []);
  if (!fs.existsSync(path.join(AGENT_KIT_DIR, 'core-rules.md'))) {
    console.log('agent-kit sync: skipped, this project is not initialized (run `agent-kit init`).');
    return;
  }
  try {
    const kitVersion = readKitVersion();
    const { entries, previousVersion } = syncKitOwnedFiles(kitVersion);
    const gaps = currentProfileGaps();
    const hasChanges = entries.some((e) => e.status !== 'unchanged');
    if (!hasChanges && !gaps.length) {
      console.log(`agent-kit sync: up to date (v${kitVersion})`);
      return;
    }
    const upgraded = previousVersion && previousVersion !== kitVersion;
    console.log(`agent-kit sync: ${upgraded ? `upgraded v${previousVersion} → v${kitVersion}` : `v${kitVersion}`}`);
    if (report(entries)) console.log('  Commit the changed files.');
    printProfileGaps(gaps);
  } catch (err) {
    console.warn(`agent-kit sync: failed (${err.message}). Kit files may be stale; run \`agent-kit sync\` again.`);
  }
}

function printUsage() {
  console.log('agent-kit — usage:');
  console.log('  agent-kit init [--force]   Scan the project and install the kit: rules, templates, skills,');
  console.log('                             commit-msg check, and a postinstall that runs `agent-kit sync`');
  console.log('  agent-kit sync             Refresh kit-owned files to the installed kit version');
  console.log('                             (runs on every install through postinstall)');
  console.log('  agent-kit scan             Rescan the project and rewrite .agent-kit/facts.json only');
}

function main() {
  const [, , command, ...rest] = process.argv;
  if (command === 'init') return cmdInit(rest);
  if (command === 'sync') return cmdSync(rest);
  if (command === 'scan') return cmdScan(rest);
  printUsage();
  process.exit(command ? 1 : 0);
}

main();
