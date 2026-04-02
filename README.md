# mass-coverwall-card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Lovelace custom card for the **Sections** view of Home Assistant that displays a responsive grid of [Music Assistant](https://music-assistant.io/) covers — playlists, albums, or artists — and plays them with a single tap.

---

## Preview

<img width="1327" height="900" alt="image" src="https://github.com/user-attachments/assets/9b4fbb2e-db2a-47d0-9b81-2b1d56204fd4" />



---

## Features

- 🎵 **Playlists, albums or artists** — choose what you want to browse
- 🔊 **Pick your speakers** — one or more Music Assistant media players for instant multiroom
- 🎛️ **Sort your way** — 16 options: recently added, last played, most played, random, alphabetical…
- 📌 **Manual mode** — pin exactly the covers you want, drag to reorder
- 🎨 **Fits your theme** — 100% aligned with your Home Assistant visual style
- ⚡ **Built for Sections** — the grid adapts automatically to any card size

One tap. The right vibe.

---

## Requirements

- [Music Assistant](https://music-assistant.io/) **integration** installed in Home Assistant (not just the add-on)
- A `media_player` entity provided by Music Assistant

---

## Some more examples

<img width="516" height="132" alt="Screenshot 2026-04-01 at 00 50 58" src="https://github.com/user-attachments/assets/3f0b6093-99de-457c-a600-3dcb0850c018" />
<img width="538" height="184" alt="image" src="https://github.com/user-attachments/assets/eba771fe-84a0-43a2-bfc9-bb263d1ffea9" />
<img width="491" height="236" alt="image" src="https://github.com/user-attachments/assets/d864facd-bd21-4d20-9ef5-4e8e183de162" />
<img width="526" height="237" alt="image" src="https://github.com/user-attachments/assets/a02c0327-a3ec-47a4-8fc7-56e4ba5f0e9c" />

---

## Installation

### Via HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** → click the three-dot menu → **Custom repositories**.
3. Add `https://github.com/eliseo-juan/mass-coverwall-card` with category **Lovelace**.
4. Search for **Music Assistant Cover Wall** and install it.
5. Reload your browser.

### Manual

1. Download `dist/mass-coverwall-card.js` from the [latest release](https://github.com/eliseo-juan/mass-coverwall-card/releases).
2. Copy the file to `/config/www/mass-coverwall-card.js`.
3. Go to **Settings → Dashboards → Resources → Add resource**:
   - URL: `/local/mass-coverwall-card.js`
   - Type: `JavaScript module`
4. Reload your browser.

---

## Configuration

Add the card via the visual editor or paste the YAML directly.

### Minimal

```yaml
type: custom:mass-coverwall-card
entity_id: media_player.salon
```

### Full example

```yaml
type: custom:mass-coverwall-card
entity_id:
  - media_player.salon
  - media_player.cocina
media_type: playlist          # playlist | album | artist
order_by: timestamp_added_desc
item_size: 3                  # grid columns per cover (Sections grid = 12 cols)
```

### Manual mode example

```yaml
type: custom:mass-coverwall-card
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
| `entity_id` | `string` or `list` | **required** | One or more Music Assistant `media_player` entities. The first one is used to detect the MA instance. Supports multiroom out of the box. |
| `media_type` | `string` | `playlist` | Content type: `playlist`, `album`, or `artist` |
| `order_by` | `string` | `timestamp_added_desc` | Sort order (see table below) |
| `item_size` | `number` | `3` | Width of each cover in Sections grid columns (1–12) |
| `rows` | `number` | _(auto)_ | Number of rows to display. **Required for Masonry dashboards.** Leave unset in Sections — the card auto-fits to the card height. |
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

## Examples

### Recently added playlists — full width

Show your latest additions across the full dashboard width.

```yaml
type: custom:mass-coverwall-card
entity_id: media_player.salon
media_type: playlist
order_by: timestamp_added_desc
item_size: 3
```

> _(screenshot coming soon)_

---

### Albums sorted by year — compact

A tight grid of your newest albums, smaller covers for a denser look.

```yaml
type: custom:mass-coverwall-card
entity_id: media_player.salon
media_type: album
order_by: year_desc
item_size: 2
```

> _(screenshot coming soon)_

---

### Multiroom — one tap, whole house

Tap a cover and every room plays in sync.

```yaml
type: custom:mass-coverwall-card
entity_id:
  - media_player.salon
  - media_player.cocina
  - media_player.habitacion
media_type: playlist
order_by: last_played_desc
item_size: 3
```

> _(screenshot coming soon)_

---

### Manual — your go-to playlists

Always there, always in the right order. The ones you actually reach for.

```yaml
type: custom:mass-coverwall-card
entity_id: media_player.salon
media_type: playlist
order_by: manual
item_size: 4
manual_items:
  - library://playlist/5    # Morning coffee
  - library://playlist/12   # Focus
  - library://playlist/7    # After dark
```

> _(screenshot coming soon)_

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

## License

[MIT](LICENSE) © eliseo-juan
