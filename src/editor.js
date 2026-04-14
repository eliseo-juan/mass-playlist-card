import { localize } from './localize.js';
import { MEDIA_TYPES, ORDER_BY_OPTIONS, MANUAL_SLOTS } from './constants.js';
import { _lastDetectedLayout } from './layout.js';

class MassPlaylistCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config        = {};
    this._hass          = null;
    this._dragSrcIdx    = null;
    this._providers     = null;
    this._providersKey  = null;
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
    const rawId   = config.entity_id;
    const entityId = Array.isArray(rawId) ? rawId : (rawId ? [rawId] : []);
    const legacy   = (config.entity_ids ?? []).filter(e => e && !entityId.includes(e));
    this._config = {
      media_type:   'playlist',
      order_by:     'timestamp_added_desc',
      item_size:    3,
      manual_items: [],
      ...config,
      entity_id: [...entityId, ...legacy].filter(Boolean),
    };
    this._renderEditor();
  }

  _fire(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config }, bubbles: true, composed: true,
    }));
  }

  async _fetchProviders() {
    const key = (this._config.config_entry_id || '') + '|' +
                (Array.isArray(this._config.entity_id) ? this._config.entity_id[0] : this._config.entity_id || '') + '|' +
                (this._config.media_type || 'playlist');
    if (this._providers !== null && this._providersKey === key) return this._providers;

    try {
      let configEntryId = this._config.config_entry_id;
      if (!configEntryId) {
        const entries  = await this._hass.callWS({ type: 'config/entity_registry/list' });
        const primaryId = Array.isArray(this._config.entity_id) ? this._config.entity_id[0] : this._config.entity_id;
        const entry    = entries.find(e => e.entity_id === primaryId);
        configEntryId  = entry?.config_entry_id;
      }
      if (!configEntryId) throw new Error('no config_entry_id');

      const result = await this._hass.callWS({
        type:         'call_service',
        domain:       'music_assistant',
        service:      'get_library',
        service_data: {
          config_entry_id: configEntryId,
          media_type:      this._config.media_type || 'playlist',
          limit:           200,
          offset:          0,
        },
        return_response: true,
      });
      const data  = result?.response ?? result;
      const items = data?.items || (Array.isArray(data) ? data : []);

      const seen = new Map();
      for (const item of items) {
        for (const m of item.provider_mappings ?? []) {
          if (m.provider_instance_id && !seen.has(m.provider_instance_id)) {
            seen.set(m.provider_instance_id, m.name ?? m.provider_domain ?? m.provider_instance_id);
          }
        }
      }
      this._providers    = [...seen.entries()].map(([value, label]) => ({ value, label }));
    } catch {
      this._providers = [];
    }
    this._providersKey = key;
    return this._providers;
  }

  async _renderEditor() {
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
    const providers = this._hass ? await this._fetchProviders() : [];
    const formHost  = shadow.getElementById('form-host');
    const form      = document.createElement('ha-form');
    form.hass       = this._hass;
    form.schema     = [
      {
        name:     'entity_id',
        required: true,
        label:    localize('editor_speaker', lang),
        selector: { entity: { domain: 'media_player', integration: 'music_assistant', multiple: true } },
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
      ...(_lastDetectedLayout !== 'sections' ? [{
        name:  'rows',
        label: localize('editor_rows', lang),
        selector: { number: { min: 1, max: 20, step: 1, mode: 'box' } },
      }] : []),
      ...(providers.length > 1 ? [{
        name:  'provider_instance',
        label: localize('editor_provider_instance', lang),
        selector: {
          select: {
            options: [
              { value: '', label: localize('provider_all', lang) },
              ...providers,
            ],
            mode: 'dropdown',
          },
        },
      }] : []),
    ];
    form.data = { ...this._config };
    form.computeLabel = (s) => s.label ?? s.name;

    form.addEventListener('value-changed', (e) => {
      const val       = { ...e.detail.value };
      const newConfig = { ...this._config, ...val };
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

customElements.define('mass-coverwall-card-editor', MassPlaylistCardEditor);
