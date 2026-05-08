# Cube Timer

Cube Timer is a browser-based 3D cube puzzle timer built with TanStack Start, React, and React Three Fiber. Players can scramble, rotate, and solve a 2x2 or 3x3 cube in the browser.

Production URL: `https://cubetimer.sitos.uk`

## Highlights

- Interactive 2x2 and 3x3 cube gameplay
- Drag-based face rotation and live move feedback
- Scramble, undo, and reset controls
- Session timer and move counter
- Persistent best records and player settings via local storage
- Result dialog for completed runs

## Tech Stack

- TanStack Start
- React 19
- TypeScript
- Three.js with React Three Fiber and Drei
- Zustand for game state
- Tailwind CSS v4
- Vitest for engine tests

## Getting Started

```bash
mise install
pnpm install
pnpm run dev
```

The dev server runs on `http://localhost:3000`.

## Available Scripts

```bash
pnpm run dev
pnpm run build
pnpm run preview
pnpm run test
pnpm run format
pnpm run format:check
```

## Project Structure

- `src/routes/` contains the landing page, play route, and app shell
- `src/features/game/engine/` contains cube state, move logic, and tests
- `src/features/game/scene/` contains the 3D scene and cube rendering
- `src/features/game/ui/` contains the HUD, dialogs, and gameplay UI
- `src/features/game/store/` contains persisted game state and session flow

## Notes

This repository currently focuses on the front-end gameplay experience and the core 3D cube puzzle game.
