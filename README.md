# mass-playlist-card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Lovelace custom card for the **Sections** view of Home Assistant that displays a responsive grid of [Music Assistant](https://music-assistant.io/) covers — playlists, albums, or artists — and plays them with a single tap.

---

## Preview

<img width="516" height="132" alt="Screenshot 2026-04-01 at 00 50 58" src="https://github.com/user-attachments/assets/3f0b6093-99de-457c-a600-3dcb0850c018" />


---

## Features

- Fetches playlists, albums, or artists directly from your Music Assistant library
- Adaptive grid layout — automatically calculates columns and rows based on the card's actual pixel size using `ResizeObserver`
- **16 sort options**: date added, last played, play count, random, name, year, artist name (ascending and descending)
- **Manual mode**: pin up to 12 specific items by Music Assistant URI with drag-and-drop reordering in the visual editor
- Visual editor with entity picker filtered to Music Assistant `media_player` entities
- Auto-detects the `config_entry_id` from the entity registry — no manual configuration needed
- 100% HA theme tokens (`--ha-card-border-radius`, `--primary-color`, etc.) — adapts to any theme
- Full keyboard navigation and ARIA attributes
- No external dependencies, no build step required

---

## Requirements

- [Music Assistant](https://music-assistant.io/) **integration** installed in Home Assistant (not just the add-on)
- A `media_player` entity provided by Music Assistant

---

## Installation

### Via HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** → click the three-dot menu → **Custom repositories**.
3. Add `https://github.com/eliseo-juan/mass-playlist-card` with category **Lovelace**.
4. Search for **Music Assistant Playlist Card** and install it.
5. Reload your browser.

### Manual

1. Download `dist/mass-playlist-card.js` from the [latest release](https://github.com/eliseo-juan/mass-playlist-card/releases).
2. Copy the file to `/config/www/mass-playlist-card.js`.
3. Go to **Settings → Dashboards → Resources → Add resource**:
   - URL: `/local/mass-playlist-card.js`
   - Type: `JavaScript module`
4. Reload your browser.

---

## Configuration

Add the card via the visual editor or paste the YAML directly.

### Minimal

```yaml
type: custom:mass-playlist-card
entity_id: media_player.salon
```

### Full example

```yaml
type: custom:mass-playlist-card
entity_id: media_player.salon
media_type: playlist          # playlist | album | artist
order_by: timestamp_added_desc
item_size: 3                  # grid columns per cover (Sections grid = 12 cols)
```

### Manual mode example

```yaml
type: custom:mass-playlist-card
entity_id: media_player.salon
media_type: playlist
order_by: manual
item_size: 3
manual_items:
  - library://playlist/5
  - library://playlist/12
  - library://album/42
```

---

## Configuration options

| Option | Type | Default | Description |
|---|---|---|---|
| `entity_id` | `string` | **required** | Music Assistant `media_player` entity |
| `media_type` | `string` | `playlist` | Content type: `playlist`, `album`, or `artist` |
| `order_by` | `string` | `timestamp_added_desc` | Sort order (see table below) |
| `item_size` | `number` | `3` | Width of each cover in Sections grid columns (1–12) |
| `manual_items` | `list` | `[]` | List of Music Assistant URIs (only used when `order_by: manual`) |
| `config_entry_id` | `string` | _(auto-detected)_ | Override the Music Assistant config entry ID |

### `order_by` values

| Value | Description |
|---|---|
| `timestamp_added_desc` | Date added (newest first) |
| `timestamp_added` | Date added (oldest first) |
| `last_played_desc` | Last played (newest first) |
| `last_played` | Last played (oldest first) |
| `play_count_desc` | Play count (highest first) |
| `play_count` | Play count (lowest first) |
| `random` | Random |
| `random_less_played` | Random (least played) |
| `name` | Name (A → Z) |
| `name_desc` | Name (Z → A) |
| `sort_name` | Sort name (A → Z) |
| `sort_name_desc` | Sort name (Z → A) |
| `year_desc` | Year (newest first) |
| `year` | Year (oldest first) |
| `artist_name` | Artist name (A → Z) |
| `artist_name_desc` | Artist name (Z → A) |
| `manual` | Manual order (uses `manual_items`) |

---

## Finding URIs for manual mode

1. Go to **Developer Tools → Actions** in your Home Assistant instance.
2. Select action `music_assistant.get_library`.
3. Fill in:
   - `config_entry_id`: your Music Assistant instance ID
   - `media_type`: `playlist`, `album`, or `artist`
4. Click **Perform action**.
5. In the response, copy the `uri` field of the item you want (e.g. `library://playlist/5`).

---

## Sections view tips

The card implements `getGridOptions()` with a default of **12 columns × 2 rows** and a minimum of **3 columns**. This means:

- Drag the card to span the full width (12 cols) for maximum covers.
- Adjust `item_size` to control how many covers fit per row — e.g. `item_size: 3` gives 4 covers per row on a full-width card.
- The card adapts dynamically if you resize it.

---

## License

[MIT](LICENSE) © eliseo-juan
