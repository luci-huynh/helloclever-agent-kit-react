# Skills

Each skill is a folder with instructions for one specific kind of task, loaded only when needed.

```
skills/<skill-name>/
├── SKILL.md       # frontmatter (name, description) + steps + common mistakes
└── examples/      # "golden" reference files for the AI to imitate (optional)
```

When installed into a project, skills go into `.claude/skills/`.

Skills are written in English, even when the request comes in another language.

## Plan
- [ ] `generate-project-profile`: scan the repo and draft `.agent-kit/project.md`
- [ ] `create-component`
- [ ] `api-integration`
- [ ] `figma-to-component`
- [ ] `write-tests`
