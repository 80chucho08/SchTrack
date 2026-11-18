# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SchTrack is a client-only React 19 + TypeScript + Vite app for building a weekly academic schedule: create subjects ("materias") with a name and color, drag them onto a Monday–Friday / 7:00–21:00 grid, and export the grid as a PNG. There is no backend; state persists in `localStorage`. Deployed to GitHub Pages at https://80chucho08.github.io/SchTrack/.

Code identifiers, UI text and comments are in Spanish (`materia`, `horario`, `celda`, `Limpiar panel`, …) — keep new code consistent with that.

## Commands

- `npm run dev` — Vite dev server (served under `/SchTrack/` because of `base` in `vite.config.ts`)
- `npm run build` — `tsc -b` type-check (strict, `noUnusedLocals`/`noUnusedParameters`, `verbatimModuleSyntax`) then `vite build` to `dist/`
- `npm run lint` — ESLint flat config (typescript-eslint, react-hooks, react-refresh)
- `npm run preview` — serve the built `dist/`
- `npm run deploy` — build and publish `dist/` to the `gh-pages` branch

There is no test framework configured.

Because of `verbatimModuleSyntax`, type-only imports must use `import type { ... }`.

## Architecture

All state and logic live in `src/pages/SchedulePage.tsx`; components in `src/components/` are presentational plus dnd-kit hooks. `App.tsx` just renders `SchedulePage`.

**State model** (`src/types/schedule.ts`):
- `materias: Materia[]` — every subject created (`id` from `crypto.randomUUID()`).
- `horario: HorarioState` — map from cell id to the `Materia` placed there. Cell ids are `` `${DIA}-${hora}` `` (e.g. `LUNES-7`), built in `HorarioGrid.tsx` from `dias[].id` and `horas` (the `largo`/`corto` fields are display-only labels; changing an `id` orphans saved data).
- Both are lazily initialized from and synced to `localStorage` keys `"materias"` and `"horario"` via `useEffect`. Changing the shape of these types breaks previously stored data.

**Drag & drop** (`@dnd-kit/core`): a single `DndContext` in `SchedulePage` wraps the panel and grid.
- The moving card is drawn by a `DragOverlay` in `SchedulePage` (tracked via `materiaArrastrada`), so it isn't clipped by the grid's `overflow: hidden`; the original `MateriaCard` just fades (`.is-dragging`).
- Draggables: `MateriaCard`, with draggable id = `materia.id`. Since ids are unique, a subject can occupy **only one cell at a time**; `handleDragEnd` removes it from its previous cell before placing it in the new one.
- Droppables: each `CeldaHorario` (id = cell id) and `PanelMaterias` (id = `"panel-materias"`). Dropping on the panel removes the subject from the grid.
- The panel shows `materias` minus those currently in `horario` (derived, not stored separately). "Limpiar panel" deletes subjects that aren't placed; "Limpiar horario" empties `horario` but keeps the subjects.

**Export**: `handleExportHorario` runs `html2canvas` (scale 2) on the `.grid-section` element referenced by `horarioRef` and triggers a `horario.png` download.

**Styling**: global CSS in `src/App.css` (imported in `main.tsx`); the grid layout is CSS Grid on `.horario-grid`. Row height and hour-column width are CSS variables (`--fila`, `--hora-col`) on `.horario-grid`, overridden in the ≤600px media query (where day headers switch to the short labels). `MateriaCard` only sets the subject color inline and `CeldaHorario` toggles `.is-over` — keep static styles in CSS, since inline styles would override the classes.

`PanelMaterias` must always render its droppable container (even when empty) so subjects can be dragged back from the grid.

`src/data/materias.ts` is an empty file.
