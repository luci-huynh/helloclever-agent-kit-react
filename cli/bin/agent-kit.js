#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const KIT_ROOT = path.join(__dirname, '..', '..');
const CWD = process.cwd();

function readKitVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}

function parseInitArgs(argv) {
  const args = { typescript: true, force: false };
  for (const arg of argv) {
    if (arg === '--no-typescript') args.typescript = false;
    else if (arg === '--force') args.force = true;
    else {
      console.error(`Unknown option: ${arg}`);
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
  fs.writeFileSync(destPath, content);
  console.log(`  wrote ${rel}`);
}

function copyIfAbsent(srcPath, destPath, force) {
  writeIfAbsent(destPath, fs.readFileSync(srcPath, 'utf8'), force);
}

function buildCoreRules(typescript) {
  const rulesDir = path.join(KIT_ROOT, 'rules', 'core');
  const files = fs
    .readdirSync(rulesDir)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => typescript || f !== '03-typescript.md')
    .sort();
  return files.map((f) => fs.readFileSync(path.join(rulesDir, f), 'utf8')).join('\n');
}

function cmdInit(argv) {
  const args = parseInitArgs(argv);
  const agentKitDir = path.join(CWD, '.agent-kit');
  fs.mkdirSync(agentKitDir, { recursive: true });

  console.log('Assembling core rules...');
  // Regenerated every run: this is derived output, never hand-edited by projects.
  fs.writeFileSync(path.join(agentKitDir, 'core-rules.md'), buildCoreRules(args.typescript));
  console.log('  wrote .agent-kit/core-rules.md');

  console.log('Writing config...');
  const config = {
    agentKitVersion: readKitVersion(),
    stack: 'react',
    core: { typescript: args.typescript },
  };
  writeIfAbsent(path.join(agentKitDir, 'config.json'), JSON.stringify(config, null, 2) + '\n', args.force);

  console.log('Copying templates...');
  copyIfAbsent(path.join(KIT_ROOT, 'templates', 'project.md'), path.join(agentKitDir, 'project.md'), args.force);
  // AGENTS.md: shared entry point read natively by Codex CLI, Cursor, Copilot and others.
  copyIfAbsent(path.join(KIT_ROOT, 'templates', 'AGENTS.md'), path.join(CWD, 'AGENTS.md'), args.force);
  // CLAUDE.md: Claude Code entry point; @-imports AGENTS.md + the files above.
  copyIfAbsent(path.join(KIT_ROOT, 'templates', 'CLAUDE.md'), path.join(CWD, 'CLAUDE.md'), args.force);

  console.log('\nNext steps:');
  console.log('  1. Fill in .agent-kit/project.md by hand (stack, structure, reference files, commands, overrides).');
  console.log('     AI-assisted profile generation is not built yet (see skills/README.md).');
  console.log('  2. Commit .agent-kit/, AGENTS.md and CLAUDE.md to this project repo.');
  console.log('  3. Claude Code reads CLAUDE.md; Codex CLI and other AGENTS.md-aware tools read AGENTS.md directly.');
}

function printUsage() {
  console.log('agent-kit — usage:');
  console.log('  agent-kit init [--no-typescript] [--force]');
  console.log('');
  console.log('`sync` and `profile` are planned — see cli/README.md.');
}

function main() {
  const [, , command, ...rest] = process.argv;
  if (command === 'init') {
    cmdInit(rest);
    return;
  }
  printUsage();
  process.exit(command ? 1 : 0);
}

main();
