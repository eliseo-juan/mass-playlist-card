/**
 * mass-playlist-card — Music Assistant Media Grid Card
 * Designed for the Home Assistant Sections view.
 *
 * Installation:
 *   1. Copy to /config/www/mass-playlist-card.js
 *   2. Settings → Dashboards → Resources → + Add resource
 *      URL: /local/mass-playlist-card.js  |  Type: JavaScript module
 */

import { localize } from './localize/localize.js';

const ROW_HEIGHT = 56;
const GAP        = 8;

const MEDIA_TYPES = [
  { value: 'playlist', labelKey: 'type_playlist' },
  { value: 'album',    labelKey: 'type_album'    },
  { value: 'artist',   labelKey: 'type_artist'   },
];

// order_by values exposed by Music Assistant
const ORDER_BY_OPTIONS = [
  { value: 'timestamp_added_desc', labelKey: 'order_timestamp_added_desc' },
  { value: 'timestamp_added',      labelKey: 'order_timestamp_added'      },
  { value: 'last_played_desc',     labelKey: 'order_last_played_desc'     },
  { value: 'last_played',          labelKey: 'order_last_played'          },
  { value: 'play_count_desc',      labelKey: 'order_play_count_desc'      },
  { value: 'play_count',           labelKey: 'order_play_count'           },
  { value: 'random',               labelKey: 'order_random'               },
  { value: 'random_less_played',   labelKey: 'order_random_less_played'   },
  { value: 'name',                 labelKey: 'order_name'                 },
  { value: 'name_desc',            labelKey: 'order_name_desc'            },
  { value: 'sort_name',            labelKey: 'order_sort_name'            },
  { value: 'sort_name_desc',       labelKey: 'order_sort_name_desc'       },
  { value: 'year_desc',            labelKey: 'order_year_desc'            },
  { value: 'year',                 labelKey: 'order_year'                 },
  { value: 'artist_name',          labelKey: 'order_artist_name'          },
  { value: 'artist_name_desc',     labelKey: 'order_artist_name_desc'     },
  { value: 'manual',               labelKey: 'order_manual'               },
];

const MANUAL_SLOTS = 12;

// ─── Editor ───────────────────────────────────────────────────────────────────

class MassPlaylistCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config     = {};
    this._hass       = null;
    this._dragSrcIdx = null;
  }

  set hass(hass) {
    const oldLang = this._hass?.language;
    this._hass = hass;
    this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => p.hass = hass);
    if (this._hass?.language !== oldLang) {
      this._renderEditor();
    }
  }

  setConfig(config) {
    this._config = {
      media_type:   'playlist',
      order_by:     'timestamp_added_desc',
      item_size:    3,
      manual_items: [],
      ...config,
    };
    this._renderEditor();
  }

  _fire(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config }, bubbles: true, composed: true,
    }));
  }

  _renderEditor() {
    const shadow   = this.shadowRoot;
    const isManual = this._config.order_by === 'manual';
    const lang     = this._hass?.language || 'en';

    shadow.innerHTML = `
      <style>
        :host { display: block; }

        ha-form { display: block; }

        .section-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 16px 0 8px;
          border-top: 1px solid var(--divider-color, rgba(255,255,255,0.1));
          margin-top: 8px;
        }

        .section-title:first-child { border-top: none; padding-top: 0; }

        .manual-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }

        .slot {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          padding: 4px 4px 4px 0;
          transition: background 0.1s;
        }

        .slot.drag-over {
          background: var(--primary-color, #03a9f4);
          opacity: 0.3;
        }

        .drag-handle {
          cursor: grab;
          color: var(--secondary-text-color);
          padding: 0 4px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          user-select: none;
        }

        .drag-handle:active { cursor: grabbing; }

        .drag-handle svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
          opacity: 0.5;
        }

        .slot ha-entity-picker {
          flex: 1;
          min-width: 0;
        }

        .slot-num {
          font-size: 11px;
          color: var(--secondary-text-color);
          opacity: 0.5;
          width: 16px;
          text-align: right;
          flex-shrink: 0;
        }

        .uri-input {
          flex: 1;
          min-width: 0;
          background: var(--card-background-color, var(--ha-card-background));
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 13px;
          font-family: var(--primary-font-family, monospace);
          outline: none;
          box-sizing: border-box;
        }

        .uri-input:focus {
          border-color: var(--primary-color, #03a9f4);
        }

        .uri-input::placeholder {
          color: var(--secondary-text-color);
          opacity: 0.5;
        }
      </style>

      <div id="form-host"></div>

      ${isManual ? `
        <div class="section-title">${localize('editor_manual_items', lang)}</div>
        <div class="manual-list" id="manual-list">
          ${Array.from({ length: MANUAL_SLOTS }, (_, i) => {
            const uri = this._config.manual_items?.[i] ?? '';
            return `
              <div class="slot" draggable="true" data-idx="${i}">
                <span class="slot-num">${i + 1}</span>
                <div class="drag-handle">
                  <svg viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
                <input
                  type="text"
                  class="uri-input"
                  data-slot="${i}"
                  value="${uri}"
                  placeholder="library://playlist/5"
                />
              </div>`;
          }).join('')}
        </div>
      ` : ''}
    `;

    // ── ha-form for main fields ──
    const formHost = shadow.getElementById('form-host');
    const form     = document.createElement('ha-form');
    form.hass      = this._hass;
    form.schema    = [
      {
        name:     'entity_id',
        required: true,
        label:    localize('editor_speaker', lang),
        selector: { entity: { domain: 'media_player', integration: 'music_assistant' } },
      },
      {
        name:  'media_type',
        label: localize('editor_content_type', lang),
        selector: {
          select: {
            options: MEDIA_TYPES.map(t => ({ value: t.value, label: localize(t.labelKey, lang) })),
            mode:    'dropdown',
          },
        },
      },
      {
        name:  'order_by',
        label: localize('editor_sort_by', lang),
        selector: {
          select: {
            options: ORDER_BY_OPTIONS.map(o => ({ value: o.value, label: localize(o.labelKey, lang) })),
            mode:    'dropdown',
          },
        },
      },
      {
        name:  'item_size',
        label: localize('editor_cover_size', lang),
        selector: { number: { min: 1, max: 12, step: 1, mode: 'box' } },
      },
    ];
    form.data         = this._config;
    form.computeLabel = (s) => s.label ?? s.name;

    form.addEventListener('value-changed', (e) => {
      const newConfig = { ...this._config, ...e.detail.value };
      if (newConfig.order_by === 'manual' && !newConfig.manual_items?.length) {
        newConfig.manual_items = Array(MANUAL_SLOTS).fill('');
      }
      this._fire(newConfig);
      if ((newConfig.order_by === 'manual') !== isManual) {
        this._renderEditor();
      }
    });

    formHost.appendChild(form);

    // ── URI text inputs for manual mode ──
    if (isManual) {
      shadow.querySelectorAll('input.uri-input[data-slot]').forEach(input => {
        const idx = parseInt(input.getAttribute('data-slot'));
        input.addEventListener('change', (e) => {
          const items = [...(this._config.manual_items ?? Array(MANUAL_SLOTS).fill(''))];
          items[idx]  = e.target.value.trim();
          this._fire({ ...this._config, manual_items: items });
        });
      });

      // ── Drag & drop to reorder ──
      const list = shadow.getElementById('manual-list');
      const slots = list.querySelectorAll('.slot');

      list.addEventListener('dragstart', (e) => {
        const slot = e.target.closest('.slot');
        if (!slot) return;
        this._dragSrcIdx = parseInt(slot.dataset.idx);
        e.dataTransfer.effectAllowed = 'move';
      });

      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const slot = e.target.closest('.slot');
        slots.forEach(s => s.classList.remove('drag-over'));
        if (slot) slot.classList.add('drag-over');
      });

      list.addEventListener('dragleave', () => {
        slots.forEach(s => s.classList.remove('drag-over'));
      });

      list.addEventListener('drop', (e) => {
        e.preventDefault();
        const slot = e.target.closest('.slot');
        slots.forEach(s => s.classList.remove('drag-over'));
        if (!slot || this._dragSrcIdx === null) return;
        const destIdx = parseInt(slot.dataset.idx);
        if (destIdx === this._dragSrcIdx) return;

        const items     = [...(this._config.manual_items ?? Array(MANUAL_SLOTS).fill(''))];
        const [moved]   = items.splice(this._dragSrcIdx, 1);
        items.splice(destIdx, 0, moved);
        this._dragSrcIdx = null;
        this._fire({ ...this._config, manual_items: items });
        this._renderEditor();
      });
    }
  }
}

customElements.define('mass-playlist-card-editor', MassPlaylistCardEditor);

// ─── Main Card ────────────────────────────────────────────────────────────────

class MassPlaylistCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass           = null;
    this._config         = {};
    this._items          = [];
    this._loading        = false;
    this._error          = null;
    this._rendered       = false;
    this._configEntryId  = null;
    this._resizeObserver = null;
    this._containerW     = 0;
    this._containerH     = 0;
  }

  static getConfigElement() { return document.createElement('mass-playlist-card-editor'); }
  static getStubConfig()    { return { entity_id: '', media_type: 'playlist', order_by: 'timestamp_added_desc', item_size: 3 }; }

  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1, max_columns: 12 };
  }

  setConfig(config) {
    if (!config.entity_id) throw new Error('mass-playlist-card: entity_id is required');
    this._config = {
      media_type:   'playlist',
      order_by:     'timestamp_added_desc',
      item_size:    3,
      manual_items: [],
      ...config,
    };
    if (this._rendered) this._fetchItems();
  }

  set hass(hass) {
    const oldLang = this._hass?.language;
    const first = !this._hass;
    this._hass  = hass;
    if (first) {
      this._render();
      this._fetchItems();
    } else if (this._hass?.language !== oldLang && this._rendered) {
      this._updateGrid();
    }
  }

  connectedCallback() {
    if (this._hass && !this._rendered) { this._render(); this._fetchItems(); }
  }

  disconnectedCallback() { this._resizeObserver?.disconnect(); }

  // ─── Data ─────────────────────────────────────────────────────────────────

  async _getConfigEntryId() {
    if (this._configEntryId) return this._configEntryId;
    try {
      const entries = await this._hass.callWS({ type: 'config/entity_registry/list' });
      const entry   = entries.find(e => e.entity_id === this._config.entity_id);
      if (entry?.config_entry_id) this._configEntryId = entry.config_entry_id;
    } catch (_) { /* silent — config_entry_id may be provided manually */ }
    return this._configEntryId;
  }

  async _fetchItems() {
    if (!this._hass) return;

    if (this._config.order_by === 'manual') {
      await this._resolveManualItems();
      return;
    }

    this._loading = true;
    this._error   = null;
    this._updateGrid();

    const configEntryId = this._config.config_entry_id || await this._getConfigEntryId();
    if (!configEntryId) {
      this._error   = localize('error_instance_not_found', this._hass?.language);
      this._loading = false;
      this._updateGrid();
      return;
    }

    try {
      const result = await this._hass.callWS({
        type:         'call_service',
        domain:       'music_assistant',
        service:      'get_library',
        service_data: {
          config_entry_id: configEntryId,
          media_type:      this._config.media_type || 'playlist',
          order_by:        this._config.order_by,
          limit:           128,
          offset:          0,
        },
        return_response: true,
      });
      const data  = result?.response ?? result;
      this._items = data?.items || (Array.isArray(data) ? data : []);
    } catch (err) {
      this._error = err.message || localize('error_loading_content', this._hass?.language);
    }

    this._loading = false;
    this._updateGrid();
  }

  async _resolveManualItems() {
    this._loading = true;
    this._error   = null;
    this._updateGrid();

    const uris = (this._config.manual_items ?? []).filter(u => u && u.trim());
    if (!uris.length) {
      this._items   = [];
      this._loading = false;
      this._updateGrid();
      return;
    }

    const configEntryId = this._config.config_entry_id || await this._getConfigEntryId();
    if (!configEntryId) {
      this._error   = localize('error_instance_not_found', this._hass?.language);
      this._loading = false;
      this._updateGrid();
      return;
    }

    // Resolve each URI via MA search (exact URI match returns the item)
    const resolved = [];
    for (const uri of uris) {
      try {
        const result = await this._hass.callWS({
          type:         'call_service',
          domain:       'music_assistant',
          service:      'search',
          service_data: {
            config_entry_id: configEntryId,
            name:            uri,
            media_type:      [this._config.media_type || 'playlist'],
            library_only:    true,
            limit:           1,
          },
          return_response: true,
        });
        const data  = result?.response ?? result;
        const key   = `${this._config.media_type || 'playlist'}s`; // playlists | albums | artists
        const items = data?.[key] ?? [];
        if (items.length) resolved.push(items[0]);
      } catch (_) { /* skip unresolvable URI */ }
    }

    this._items   = resolved;
    this._loading = false;
    this._updateGrid();
  }

  // ─── Layout ───────────────────────────────────────────────────────────────

  _calcCols(w) {
    const itemCols = Math.max(1, parseInt(this._config.item_size) || 3);
    const colW     = (w - 11 * GAP) / 12;
    const itemW    = itemCols * colW + (itemCols - 1) * GAP;
    return Math.max(1, Math.floor((w + GAP) / (itemW + GAP)));
  }

  _calcRows(w, h) {
    if (!h || h < ROW_HEIGHT) return 1;
    const itemCols = Math.max(1, parseInt(this._config.item_size) || 3);
    const colW     = (w - 11 * GAP) / 12;
    const itemW    = itemCols * colW + (itemCols - 1) * GAP;
    return Math.max(1, Math.floor((h + GAP) / (itemW + GAP)));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _getImageUrl(item) {
    const raw = item?.metadata?.images?.[0]?.url
      || item?.image?.url || item?.image || item?.thumbnail || null;
    if (!raw) return null;
    if (raw.startsWith('http')) return raw;
    const hassUrl = this._hass?.auth?.data?.hassUrl || '';
    return `${hassUrl}/api/music_assistant/image_proxy?url=${encodeURIComponent(raw)}`;
  }

  _getUri(item)  { return item?.uri || item?.item_id || ''; }
  _getName(item) { return item?.name || item?.title  || ''; }

  async _play(item) {
    const uri = this._getUri(item);
    if (!uri) return;
    try {
      await this._hass.callService('music_assistant', 'play_media', {
        entity_id:  this._config.entity_id,
        media_id:   uri,
        media_type: this._config.media_type || 'playlist',
        enqueue:    'play',
      });
    } catch {
      // Fallback to standard media_player service
      await this._hass.callService('media_player', 'play_media', {
        entity_id:          this._config.entity_id,
        media_content_id:   uri,
        media_content_type: this._config.media_type || 'playlist',
      });
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  _render() {
    if (this._rendered) return;
    this._rendered = true;

    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
      #root { width: 100%; height: 100%; box-sizing: border-box; }

      .grid {
        display: grid;
        width: 100%; height: 100%;
        box-sizing: border-box;
        grid-template-columns: repeat(var(--pl-cols, 4), 1fr);
        grid-template-rows: repeat(var(--pl-rows, 2), 1fr);
        gap: ${GAP}px;
        overflow: hidden;
      }

      .item {
        position: relative;
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
        background: var(--card-background-color, var(--ha-card-background, #1c1c1e));
        cursor: pointer;
        box-shadow: var(--ha-card-box-shadow, none);
        border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, transparent);
        transition: filter 0.15s ease, transform 0.12s ease;
        -webkit-tap-highlight-color: transparent;
        outline: none;
        min-width: 0; min-height: 0;
      }

      .item:hover         { filter: brightness(1.1); }
      .item:active        { transform: scale(0.95); filter: brightness(0.88); }
      .item:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }

      .item img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

      .placeholder {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        background: var(--secondary-background-color, rgba(255,255,255,0.05));
      }
      .placeholder svg { width: 40%; height: 40%; fill: var(--secondary-text-color, #9e9e9e); opacity: 0.4; }

      .item::after {
        content: ''; position: absolute; inset: 0;
        background: var(--primary-color, #03a9f4);
        opacity: 0; pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .item.tapped::after { opacity: 0.15; }

      .state {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%; gap: 8px; padding: 20px; box-sizing: border-box;
        color: var(--secondary-text-color, #9e9e9e);
        font-size: 13px; font-family: var(--primary-font-family, inherit); text-align: center;
      }

      .loader { width: 100%; max-width: 120px; height: 2px; border-radius: 1px; background: var(--divider-color, rgba(255,255,255,0.12)); overflow: hidden; }
      .loader::after { content: ''; display: block; width: 40%; height: 100%; background: var(--primary-color, #03a9f4); border-radius: 1px; animation: slide 1.1s ease-in-out infinite; }
      @keyframes slide { 0% { transform: translateX(-150%); } 100% { transform: translateX(500%); } }
    `;

    this.shadowRoot.appendChild(style);

    const root = document.createElement('div');
    root.id    = 'root';
    this.shadowRoot.appendChild(root);

    this._resizeObserver = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (Math.abs(w - this._containerW) > 1 || Math.abs(h - this._containerH) > 1) {
        this._containerW = w;
        this._containerH = h;
        this._updateGrid();
      }
    });
    this._resizeObserver.observe(this);
    this._updateGrid();
  }

  _updateGrid() {
    if (!this._rendered) return;
    const root = this.shadowRoot.getElementById('root');
    if (!root) return;

    const lang = this._hass?.language || 'en';

    if (this._loading) {
      root.innerHTML = `<div class="state"><div class="loader"></div>${localize('state_loading', lang)}</div>`;
      return;
    }
    if (this._error) {
      root.innerHTML = `<div class="state">⚠️ ${this._error}</div>`;
      return;
    }
    if (!this._items.length) {
      root.innerHTML = `<div class="state">${localize('state_no_items', lang)}</div>`;
      return;
    }

    const w     = this._containerW || this.offsetWidth  || 300;
    const h     = this._containerH || this.offsetHeight || (2 * ROW_HEIGHT + GAP);
    const cols  = this._calcCols(w);
    const rows  = this._calcRows(w, h);
    const items = this._items.slice(0, cols * rows);

    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.setProperty('--pl-cols', String(cols));
    grid.style.setProperty('--pl-rows', String(rows));

    for (const item of items) {
      const imgUrl = this._getImageUrl(item);
      const name   = this._getName(item);

      const el = document.createElement('div');
      el.className = 'item';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${localize('aria_play', lang)} ${name}`);
      el.title = name;

      if (imgUrl) {
        const img   = document.createElement('img');
        img.src     = imgUrl;
        img.alt     = name;
        img.loading = 'lazy';
        img.onerror = () => img.replaceWith(this._makePlaceholder());
        el.appendChild(img);
      } else {
        el.appendChild(this._makePlaceholder());
      }

      el.addEventListener('click', () => {
        el.classList.add('tapped');
        setTimeout(() => el.classList.remove('tapped'), 300);
        this._play(item);
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });

      grid.appendChild(el);
    }

    root.innerHTML = '';
    root.appendChild(grid);
  }

  _makePlaceholder() {
    const div     = document.createElement('div');
    div.className = 'placeholder';
    div.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2z
               M17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3
               3-1.34 3-3V8h3V6h-5z"/>
    </svg>`;
    return div;
  }

  getCardSize() { return 2; }
}

customElements.define('mass-playlist-card', MassPlaylistCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'mass-playlist-card',
  name:        'Music Assistant Playlist Card',
  description: 'Music Assistant cover grid for Sections view (playlists, albums, artists)',
  preview:     false,
});
