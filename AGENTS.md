# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
Immortal Sect is a client-side browser-based idle/tycoon game built with React 19, TypeScript, Zustand, Tailwind CSS 4, and Vite 6. There is no backend, database, or external API — all state is in-browser via `localStorage`.

### Running the application
- **Dev server**: `npm run dev` — starts Vite on port 3000.
- **Build & Test commands** are documented in `package.json` scripts and `CLAUDE.md` "Build & Test" section.

### Caveats
- **ESLint**: The lint script (`npm run lint`) fails because no `eslint.config.js` (flat config) file exists. ESLint 9 requires flat config. This is a pre-existing issue.
- **Vitest**: `npm test` has 2 pre-existing test failures in `tests/systems/DaoPathSystem.test.ts` (spell duration/cooldown assertions out of date with source data).
- **Pytest (optional)**: Python structural tests (`pytest`) have 2 pre-existing failures (realm count mismatch in `test_game_types.py`, `App.tsx` exceeds 500-line limit in `test_source_structure.py`). Run with `python3 -m pytest` or ensure `~/.local/bin` is on `PATH`.
- **TypeScript typecheck**: `npm run typecheck` passes clean.
- **Production build**: `npm run build` succeeds.
