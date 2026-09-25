'use strict';

// Install steps shared by `agent-kit init` and `agent-kit sync`. Every step writes a file only
// when its content changes and returns what it did, so `sync` can run on every `yarn install`
// and stay silent (and diff-free) when the project is already up to date.

const fs = require('fs');
const path = require('path');

const SYNC_SCRIPT = 'agent-kit sync';
// `|| exit 0` keeps installs working where the kit is absent (e.g. production-only installs); valid in sh and cmd.
const POSTINSTALL = `${SYNC_SCRIPT} || exit 0`;

function relTo(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

// Returns 'created' | 'updated' | 'unchanged'.
function writeIfChanged(file, content, mode) {
  const existed = fs.existsSync(file);
  if (existed && fs.readFileSync(file, 'utf8') === content) return 'unchanged';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  if (mode) fs.chmodSync(file, mode);
  return existed ? 'updated' : 'created';
}

function buildCoreRules(kitRoot) {
  const rulesDir = path.join(kitRoot, 'rules', 'core');
  const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md')).sort();
  return files.map((f) => fs.readFileSync(path.join(rulesDir, f), 'utf8')).join('\n');
}

function writeCoreRules(kitRoot, root) {
  const file = path.join(root, '.agent-kit', 'core-rules.md');
  return [{ path: relTo(root, file), status: writeIfChanged(file, buildCoreRules(kitRoot)) }];
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full).map((f) => path.join(entry.name, f)));
    else out.push(entry.name);
  }
  return out.sort();
}

// Mirrors src into dest file by file: changed files are rewritten, files the kit no longer ships are removed.
function mirrorDir(root, src, dest) {
  const results = [];
  const srcFiles = listFiles(src);
  for (const rel of srcFiles) {
    const file = path.join(dest, rel);
    results.push({ path: relTo(root, file), status: writeIfChanged(file, fs.readFileSync(path.join(src, rel), 'utf8')) });
  }
  for (const rel of listFiles(dest)) {
    if (!srcFiles.includes(rel)) {
      fs.rmSync(path.join(dest, rel));
      results.push({ path: relTo(root, path.join(dest, rel)), status: 'removed' });
    }
  }
  return results;
}

// Skills are kit-owned (like core-rules.md): kept identical to the kit, never hand-edited in projects.
// Only skills the kit ships are touched; a project's own skills in .claude/skills/ are left alone.
function syncSkills(kitRoot, root) {
  const skillsDir = path.join(kitRoot, 'skills');
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort()
    .flatMap((name) => mirrorDir(root, path.join(skillsDir, name), path.join(root, '.claude', 'skills', name)));
}

// R6.6: turn off Claude Code's own commit trailer and PR footer for everyone on the project.
// Merged into the committed .claude/settings.json so the team's other settings are kept.
// `includeCoAuthoredBy` is the deprecated key, still set for older Claude Code versions.
function applyClaudeSettings(root) {
  const file = path.join(root, '.claude', 'settings.json');
  let settings = {};
  if (fs.existsSync(file)) {
    try {
      settings = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return [{
        path: relTo(root, file),
        status: 'skipped',
        note: 'not valid JSON; set "attribution": {"commit": "", "pr": ""} by hand',
      }];
    }
  }
  settings.attribution = { ...settings.attribution, commit: '', pr: '' };
  settings.includeCoAuthoredBy = false;
  return [{ path: relTo(root, file), status: writeIfChanged(file, JSON.stringify(settings, null, 2) + '\n') }];
}

// Records the installed kit version and drops keys older kit versions wrote. Returns the previous version too.
function upsertConfig(root, kitVersion) {
  const file = path.join(root, '.agent-kit', 'config.json');
  let config = {};
  if (fs.existsSync(file)) {
    try {
      config = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      config = {};
    }
  }
  const previousVersion = config.agentKitVersion || null;
  const next = { ...config, agentKitVersion: kitVersion, stack: config.stack || 'react' };
  if (next.core) {
    delete next.core.typescript; // removed by ADR 0002
    if (!Object.keys(next.core).length) delete next.core;
  }
  const status = writeIfChanged(file, JSON.stringify(next, null, 2) + '\n');
  return { entries: [{ path: relTo(root, file), status }], previousVersion };
}

// Adds `agent-kit sync` to the project's postinstall so every `yarn install` refreshes kit files.
function ensurePostinstall(root) {
  const file = path.join(root, 'package.json');
  const raw = fs.readFileSync(file, 'utf8');
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts || {};
  const current = scripts.postinstall;
  if (current && current.includes(SYNC_SCRIPT)) return [{ path: 'package.json', status: 'unchanged' }];
  // Grouped so `exit 0` only covers the sync step, never a failure in the project's own postinstall.
  scripts.postinstall = current ? `${current} && (${POSTINSTALL})` : POSTINSTALL;
  pkg.scripts = scripts;
  const indent = (raw.match(/^([ \t]+)"/m) || [null, '  '])[1];
  const content = JSON.stringify(pkg, null, indent) + (raw.endsWith('\n') ? '\n' : '');
  return [{ path: 'package.json', status: writeIfChanged(file, content), note: 'postinstall runs `agent-kit sync`' }];
}

module.exports = {
  writeIfChanged,
  writeCoreRules,
  syncSkills,
  applyClaudeSettings,
  upsertConfig,
  ensurePostinstall,
  relTo,
};
