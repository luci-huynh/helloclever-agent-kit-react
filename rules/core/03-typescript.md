## 3. TypeScript

_Only applies to projects that use TypeScript (`config.json` → `core.typescript`)._

**MUST**
- **R3.1** Do not use `any`. When the type is unknown, use `unknown` and narrow it.
- **R3.2** Do not use `as` or `// @ts-ignore` to get around type errors. If you truly must, add a comment explaining why.
- **R3.3** Component props have explicit types.
- **R3.4** API data has its own types, placed according to the project's pattern.

**SHOULD**
- **R3.5** Use a union type for discrete states (`'idle' | 'loading' | 'error' | 'success'`) instead of multiple booleans.

