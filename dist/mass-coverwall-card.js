/**
 * mass-coverwall-card — Music Assistant Media Grid Card
 * Designed for the Home Assistant Sections view.
 *
 * Installation:
 *   1. Copy to /config/www/mass-coverwall-card.js
 *   2. Settings → Dashboards → Resources → + Add resource
 *      URL: /local/mass-coverwall-card.js  |  Type: JavaScript module
 */

// ─── i18n ─────────────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    editor_speaker:       'Speakers',
    editor_content_type:  'Content type',
    editor_sort_by:       'Sort by',
    editor_cover_size:    'Cover size (grid columns) 🔥',
    editor_manual_items:        'Manual items (drag to reorder)',

    type_playlist:        'Playlists',
    type_album:           'Albums',
    type_artist:          'Artists',
    order_timestamp_added_desc:  'Date added (newest first)',
    order_timestamp_added:       'Date added (oldest first)',
    order_last_played_desc:      'Last played (newest first)',
    order_last_played:           'Last played (oldest first)',
    order_play_count_desc:       'Play count (highest first)',
    order_play_count:            'Play count (lowest first)',
    order_random:                'Random',
    order_random_less_played:    'Random (least played)',
    order_name:                  'Name (A → Z)',
    order_name_desc:             'Name (Z → A)',
    order_sort_name:             'Sort name (A → Z)',
    order_sort_name_desc:        'Sort name (Z → A)',
    order_year_desc:             'Year (newest first)',
    order_year:                  'Year (oldest first)',
    order_artist_name:           'Artist name (A → Z)',
    order_artist_name_desc:      'Artist name (Z → A)',
    order_manual:                '— Manual —',
    state_loading:               'Loading…',
    error_instance_not_found:    'Music Assistant instance not found. Check entity_id.',
    error_loading_content:       'Error loading content',
    state_no_items:              'No items found in library',
    aria_play:                   'Play',
  },
  es: {
    editor_speaker:       'Altavoces',
    editor_content_type:  'Tipo de contenido',
    editor_sort_by:       'Ordenar por',
    editor_cover_size:    'Tamaño de portada (columnas de cuadrícula)',
    editor_manual_items:        'Elementos manuales (arrastrar para reordenar)',

    type_playlist:        'Listas de reproducción',
    type_album:           'Álbumes',
    type_artist:          'Artistas',
    order_timestamp_added_desc:  'Fecha de adición (más reciente primero)',
    order_timestamp_added:       'Fecha de adición (más antigua primero)',
    order_last_played_desc:      'Última reproducción (más reciente primero)',
    order_last_played:           'Última reproducción (más antigua primero)',
    order_play_count_desc:       'Número de reproducciones (mayor a menor)',
    order_play_count:            'Número de reproducciones (menor a mayor)',
    order_random:                'Aleatorio',
    order_random_less_played:    'Aleatorio (menos reproducido)',
    order_name:                  'Nombre (A → Z)',
    order_name_desc:             'Nombre (Z → A)',
    order_sort_name:             'Nombre de clasificación (A → Z)',
    order_sort_name_desc:        'Nombre de clasificación (Z → A)',
    order_year_desc:             'Año (más reciente primero)',
    order_year:                  'Año (más antiguo primero)',
    order_artist_name:           'Nombre de artista (A → Z)',
    order_artist_name_desc:      'Nombre de artista (Z → A)',
    order_manual:                '— Manual —',
    state_loading:               'Cargando…',
    error_instance_not_found:    'Instancia de Music Assistant no encontrada. Comprueba entity_id.',
    error_loading_content:       'Error cargando contenido',
    state_no_items:              'No se encontraron elementos en la biblioteca',
    aria_play:                   'Reproducir',
  },
  fr: {
    editor_speaker:       'Enceintes',
    editor_content_type:  'Type de contenu',
    editor_sort_by:       'Trier par',
    editor_cover_size:    'Taille de pochette (colonnes de grille)',
    editor_manual_items:        'Éléments manuels (glisser pour réorganiser)',

    type_playlist:        'Listes de lecture',
    type_album:           'Albums',
    type_artist:          'Artistes',
    order_timestamp_added_desc:  "Date d'ajout (plus récent d'abord)",
    order_timestamp_added:       "Date d'ajout (plus ancien d'abord)",
    order_last_played_desc:      "Dernière lecture (plus récent d'abord)",
    order_last_played:           "Dernière lecture (plus ancien d'abord)",
    order_play_count_desc:       "Nombre de lectures (plus élevé d'abord)",
    order_play_count:            "Nombre de lectures (plus faible d'abord)",
    order_random:                'Aléatoire',
    order_random_less_played:    'Aléatoire (le moins écouté)',
    order_name:                  'Nom (A → Z)',
    order_name_desc:             'Nom (Z → A)',
    order_sort_name:             'Nom de tri (A → Z)',
    order_sort_name_desc:        'Nom de tri (Z → A)',
    order_year_desc:             "Année (plus récent d'abord)",
    order_year:                  "Année (plus ancien d'abord)",
    order_artist_name:           "Nom d'artiste (A → Z)",
    order_artist_name_desc:      "Nom d'artiste (Z → A)",
    order_manual:                '— Manuel —',
    state_loading:               'Chargement…',
    error_instance_not_found:    'Instance Music Assistant introuvable. Vérifiez entity_id.',
    error_loading_content:       'Erreur lors du chargement du contenu',
    state_no_items:              'Aucun élément trouvé dans la bibliothèque',
    aria_play:                   'Lire',
  },
  de: {
    editor_speaker:       'Lautsprecher',
    editor_content_type:  'Inhaltstyp',
    editor_sort_by:       'Sortieren nach',
    editor_cover_size:    'Cover-Größe (Rasterspalten)',
    editor_manual_items:        'Manuelle Elemente (zum Neuanordnen ziehen)',

    type_playlist:        'Playlists',
    type_album:           'Alben',
    type_artist:          'Künstler',
    order_timestamp_added_desc:  'Hinzugefügt am (Neueste zuerst)',
    order_timestamp_added:       'Hinzugefügt am (Älteste zuerst)',
    order_last_played_desc:      'Zuletzt gespielt (Neueste zuerst)',
    order_last_played:           'Zuletzt gespielt (Älteste zuerst)',
    order_play_count_desc:       'Wiedergabezahl (Höchste zuerst)',
    order_play_count:            'Wiedergabezahl (Niedrigste zuerst)',
    order_random:                'Zufällig',
    order_random_less_played:    'Zufällig (Am wenigsten gespielt)',
    order_name:                  'Name (A → Z)',
    order_name_desc:             'Name (Z → A)',
    order_sort_name:             'Sortiername (A → Z)',
    order_sort_name_desc:        'Sortiername (Z → A)',
    order_year_desc:             'Jahr (Neueste zuerst)',
    order_year:                  'Jahr (Älteste zuerst)',
    order_artist_name:           'Künstlername (A → Z)',
    order_artist_name_desc:      'Künstlername (Z → A)',
    order_manual:                '— Manuell —',
    state_loading:               'Laden…',
    error_instance_not_found:    'Music Assistant-Instanz nicht gefunden. Überprüfen Sie entity_id.',
    error_loading_content:       'Fehler beim Laden des Inhalts',
    state_no_items:              'Keine Elemente in der Bibliothek gefunden',
    aria_play:                   'Abspielen',
  },
  it: {
    editor_speaker:       'Altoparlanti',
    editor_content_type:  'Tipo di contenuto',
    editor_sort_by:       'Ordina per',
    editor_cover_size:    'Dimensione copertina (colonne griglia)',
    editor_manual_items:        'Elementi manuali (trascina per riordinare)',

    type_playlist:        'Playlist',
    type_album:           'Album',
    type_artist:          'Artisti',
    order_timestamp_added_desc:  'Data di aggiunta (dal più recente)',
    order_timestamp_added:       'Data di aggiunta (dal più vecchio)',
    order_last_played_desc:      'Ultima riproduzione (dal più recente)',
    order_last_played:           'Ultima riproduzione (dal più vecchio)',
    order_play_count_desc:       'Numero di riproduzioni (decrescente)',
    order_play_count:            'Numero di riproduzioni (crescente)',
    order_random:                'Casuale',
    order_random_less_played:    'Casuale (meno riprodotti)',
    order_name:                  'Nome (A → Z)',
    order_name_desc:             'Nome (Z → A)',
    order_sort_name:             'Nome ordinamento (A → Z)',
    order_sort_name_desc:        'Nome ordinamento (Z → A)',
    order_year_desc:             'Anno (dal più recente)',
    order_year:                  'Anno (dal più vecchio)',
    order_artist_name:           'Nome artista (A → Z)',
    order_artist_name_desc:      'Nome artista (Z → A)',
    order_manual:                '— Manuale —',
    state_loading:               'Caricamento…',
    error_instance_not_found:    'Istanza Music Assistant non trovata. Controlla entity_id.',
    error_loading_content:       'Errore durante il caricamento dei contenuti',
    state_no_items:              'Nessun elemento trovato nella libreria',
    aria_play:                   'Riproduci',
  },
  pt: {
    editor_speaker:       'Alto-falantes',
    editor_content_type:  'Tipo de conteúdo',
    editor_sort_by:       'Ordenar por',
    editor_cover_size:    'Tamanho da capa (colunas da grade)',
    editor_manual_items:        'Itens manuais (arraste para reordenar)',

    type_playlist:        'Playlists',
    type_album:           'Álbuns',
    type_artist:          'Artistas',
    order_timestamp_added_desc:  'Data de adição (mais recente primeiro)',
    order_timestamp_added:       'Data de adição (mais antiga primeiro)',
    order_last_played_desc:      'Última reprodução (mais recente primeiro)',
    order_last_played:           'Última reprodução (mais antiga primeiro)',
    order_play_count_desc:       'Contagem de reprodução (maior primeiro)',
    order_play_count:            'Contagem de reprodução (menor primeiro)',
    order_random:                'Aleatório',
    order_random_less_played:    'Aleatório (menos tocado)',
    order_name:                  'Nome (A → Z)',
    order_name_desc:             'Nome (Z → A)',
    order_sort_name:             'Nome de ordenação (A → Z)',
    order_sort_name_desc:        'Nome de ordenação (Z → A)',
    order_year_desc:             'Ano (mais recente primeiro)',
    order_year:                  'Ano (mais antigo primeiro)',
    order_artist_name:           'Nome do artista (A → Z)',
    order_artist_name_desc:      'Nome do artista (Z → A)',
    order_manual:                '— Manual —',
    state_loading:               'A carregar…',
    error_instance_not_found:    'Instância do Music Assistant não encontrada. Verifique entity_id.',
    error_loading_content:       'Erro ao carregar conteúdo',
    state_no_items:              'Nenhum item encontrado na biblioteca',
    aria_play:                   'Reproduzir',
  },
};

function localize(key, lang = 'en') {
  const shortLang = String(lang).split('-')[0].toLowerCase();
  const t = TRANSLATIONS[shortLang] || TRANSLATIONS['en'];
  return t[key] || TRANSLATIONS['en'][key] || key;
}

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

// ─── Exported utility functions ───────────────────────────────────────────────

export function calcCols(w, itemSize) {
  const itemCols = Math.max(1, parseInt(itemSize) || 3);
  const colW     = (w - 11 * GAP) / 12;
  const itemW    = itemCols * colW + (itemCols - 1) * GAP;
  return Math.max(1, Math.floor((w + GAP) / (itemW + GAP)));
}

export function calcRows(w, h, itemSize) {
  if (!h || h < ROW_HEIGHT) return 1;
  const itemCols = Math.max(1, parseInt(itemSize) || 3);
  const colW     = (w - 11 * GAP) / 12;
  const itemW    = itemCols * colW + (itemCols - 1) * GAP;
  return Math.max(1, Math.floor((h + GAP) / (itemW + GAP)));
}

export function getImageUrl(item, hassUrl) {
  const raw = item?.metadata?.images?.[0]?.url
    || item?.image?.url || item?.image || item?.thumbnail || null;
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  return `${hassUrl}/api/music_assistant/image_proxy?url=${encodeURIComponent(raw)}`;
}

export function getUri(item)  { return item?.uri  || item?.item_id || ''; }
export function getName(item) { return item?.name || item?.title   || ''; }

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
      media_type:   'playlist',
      order_by:     'timestamp_added_desc',
      item_size:    3,
      manual_items: [],
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

customElements.define('mass-coverwall-card', MassPlaylistCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'mass-coverwall-card',
  name:        'Music Assistant Cover Wall',
  description: 'Music Assistant cover wall for Home Assistant Sections — playlists, albums & artists',
  preview:     false,
});
