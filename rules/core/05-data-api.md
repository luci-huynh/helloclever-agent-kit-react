## 5. Data & API

**MUST**
- **R5.1** Call APIs through the layer/client the project uses (see `project.md`). Do not call `fetch`/`axios` directly in a component if the project already has its own layer.
- **R5.2** Handle errors for every request; never swallow errors with an empty `catch`.
- **R5.3** Do not hardcode URLs, API keys or environment-dependent values; use environment variables the way the project does.

**SHOULD**
- **R5.4** Ignore stale responses when a request has been superseded or the component has unmounted (for example with search or rapidly changing filters).
- **R5.5** Do not write your own caching if the project already has a data-fetching library.

