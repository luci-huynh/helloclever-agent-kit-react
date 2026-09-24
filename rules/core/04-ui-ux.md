## 4. UI & UX

**MUST**
- **R4.1** Prefer the project's existing components and design tokens. Do not hardcode colors, font sizes or spacing when the project already has matching tokens or variables.
- **R4.2** Any screen or block that loads data must handle all 4 states: loading, error, empty, and loaded.
- **R4.3** Error messages shown to users must be understandable; never show raw errors or stack traces.
- **R4.4** Interactive elements must be keyboard accessible. Use `<button>` for actions and `<a>` for navigation; never put `onClick` on a `<div>`.
- **R4.5** Inputs must have labels. Images must have `alt` (decorative images use `alt=""`).
- **R4.6** Buttons that submit a form or trigger an action must prevent double submission while processing.

**SHOULD**
- **R4.7** Check the layout on mobile (about 375px) and desktop.
- **R4.8** User-facing text goes through the i18n system if the project uses one.

**ASK FIRST**
- **R4.9** Creating a new UI component that duplicates or closely resembles an existing one.

