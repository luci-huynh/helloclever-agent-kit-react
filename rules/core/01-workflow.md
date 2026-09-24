## 1. Workflow

**MUST**
- **R1.1** Read `.agent-kit/project.md` before starting a task.
- **R1.2** Before creating a new file, look at the 2–3 nearest files of the same kind and follow their pattern (structure, naming, imports, how they call APIs).
- **R1.3** Only change what is in scope for the task. If you notice other problems, list them in your summary instead of fixing them.
- **R1.4** Do not delete or rewrite code until you understand what it is for.

**SHOULD**
- **R1.5** For a task that touches 4 or more files, list a plan (which files to create/change and why) and wait for confirmation before coding.
- **R1.6** Split large changes into small steps that each leave the app working.

**ASK FIRST**
- **R1.7** Adding, removing or upgrading any dependency.
- **R1.8** Creating a new top-level folder under `src/` or changing the folder structure.
- **R1.9** Changing a shared component, hook or util (imported in many places).
- **R1.10** Changing config: build, lint, tsconfig, CI, environment variables.

