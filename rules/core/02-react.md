## 2. React

**MUST**
- **R2.1** Use only function components and hooks.
- **R2.2** Do not use `useEffect` to compute values derived from props/state. Compute them during render (use `useMemo` if the computation is expensive).
- **R2.3** Do not copy props into state and sync them with `useEffect`.
- **R2.4** A `useEffect` that sets up a subscription, timer or event listener must clean it up.
- **R2.5** List `key`s use stable ids. Do not use the index if the list can be reordered or have items added/removed.

**SHOULD**
- **R2.6** One main responsibility per component. Split it when it exceeds about 200 lines, or when it both fetches data and renders something complex.
- **R2.7** Extract logic used in 2 or more places into a custom hook `useXxx`.
- **R2.8** Only use `useMemo`, `useCallback` or `React.memo` for a concrete reason: an expensive computation, passing to a memoized component, or serving as an effect dependency.
- **R2.9** Pass specific props; avoid passing a whole large object when the component needs only a few fields.
- **R2.10** Keep state at the lowest level possible. Only lift it into a global store when several component branches need it.

