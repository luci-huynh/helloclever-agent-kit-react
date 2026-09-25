'use strict';

// Prefills the project.md template with facts from scan.js. Only lines whose value is a
// deterministic fact are filled; everything else keeps its `<...>` placeholder for the
// generate-project-profile skill or a human to complete.

function joinList(list) {
  return list && list.length ? list.join(', ') : null;
}

function describeTypeScript(ts) {
  if (!ts.version) return null;
  if (ts.strict === true) return `${ts.version}, strict mode on`;
  if (ts.strict === false) return `${ts.version}, strict mode off`;
  if (ts.extends) return `${ts.version}, strict mode set by \`${ts.extends}\` [needs confirmation]`;
  return `${ts.version}, strict mode not set in tsconfig.json`;
}

function describeAliases(paths) {
  if (!paths) return null;
  const entries = Object.entries(paths).map(([alias, targets]) => `\`${alias}\` → \`${[].concat(targets).join('`, `')}\``);
  return entries.length ? entries.join('; ') : null;
}

function describePackageManager(pm) {
  return pm.version ? `${pm.name} ${pm.version}` : pm.name;
}

function describeForms(stack) {
  const forms = joinList(stack.forms);
  const validation = joinList(stack.validation);
  if (forms && validation) return `${forms} + ${validation}`;
  return forms || (validation ? `validation: ${validation}` : null);
}

// A missing script is itself a fact; keep it as a placeholder so the skill or a human resolves it.
function code(command) {
  return command ? `\`${command}\`` : '<no matching script in package.json>';
}

// Section heading → line label → value (null = leave the placeholder untouched).
function valuesFromFacts(facts) {
  const { stack } = facts;
  return {
    'Actual stack': {
      React: facts.react,
      TypeScript: describeTypeScript(facts.typescript),
      'Package manager': describePackageManager(facts.packageManager),
      Build: joinList(stack.build),
      Router: joinList(stack.router),
      State: joinList(stack.state),
      'Data fetching': joinList(stack.dataFetching),
      Styling: joinList(stack.styling),
      Forms: describeForms(stack),
      Tests: joinList(stack.testing),
      'UI library / design system': joinList(stack.uiLibrary),
      i18n: joinList(stack.i18n),
      'Lint / format': joinList(stack.lintFormat),
      'Import aliases': describeAliases(facts.typescript.paths),
    },
    Commands: {
      Install: code(facts.commands.install),
      Dev: code(facts.commands.dev),
      Lint: code(facts.commands.lint),
      Typecheck: code(facts.commands.typecheck),
      Test: code(facts.commands.test),
      Build: code(facts.commands.build),
    },
  };
}

function renderProjectProfile(template, facts) {
  const values = valuesFromFacts(facts);
  let section = null;
  return template
    .split('\n')
    .map((line) => {
      if (line.startsWith('# Project Profile — <project name>')) {
        return `# Project Profile — ${facts.project.name}`;
      }
      const heading = line.match(/^## (.+)$/);
      if (heading) {
        section = heading[1].trim();
        return line;
      }
      const item = line.match(/^- ([^:]+): .*<.*>.*$/);
      const value = item && values[section] && values[section][item[1]];
      return value ? `- ${item[1]}: ${value}` : line;
    })
    .join('\n');
}

// Section heading → list of `- Label:` items, ignoring HTML comments.
function outline(markdown) {
  const sections = new Map();
  let current = null;
  for (const line of markdown.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      current = heading[1].trim();
      sections.set(current, []);
    } else if (current) {
      const item = line.match(/^- ([^:`<]+):/);
      if (item) sections.get(current).push(item[1].trim());
    }
  }
  return sections;
}

// Sections and lines of the current template that an existing project.md lacks, e.g. after a kit upgrade.
// Lines the team added themselves are never reported.
function profileGaps(template, projectMd) {
  const have = outline(projectMd);
  const gaps = [];
  for (const [section, labels] of outline(template)) {
    if (!have.has(section)) gaps.push(`missing section "${section}"`);
    else {
      const missing = labels.filter((label) => !have.get(section).includes(label));
      if (missing.length) gaps.push(`${section}: missing ${missing.join(', ')}`);
    }
  }
  return gaps;
}

module.exports = { renderProjectProfile, profileGaps };
