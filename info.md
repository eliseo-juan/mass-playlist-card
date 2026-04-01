# Music Assistant Cover Wall

A Lovelace custom card for the **Sections** view that displays a responsive grid of Music Assistant covers (playlists, albums, or artists) and plays them on tap.

## Features

- Displays playlists, albums, or artists from your Music Assistant library
- Adaptive grid layout using ResizeObserver — fits any card size
- 16 sort options (date added, last played, play count, random, name, year…)
- Manual mode: pin up to 12 specific items by URI with drag-and-drop reordering
- Visual editor with entity picker filtered to Music Assistant speakers
- 100% HA theme tokens — no hardcoded colors
- No external dependencies, no build step required

## Requirements

- [Music Assistant](https://music-assistant.io/) integration installed in Home Assistant
- A `media_player` entity provided by Music Assistant
