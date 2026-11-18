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
- `materias: Materia[]` — the panel's subjects, used as reusable templates (`id` from `crypto.randomUUID()`).
- `horario: HorarioState` — map from cell id to a **copy** of the `Materia` placed there; the same subject can be in many cells, and deleting it from the panel doesn't touch the grid. Cell ids are `` `${DIA}-${hora}` `` (e.g. `LUNES-7`), built in `HorarioGrid.tsx` from `dias[].id` and `horas` (the `largo`/`corto` fields are display-only labels; changing an `id` orphans saved data).
- Both are lazily initialized from and synced to `localStorage` keys `"materias"` and `"horario"` via `useEffect`. Changing the shape of these types breaks previously stored data.
- `seleccion` — the card marked for deletion, keyed like its drag id (below). First click on a card selects it (shows the ×), a second click on the same card deletes it (from the panel or from that cell); clicking elsewhere or Escape clears it. Export clears it with `flushSync` so the × isn't captured.

**Drag & drop** (`@dnd-kit/core`): a single `DndContext` in `SchedulePage` wraps the panel and grid.
- `PointerSensor` uses `activationConstraint: { distance: 5 }` so clicks (for the delete flow) don't start a drag.
- Draggables: `MateriaCard`, with drag id `panel:<materiaId>` or `celda:<celdaId>` and a `DragData` payload (`origen`, `materia`, `celdaId`) that `handleDragEnd` reads from `active.data.current`. Panel → cell places a copy (panel keeps it); cell → cell moves it; cell → panel removes it from the grid.
- Droppables: each `CeldaHorario` (id = cell id) and `PanelMaterias` (id = `"panel-materias"`). `PanelMaterias` must always render its droppable container, even when empty.
- The moving card is drawn by a `DragOverlay` (tracked via `materiaArrastrada`), so it isn't clipped by the grid's `overflow: hidden`; a card dragged from the grid fades (`.is-dragging`), panel cards don't.
- "Limpiar panel" removes all subjects from the panel; "Limpiar horario" empties `horario`. Neither affects the other.

**Welcome modal** (`WelcomeModal.tsx`): native `<dialog>` opened with `showModal()` on load unless `localStorage["ocultarBienvenida"] === "1"` ("No volver a mostrar"); the header's `?` button reopens it. Its open/hide state lives in `SchedulePage`; closing (button, Escape, backdrop click) goes through the dialog's `close` event. Keep its steps in sync when the interaction model changes.

**Export**: `handleExportHorario` runs `html2canvas` (scale 2) on the `.grid-section` element referenced by `horarioRef` and triggers a `horario.png` download.

**Styling**: global CSS in `src/App.css` (imported in `main.tsx`). The "outer space" brand palette is defined as `--space-*`/`--brand-*`/`--star*` variables on `:root` at the top of `App.css`, including `--space-bg` (solid `--space-deep` with tiny star dots) shared by header and footer; `LogoMark.tsx` (the 3×3 mini-schedule logo, used in both) reads the same variables. The user asked for no color gradients: keep the brand surfaces in flat colors. The grid layout is CSS Grid on `.horario-grid`. Row height and hour-column width are CSS variables (`--fila`, `--hora-col`) on `.horario-grid`, overridden in the ≤600px media query (where day headers switch to the short labels). `MateriaCard` only sets the subject color inline and toggles `.is-dragging`/`.is-selected`; `CeldaHorario` toggles `.is-over` — keep static styles in CSS, since inline styles would override the classes.

Preset subject colors for the form's swatches live in `src/data/colores.ts` (lowercase hex, all chosen for contrast with white text); `FormMateria` marks the rainbow "custom" swatch active when the current color isn't a preset. `src/data/materias.ts` is an empty file.
