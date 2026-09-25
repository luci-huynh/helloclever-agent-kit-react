'use strict';

// Deterministic fact scan of a React project. No AI, no network: reads package.json,
// lockfiles, config files and the source tree, and returns plain facts that the
// generate-project-profile skill (or a human) turns into .agent-kit/project.md.
// Output must be stable across runs and machines, so no timestamps and everything is sorted.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FACTS_SCHEMA_VERSION = 1;

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', '.nuxt', '.turbo',
  '.cache', '.vercel', '.output', 'storybook-static', '.agent-kit', '.claude', '.yarn',
]);
const SOURCE_EXT = /\.(ts|tsx|js|jsx|mts|cts|mjs|cjs)$/;
const MAX_SOURCE_FILES = 20000;
const MAX_TREE_ENTRIES = 60;
const MAX_CANDIDATES = 5;

// Library catalog: category → [package name, display label]. Order = display order.
const CATALOG = {
  build: [
    ['next', 'Next.js'], ['vite', 'Vite'], ['react-scripts', 'Create React App'],
    ['@craco/craco', 'CRACO'], ['@remix-run/react', 'Remix'], ['gatsby', 'Gatsby'],
    ['@rsbuild/core', 'Rsbuild'], ['@rspack/core', 'Rspack'], ['parcel', 'Parcel'],
    ['webpack', 'webpack'],
  ],
  router: [
    ['react-router-dom', 'React Router'], ['react-router', 'React Router'],
    ['@tanstack/react-router', 'TanStack Router'], ['wouter', 'wouter'],
  ],
  state: [
    ['@reduxjs/toolkit', 'Redux Toolkit'], ['redux', 'Redux'], ['zustand', 'Zustand'],
    ['jotai', 'Jotai'], ['recoil', 'Recoil'], ['mobx', 'MobX'], ['valtio', 'Valtio'],
    ['xstate', 'XState'],
  ],
  dataFetching: [
    ['@tanstack/react-query', 'TanStack Query'], ['react-query', 'React Query'], ['swr', 'SWR'],
    ['@apollo/client', 'Apollo Client'], ['urql', 'urql'], ['graphql-request', 'graphql-request'],
    ['axios', 'axios'], ['ky', 'ky'], ['@trpc/client', 'tRPC'],
  ],
  styling: [
    ['tailwindcss', 'Tailwind CSS'], ['styled-components', 'styled-components'],
    ['@emotion/react', 'Emotion'], ['@emotion/styled', 'Emotion styled'], ['sass', 'Sass'],
    ['node-sass', 'Sass (node-sass)'], ['less', 'Less'], ['@vanilla-extract/css', 'vanilla-extract'],
    ['@stitches/react', 'Stitches'],
  ],
  forms: [
    ['react-hook-form', 'React Hook Form'], ['formik', 'Formik'],
    ['react-final-form', 'React Final Form'], ['@tanstack/react-form', 'TanStack Form'],
  ],
  validation: [['zod', 'Zod'], ['yup', 'Yup'], ['valibot', 'Valibot'], ['joi', 'Joi']],
  testing: [
    ['vitest', 'Vitest'], ['jest', 'Jest'], ['@testing-library/react', 'Testing Library'],
    ['msw', 'MSW'], ['@playwright/test', 'Playwright'], ['cypress', 'Cypress'],
  ],
  uiLibrary: [
    ['@mui/material', 'MUI'], ['antd', 'Ant Design'], ['@chakra-ui/react', 'Chakra UI'],
    ['@mantine/core', 'Mantine'], ['react-bootstrap', 'React Bootstrap'],
    ['@headlessui/react', 'Headless UI'], ['@radix-ui/themes', 'Radix Themes'],
  ],
  i18n: [
    ['react-i18next', 'react-i18next'], ['react-intl', 'react-intl'], ['next-intl', 'next-intl'],
    ['@lingui/react', 'Lingui'],
  ],
  lintFormat: [
    ['eslint', 'ESLint'], ['prettier', 'Prettier'], ['@biomejs/biome', 'Biome'],
    ['stylelint', 'Stylelint'], ['husky', 'husky'], ['lint-staged', 'lint-staged'],
  ],
};

const CONFIG_FILE_PATTERNS = [
  /^vite\.config\./, /^vitest\.config\./, /^next\.config\./, /^webpack\.config\./,
  /^craco\.config\./, /^rsbuild\.config\./, /^tsconfig.*\.json$/, /^jsconfig\.json$/,
  /^\.eslintrc/, /^eslint\.config\./, /^\.prettierrc/, /^prettier\.config\./, /^biome\.jsonc?$/,
  /^tailwind\.config\./, /^postcss\.config\./, /^jest\.config\./, /^playwright\.config\./,
  /^cypress\.config\./, /^components\.json$/, /^\.storybook$/, /^\.env\.example$/,
  /^\.env\.sample$/, /^Dockerfile$/, /^\.nvmrc$/, /^\.node-version$/, /^\.husky$/,
  /^commitlint\.config\./, /^\.lintstagedrc/, /^\.stylelintrc/, /^pnpm-workspace\.yaml$/,
  /^turbo\.json$/, /^nx\.json$/,
];

const SCRIPT_CANDIDATES = {
  dev: ['dev', 'start', 'serve'],
  lint: ['lint'],
  typecheck: ['typecheck', 'type-check', 'check-types', 'types', 'tsc'],
  test: ['test', 'test:unit'],
  build: ['build'],
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// tsconfig.json is JSONC: strip comments and trailing commas without touching string contents.
function parseJsonc(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inString) {
      out += c;
      if (c === '\\') out += text[++i] || '';
      else if (c === '"') inString = false;
    } else if (c === '"') {
      inString = true;
      out += c;
    } else if (c === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
    } else if (c === '/' && next === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i++;
    } else {
      out += c;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
}

function detectPackageManager(root, pkg) {
  if (typeof pkg.packageManager === 'string') {
    const [name, version] = pkg.packageManager.split('@');
    return { name, version: (version || '').split('+')[0] || null, lockfile: findLockfile(root) };
  }
  const lockfile = findLockfile(root);
  const byLockfile = {
    'yarn.lock': 'yarn', 'pnpm-lock.yaml': 'pnpm', 'package-lock.json': 'npm',
    'bun.lockb': 'bun', 'bun.lock': 'bun',
  };
  return { name: byLockfile[lockfile] || 'npm', version: null, lockfile };
}

function findLockfile(root) {
  const lockfiles = ['yarn.lock', 'pnpm-lock.yaml', 'package-lock.json', 'bun.lock', 'bun.lockb'];
  return lockfiles.find((f) => fs.existsSync(path.join(root, f))) || null;
}

function runCommand(pm, script) {
  if (!script) return null;
  if (pm === 'npm') return script === 'test' || script === 'start' ? `npm ${script}` : `npm run ${script}`;
  if (pm === 'bun') return `bun run ${script}`;
  return `${pm} ${script}`;
}

function makeVersionResolver(root, pkg) {
  const declared = { ...pkg.peerDependencies, ...pkg.devDependencies, ...pkg.dependencies };
  return (name) => {
    if (!(name in declared)) return null;
    // Prefer the installed version; fall back to the declared range.
    const installed = readJson(path.join(root, 'node_modules', name, 'package.json'));
    return (installed && installed.version) || declared[name];
  };
}

function detectCatalog(version) {
  const stack = {};
  for (const [category, entries] of Object.entries(CATALOG)) {
    const seen = new Set();
    stack[category] = [];
    for (const [name, label] of entries) {
      const v = version(name);
      if (v === null || seen.has(label)) continue;
      seen.add(label);
      stack[category].push(`${label} ${v}`);
    }
  }
  return stack;
}

function detectTypeScript(root, version) {
  const tsconfigPath = path.join(root, 'tsconfig.json');
  const result = {
    detected: false,
    version: version('typescript'),
    tsconfig: fs.existsSync(tsconfigPath) ? 'tsconfig.json' : null,
    strict: null,
    extends: null,
    paths: null,
  };
  result.detected = Boolean(result.version || result.tsconfig);
  if (result.tsconfig) {
    try {
      const tsconfig = parseJsonc(fs.readFileSync(tsconfigPath, 'utf8'));
      const opts = tsconfig.compilerOptions || {};
      result.strict = typeof opts.strict === 'boolean' ? opts.strict : null;
      result.extends = tsconfig.extends || null;
      result.paths = opts.paths || null;
    } catch {
      result.parseError = true;
    }
  }
  return result;
}

function listConfigFiles(root) {
  const entries = fs.readdirSync(root);
  const found = entries.filter((e) => CONFIG_FILE_PATTERNS.some((re) => re.test(e)));
  if (fs.existsSync(path.join(root, '.github', 'workflows'))) found.push('.github/workflows');
  return found.sort();
}

function walkSourceFiles(root, startDirs) {
  const files = [];
  const stack = startDirs.map((d) => path.join(root, d));
  while (stack.length && files.length < MAX_SOURCE_FILES) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || IGNORED_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (SOURCE_EXT.test(entry.name) && !entry.name.endsWith('.d.ts')) {
        files.push(path.relative(root, full).split(path.sep).join('/'));
      }
    }
  }
  return files.sort();
}

function sourceRoots(root) {
  if (fs.existsSync(path.join(root, 'src'))) return ['src'];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !IGNORED_DIRS.has(e.name))
    .map((e) => e.name)
    .sort();
}

// Directory → number of source files under it (recursive), for the top two levels below the roots.
function buildTree(files, roots) {
  // With a single src/ root, list src/<a> and src/<a>/<b>; otherwise list <a> and <a>/<b>.
  const rootDepth = roots.length === 1 && roots[0] === 'src' ? 1 : 0;
  const counts = new Map();
  for (const file of files) {
    const parts = file.split('/');
    for (let depth = rootDepth + 1; depth <= rootDepth + 2 && depth < parts.length; depth++) {
      const dir = parts.slice(0, depth).join('/');
      counts.set(dir, (counts.get(dir) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, MAX_TREE_ENTRIES)
    .map(([dir, count]) => ({ path: dir, files: count }));
}

function countByExtension(files) {
  const counts = { ts: 0, tsx: 0, js: 0, jsx: 0 };
  for (const file of files) {
    const ext = file.slice(file.lastIndexOf('.') + 1);
    if (ext in counts) counts[ext]++;
    else if (ext === 'mts' || ext === 'cts') counts.ts++;
    else if (ext === 'mjs' || ext === 'cjs') counts.js++;
  }
  return counts;
}

// Files touched in recent commits, most recent first. Used to rank candidates towards current patterns.
function recentlyChangedFiles(root) {
  try {
    const out = execSync('git log -n 300 --name-only --format=', {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024,
    });
    const order = new Map();
    for (const line of out.split('\n')) {
      const file = line.trim();
      if (file && !order.has(file)) order.set(file, order.size);
    }
    return order;
  } catch {
    return new Map();
  }
}

function pickCandidates(files, recent) {
  const isTest = (f) => /\.(test|spec)\.[a-z]+$/.test(f) || /(^|\/)__tests__\//.test(f);
  const isStory = (f) => /\.stories\.[a-z]+$/.test(f);
  const base = (f) => f.slice(f.lastIndexOf('/') + 1);
  const categories = {
    components: (f) => /\.(tsx|jsx)$/.test(f) && /^[A-Z]/.test(base(f)) && !isTest(f) && !isStory(f),
    hooks: (f) => /^use[A-Z][^.]*\.(ts|tsx|js|jsx)$/.test(base(f)) && !isTest(f),
    api: (f) =>
      !isTest(f) &&
      (/(^|\/)(api|apis|services?|queries|requests|http|clients?)\//i.test(f) ||
        /(api|service|client|queries|query)\.(ts|js)$/i.test(base(f))),
    forms: (f) => /\.(tsx|jsx)$/.test(f) && /form/i.test(f) && !isTest(f) && !isStory(f),
    tests: isTest,
  };
  const rank = (f) => (recent.has(f) ? recent.get(f) : Number.MAX_SAFE_INTEGER);
  const result = {};
  for (const [name, match] of Object.entries(categories)) {
    result[name] = files
      .filter(match)
      .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
      .slice(0, MAX_CANDIDATES);
  }
  return result;
}

function detectNextRouter(root, version) {
  if (!version('next')) return [];
  const routers = [];
  if (['app', 'src/app'].some((d) => fs.existsSync(path.join(root, d)))) routers.push('Next.js App Router');
  if (['pages', 'src/pages'].some((d) => fs.existsSync(path.join(root, d)))) routers.push('Next.js Pages Router');
  return routers;
}

function scanProject(root, kitVersion) {
  const pkg = readJson(path.join(root, 'package.json'));
  if (!pkg) {
    throw new Error(`No readable package.json in ${root}. Run agent-kit from the project root.`);
  }
  const version = makeVersionResolver(root, pkg);
  const pm = detectPackageManager(root, pkg);
  const scripts = pkg.scripts || {};
  const stack = detectCatalog(version);
  stack.router = [...detectNextRouter(root, version), ...stack.router];
  const roots = sourceRoots(root);
  const files = walkSourceFiles(root, roots);
  const typescript = detectTypeScript(root, version);

  const commands = { install: `${pm.name} install` };
  for (const [command, names] of Object.entries(SCRIPT_CANDIDATES)) {
    commands[command] = runCommand(pm.name, names.find((n) => n in scripts));
  }

  const notes = [];
  if (!version('react')) notes.push('react is not a dependency of this package.json (monorepo root?).');
  if (pkg.workspaces || fs.existsSync(path.join(root, 'pnpm-workspace.yaml'))) {
    notes.push('This looks like a monorepo root; the profile may belong in the app package instead.');
  }
  if (!pm.lockfile) notes.push('No lockfile found; package manager guessed as npm.');
  if (typescript.detected && !commands.typecheck) {
    notes.push('No typecheck script in package.json; `tsc --noEmit` is the usual fallback.');
  }
  if (files.length >= MAX_SOURCE_FILES) notes.push(`Source scan stopped at ${MAX_SOURCE_FILES} files.`);

  return {
    schemaVersion: FACTS_SCHEMA_VERSION,
    kitVersion,
    project: {
      name: pkg.name || path.basename(root),
      description: pkg.description || null,
      workspaces: Boolean(pkg.workspaces),
    },
    node: {
      engines: (pkg.engines && pkg.engines.node) || null,
      nvmrc: readTrimmed(path.join(root, '.nvmrc')) || readTrimmed(path.join(root, '.node-version')),
    },
    packageManager: pm,
    react: version('react'),
    typescript,
    stack,
    scripts: sortObject(scripts),
    commands,
    configFiles: listConfigFiles(root),
    sourceRoots: roots,
    fileCounts: countByExtension(files),
    tree: buildTree(files, roots),
    candidates: pickCandidates(files, recentlyChangedFiles(root)),
    notes,
  };
}

function readTrimmed(file) {
  try {
    return fs.readFileSync(file, 'utf8').trim() || null;
  } catch {
    return null;
  }
}

function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}

module.exports = { scanProject };
