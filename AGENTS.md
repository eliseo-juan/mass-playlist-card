# AGENTS.md — Context for AI agents

## What this project is

`mass-coverwall-card` is a single-file vanilla JS Lovelace custom card for Home Assistant.
It displays a responsive grid of Music Assistant covers (playlists, albums, artists) and plays them on tap.
Designed specifically for the **Sections view** of Home Assistant.

## Architecture

- **No build step.** The source and the distributed file are the same thing: `dist/mass-coverwall-card.js`.
- **No framework.** Plain custom elements (`HTMLElement`), Shadow DOM, `ResizeObserver`.
- **No external dependencies.** Only HA built-ins (`ha-form`, `ha-entity-picker`) and the MA WebSocket API.
- `src/` does not exist — `dist/` is the source of truth.

## Key files

| File | Purpose |
|---|---|
| `dist/mass-coverwall-card.js` | The card — editor + main card in one file (i18n inlined) |
| `tests/utils.test.js` | Unit tests for pure exported functions |
| `hacs.json` | HACS plugin manifest — `filename` must stay `mass-coverwall-card.js` |

## Exported pure functions (testable)

`calcCols`, `calcRows`, `getImageUrl`, `getUri`, `getName` are exported from the card file.
All business logic changes to these functions **must** be covered by tests in `tests/utils.test.js`.

## Layout constants

- `ROW_HEIGHT = 56` — px per Sections grid row
- `GAP = 8` — px gap between items
- Sections grid is 12 columns wide
- `item_size` config option = width of each cover in Sections grid columns

## HA API calls

- Library data: `music_assistant.get_library` via `hass.callWS` with `return_response: true`
- Playback: `music_assistant.play_media`, fallback to `media_player.play_media`
- Entity resolution: `config/entity_registry/list` to auto-detect `config_entry_id`

## Running tests and lint

```bash
npm test          # vitest run (41 tests)
npm run lint      # oxlint
```

## CI checks required to merge to main

- **Validate HACS** — validates `hacs.json` and repo structure
- **Lint** — oxlint on `dist/` and `tests/`
- **Test** — vitest unit tests

## What NOT to do

- Do not create a `src/` directory — `dist/` is the source of truth.
- Do not add a build step or bundler without explicit request.
- Do not add external npm runtime dependencies — only devDependencies are allowed.
- Do not modify `hacs.json` filename field — HACS depends on it.
- Do not skip tests when changing `calcCols`, `calcRows`, `getImageUrl`, `getUri`, or `getName`.
