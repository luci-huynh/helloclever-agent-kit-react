## 7. Testing

**MUST**
- **R7.1** New logic (hooks, utils, data processing) must have tests, if the project already has a test setup.
- **R7.2** When fixing a bug, add a test that reproduces it where feasible.

**SHOULD**
- **R7.3** Test user behavior (render, interact, check what is displayed), not internal state or implementation details.
- **R7.4** Query elements by role, label or text first; `data-testid` is the last resort.
- **R7.5** Mock APIs following the project's existing pattern.

