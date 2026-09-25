#!/usr/bin/env node
'use strict';

// Git commit-msg hook installed by @helloclever/agent-kit-react (core rule R6.6).
// Rejects commits that attribute work to an AI coding tool: Co-Authored-By trailers,
// "Generated with ..." footers, AI tool links, or an AI tool as commit author.
// Kit-owned: rewritten by `agent-kit init`, do not edit in the project.
//
// Deliberately matches attribution patterns only, not bare product names, so commits
// about CLAUDE.md or about a feature that integrates an AI API still pass.

const fs = require('fs');
const { execSync } = require('child_process');

const AI_TOOL = '(claude|anthropic|copilot|codex|cursor|openai|chatgpt|gpt-?\\d|gemini|devin|windsurf|aider|llm)';

const MESSAGE_PATTERNS = [
  // Trailers such as "Co-Authored-By: Claude <noreply@anthropic.com>".
  new RegExp(`^\\s*(co-authored-by|generated-by|assisted-by|made-with|written-by)\\s*:.*\\b${AI_TOOL}\\b`, 'im'),
  // Footers such as "Generated with Claude Code" or "written by AI".
  new RegExp(`\\b(generated|written|created|authored|assisted|made|produced)\\s+(with|by|using)\\s+(an?\\s+)?(ai\\b|${AI_TOOL})`, 'i'),
  /\bclaude[ -]code\b/i,
  /\bclaude\.(ai|com)\b/i,
  /\banthropic\.com\b/i,
  /\bchatgpt\b/i,
  /\bgithub copilot\b/i,
  /\u{1F916}/u, // robot emoji used in AI-generated footers
];

const AUTHOR_PATTERN = new RegExp(`\\b${AI_TOOL}\\b`, 'i');

function stripComments(message) {
  // Git drops lines starting with '#' (default commentChar) and everything after the scissors line.
  const scissors = message.indexOf('# ------------------------ >8 ------------------------');
  const body = scissors === -1 ? message : message.slice(0, scissors);
  return body
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .join('\n');
}

function authorIdent() {
  try {
    return execSync('git var GIT_AUTHOR_IDENT', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .replace(/\s+\d+\s+[+-]\d{4}\s*$/, '')
      .trim();
  } catch {
    return '';
  }
}

function main() {
  const file = process.argv[2];
  if (!file) return;
  const message = stripComments(fs.readFileSync(file, 'utf8'));
  const problems = [];

  for (const pattern of MESSAGE_PATTERNS) {
    const match = message.match(pattern);
    if (match) problems.push(`commit message contains "${match[0].trim()}"`);
  }
  const author = authorIdent();
  if (author && AUTHOR_PATTERN.test(author)) problems.push(`commit author is "${author}"`);

  if (problems.length) {
    console.error('\nCommit rejected (agent-kit rule R6.6: no AI attribution in pushed content):');
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error('\nRemove the AI attribution and commit again with your own git identity.');
    console.error('The message was not lost: see .git/COMMIT_EDITMSG.\n');
    process.exit(1);
  }
}

main();
