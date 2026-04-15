import { localize } from './localize.js';
import { ROW_HEIGHT, GAP } from './constants.js';
import { calcCols, calcRows, calcItemWidth, getImageUrl, getUri, getName } from './utils.js';
import { setLastDetectedLayout, detectLayout } from './layout.js';

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

  static getConfigElement() { return document.createElement('mass-coverwall-card-editor'); }
  static getStubConfig()    { return { entity_id: [], media_type: 'playlist', order_by: 'timestamp_added_desc', item_size: 3 }; }

  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1, max_columns: 12 };
  }

  setConfig(config) {
    if (!config.entity_id) throw new Error('mass-coverwall-card: entity_id is required');
    // Backward compat: entity_id used to be a string, now it's an array
    const entityId = Array.isArray(config.entity_id)
      ? config.entity_id
      : [config.entity_id];
    // Migrate legacy entity_ids into entity_id array
    const legacy = (config.entity_ids ?? []).filter(e => e && !entityId.includes(e));
    this._config = {
      media_type:        'playlist',
      order_by:          'timestamp_added_desc',
      item_size:         3,
      manual_items:      [],
      provider_instance: '',
      ...config,
      entity_id: [...entityId, ...legacy].filter(Boolean),
    };
    if (this._rendered) this._fetchItems();
  }

  // Returns all entities to play on
  _getEntities() {
    return (this._config.entity_id ?? []).filter(e => e && e.trim());
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
    setLastDetectedLayout(detectLayout(this));
    if (this._hass && !this._rendered) { this._render(); this._fetchItems(); }
  }

  disconnectedCallback() { this._resizeObserver?.disconnect(); }

  // ─── Data ─────────────────────────────────────────────────────────────────

  async _getConfigEntryId() {
    if (this._configEntryId) return this._configEntryId;
    try {
      const entries = await this._hass.callWS({ type: 'config/entity_registry/list' });
      const primaryId = Array.isArray(this._config.entity_id) ? this._config.entity_id[0] : this._config.entity_id;
      const entry   = entries.find(e => e.entity_id === primaryId);
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

    const providerFilter = this._config.provider_instance || '';
    const fetchLimit     = providerFilter ? 500 : this._getVisibleCount();

    try {
      const result = await this._hass.callWS({
        type:         'call_service',
        domain:       'music_assistant',
        service:      'get_library',
        service_data: {
          config_entry_id: configEntryId,
          media_type:      this._config.media_type || 'playlist',
          order_by:        this._config.order_by,
          limit:           fetchLimit,
          offset:          0,
        },
        return_response: true,
      });
      const data = result?.response ?? result;
      let items  = data?.items || (Array.isArray(data) ? data : []);

      if (providerFilter) {
        items = items.filter(item =>
          item.provider_mappings?.some(
            m => m.provider_instance_id === providerFilter ||
                 m.provider_domain === providerFilter
          )
        );
        items = items.slice(0, this._getVisibleCount());
      }

      this._items = items;
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

    // Fetch the full library and match by URI to preserve manual order
    try {
      const result = await this._hass.callWS({
        type:         'call_service',
        domain:       'music_assistant',
        service:      'get_library',
        service_data: {
          config_entry_id: configEntryId,
          media_type:      this._config.media_type || 'playlist',
          limit:           500,
          offset:          0,
        },
        return_response: true,
      });
      const data     = result?.response ?? result;
      const allItems = data?.items || (Array.isArray(data) ? data : []);
      const byUri    = Object.fromEntries(allItems.map(item => [item.uri, item]));
      this._items    = uris.map(uri => byUri[uri]).filter(Boolean);
    } catch (err) {
      this._error = err.message || 'Error loading manual items';
    }
    this._loading = false;
    this._updateGrid();
  }

  // ─── Layout ───────────────────────────────────────────────────────────────

  _calcCols(w)       { return calcCols(w, this._config.item_size); }
  _calcRows(w, h)    { return calcRows(w, h, this._config.item_size); }

  _getVisibleCount() {
    const w          = this._containerW || this.offsetWidth  || 300;
    const h          = this._containerH || this.offsetHeight || (2 * ROW_HEIGHT + GAP);
    const cols       = this._calcCols(w);
    const configRows = this._config.rows ? Math.max(1, parseInt(this._config.rows)) : null;
    const rows       = configRows ?? this._calcRows(w, h);
    return cols * rows;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _getImageUrl(item) { return getImageUrl(item, this._hass?.auth?.data?.hassUrl || ''); }
  _getUri(item)      { return getUri(item); }
  _getName(item)     { return getName(item); }

  async _play(item) {
    const uri      = this._getUri(item);
    const entities = this._getEntities();
    if (!uri || !entities.length) return;

    for (const entityId of entities) {
      try {
        await this._hass.callService('music_assistant', 'play_media', {
          entity_id:  entityId,
          media_id:   uri,
          media_type: this._config.media_type || 'playlist',
          enqueue:    'play',
        });
      } catch {
        try {
          await this._hass.callService('media_player', 'play_media', {
            entity_id:          entityId,
            media_content_id:   uri,
            media_content_type: this._config.media_type || 'playlist',
          });
        } catch { /* skip unreachable entity */ }
      }
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

      .skeleton {
        background: linear-gradient(
          135deg,
          var(--card-background-color, #1c1c1e) 25%,
          var(--secondary-background-color, rgba(255,255,255,0.07)) 50%,
          var(--card-background-color, #1c1c1e) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s ease-in-out infinite;
      }
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
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

    const w          = this._containerW || this.offsetWidth  || 300;
    const h          = this._containerH || this.offsetHeight || (2 * ROW_HEIGHT + GAP);
    const cols       = this._calcCols(w);
    const configRows = this._config.rows ? Math.max(1, parseInt(this._config.rows)) : null;
    const rows       = configRows ?? this._calcRows(w, h);

    // In Masonry (or any layout without a fixed parent height), set the host
    // height explicitly so the card expands to show all requested rows.
    if (configRows) {
      const itemW = calcItemWidth(w, this._config.item_size);
      this.style.height = `${Math.round(rows * itemW + (rows - 1) * GAP)}px`;
    } else {
      this.style.height = '';
    }

    if (this._loading) {
      const grid = document.createElement('div');
      grid.className = 'grid';
      grid.style.setProperty('--pl-cols', String(cols));
      grid.style.setProperty('--pl-rows', String(rows));
      for (let i = 0; i < cols * rows; i++) {
        const el = document.createElement('div');
        el.className = 'item skeleton';
        grid.appendChild(el);
      }
      root.replaceChildren(grid);
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

customElements.define('mass-coverwall-card', MassPlaylistCard);
