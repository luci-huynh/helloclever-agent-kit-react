#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { scanProject } = require('../lib/scan');
const { renderProjectProfile } = require('../lib/profile');

const KIT_ROOT = path.join(__dirname, '..', '..');
const CWD = process.cwd();
const AGENT_KIT_DIR = path.join(CWD, '.agent-kit');

function readKitVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
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

function writeIfAbsent(destPath, content, force) {
  const rel = path.relative(CWD, destPath);
  if (fs.existsSync(destPath) && !force) {
    console.log(`  skip (already exists): ${rel}`);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content);
  console.log(`  wrote ${rel}`);
}

function copyIfAbsent(srcPath, destPath, force) {
  writeIfAbsent(destPath, fs.readFileSync(srcPath, 'utf8'), force);
}

function buildCoreRules() {
  const rulesDir = path.join(KIT_ROOT, 'rules', 'core');
  const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md')).sort();
  return files.map((f) => fs.readFileSync(path.join(rulesDir, f), 'utf8')).join('\n');
}

function scanOrExit() {
  try {
    return scanProject(CWD, readKitVersion());
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function writeFacts(facts) {
  fs.mkdirSync(AGENT_KIT_DIR, { recursive: true });
  // Regenerated every run: derived output, never hand-edited.
  fs.writeFileSync(path.join(AGENT_KIT_DIR, 'facts.json'), JSON.stringify(facts, null, 2) + '\n');
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

// Skills are kit-owned (like core-rules.md): refreshed on every init, never hand-edited in projects.
function installSkills() {
  const skillsDir = path.join(KIT_ROOT, 'skills');
  const names = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort();
  for (const name of names) {
    const dest = path.join(CWD, '.claude', 'skills', name);
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(path.join(skillsDir, name), dest, { recursive: true });
    console.log(`  wrote ${path.relative(CWD, dest)}/`);
  }
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
  writeFacts(facts);

  console.log('Assembling core rules...');
  // Regenerated every run: this is derived output, never hand-edited by projects.
  fs.writeFileSync(path.join(AGENT_KIT_DIR, 'core-rules.md'), buildCoreRules());
  console.log('  wrote .agent-kit/core-rules.md');

  console.log('Writing config and project profile...');
  const config = { agentKitVersion: facts.kitVersion, stack: 'react' };
  writeIfAbsent(path.join(AGENT_KIT_DIR, 'config.json'), JSON.stringify(config, null, 2) + '\n', args.force);
  const template = fs.readFileSync(path.join(KIT_ROOT, 'templates', 'project.md'), 'utf8');
  writeIfAbsent(path.join(AGENT_KIT_DIR, 'project.md'), renderProjectProfile(template, facts), args.force);

  console.log('Copying entry points...');
  // AGENTS.md: shared entry point read natively by Codex CLI, Cursor, Copilot and others.
  copyIfAbsent(path.join(KIT_ROOT, 'templates', 'AGENTS.md'), path.join(CWD, 'AGENTS.md'), args.force);
  // CLAUDE.md: Claude Code entry point; @-imports AGENTS.md + the files above.
  copyIfAbsent(path.join(KIT_ROOT, 'templates', 'CLAUDE.md'), path.join(CWD, 'CLAUDE.md'), args.force);

  console.log('Installing skills...');
  installSkills();

  console.log('\nNext steps:');
  console.log('  1. Finish .agent-kit/project.md. Actual stack and Commands are prefilled from the scan.');
  console.log('     Claude Code: run /generate-project-profile');
  console.log('     Other tools: ask the agent to follow .claude/skills/generate-project-profile/SKILL.md');
  console.log('  2. Review every [needs confirmation] item with the team.');
  console.log('  3. Commit .agent-kit/, .claude/skills/, AGENTS.md and CLAUDE.md to this project repo.');
}

function printUsage() {
  console.log('agent-kit — usage:');
  console.log('  agent-kit init [--force]   Scan the project, install rules, templates and skills');
  console.log('  agent-kit scan             Rescan the project and rewrite .agent-kit/facts.json only');
  console.log('');
  console.log('`sync` is planned — see cli/README.md.');
}

function main() {
  const [, , command, ...rest] = process.argv;
  if (command === 'init') return cmdInit(rest);
  if (command === 'scan') return cmdScan(rest);
  printUsage();
  process.exit(command ? 1 : 0);
}

main();
