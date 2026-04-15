import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import side effects (registers custom elements)
import '../card.js';

const CardClass = customElements.get('mass-coverwall-card');

// ─── setConfig ────────────────────────────────────────────────────────────────

describe('MassPlaylistCard — setConfig', () => {
  let card;

  beforeEach(() => {
    card = document.createElement('mass-coverwall-card');
  });

  afterEach(() => {
    if (card.parentNode) card.parentNode.removeChild(card);
  });

  it('accepts string entity_id and converts to array', () => {
    card.setConfig({ entity_id: 'media_player.salon' });
    expect(card._config.entity_id).toEqual(['media_player.salon']);
  });

  it('accepts array entity_id as-is', () => {
    card.setConfig({ entity_id: ['media_player.salon', 'media_player.cocina'] });
    expect(card._config.entity_id).toEqual(['media_player.salon', 'media_player.cocina']);
  });

  it('accepts empty array entity_id', () => {
    card.setConfig({ entity_id: [] });
    expect(card._config.entity_id).toEqual([]);
  });

  it('throws if entity_id is missing', () => {
    expect(() => card.setConfig({})).toThrow();
  });

  it('throws if entity_id is null', () => {
    expect(() => card.setConfig({ entity_id: null })).toThrow();
  });

  it('throws if entity_id is undefined', () => {
    expect(() => card.setConfig({ entity_id: undefined })).toThrow();
  });

  it('sets defaults for media_type, order_by, item_size, manual_items', () => {
    card.setConfig({ entity_id: ['media_player.salon'] });
    expect(card._config.media_type).toBe('playlist');
    expect(card._config.order_by).toBe('timestamp_added_desc');
    expect(card._config.item_size).toBe(3);
    expect(card._config.manual_items).toEqual([]);
  });

  it('respects overridden defaults', () => {
    card.setConfig({ entity_id: ['media_player.salon'], media_type: 'album', item_size: 6 });
    expect(card._config.media_type).toBe('album');
    expect(card._config.item_size).toBe(6);
  });
});

// ─── Backward compat: entity_ids migration ────────────────────────────────────

describe('MassPlaylistCard — entity_ids migration', () => {
  let card;

  beforeEach(() => {
    card = document.createElement('mass-coverwall-card');
  });

  afterEach(() => {
    if (card.parentNode) card.parentNode.removeChild(card);
  });

  it('merges legacy entity_ids into entity_id array', () => {
    card.setConfig({
      entity_id: 'media_player.salon',
      entity_ids: ['media_player.cocina'],
    });
    expect(card._config.entity_id).toContain('media_player.salon');
    expect(card._config.entity_id).toContain('media_player.cocina');
  });

  it('does not duplicate entities that appear in both entity_id and entity_ids', () => {
    card.setConfig({
      entity_id: ['media_player.salon'],
      entity_ids: ['media_player.salon', 'media_player.cocina'],
    });
    const occurrences = card._config.entity_id.filter(e => e === 'media_player.salon');
    expect(occurrences).toHaveLength(1);
    expect(card._config.entity_id).toContain('media_player.cocina');
  });

  it('ignores empty/falsy entries in entity_ids', () => {
    card.setConfig({
      entity_id: ['media_player.salon'],
      entity_ids: ['', null, undefined],
    });
    expect(card._config.entity_id).toEqual(['media_player.salon']);
  });
});

// ─── _getEntities ─────────────────────────────────────────────────────────────

describe('MassPlaylistCard — _getEntities', () => {
  let card;

  beforeEach(() => {
    card = document.createElement('mass-coverwall-card');
  });

  afterEach(() => {
    if (card.parentNode) card.parentNode.removeChild(card);
  });

  it('returns filtered array of non-empty entities', () => {
    card.setConfig({ entity_id: ['media_player.salon', 'media_player.cocina'] });
    expect(card._getEntities()).toEqual(['media_player.salon', 'media_player.cocina']);
  });

  it('filters out empty strings', () => {
    card.setConfig({ entity_id: ['media_player.salon', '', '  '] });
    expect(card._getEntities()).toEqual(['media_player.salon']);
  });

  it('returns empty array if entity_id is empty', () => {
    card.setConfig({ entity_id: [] });
    expect(card._getEntities()).toEqual([]);
  });
});

// ─── _getVisibleCount ─────────────────────────────────────────────────────────

describe('MassPlaylistCard — _getVisibleCount', () => {
  let card;

  beforeEach(() => {
    card = document.createElement('mass-coverwall-card');
    card.setConfig({ entity_id: ['media_player.salon'] });
  });

  afterEach(() => {
    if (card.parentNode) card.parentNode.removeChild(card);
  });

  it('returns cols * rows based on config', () => {
    // With no explicit rows config, uses calculated rows
    // At default 300px width / 120px height, should return a positive integer
    const count = card._getVisibleCount();
    expect(count).toBeGreaterThan(0);
    expect(Number.isInteger(count)).toBe(true);
  });

  it('uses configRows when rows is set', () => {
    card.setConfig({ entity_id: ['media_player.salon'], rows: 3, item_size: 3 });
    // At 300px wide, calcCols(300, 3) = 4 cols, configRows = 3, so 4 * 3 = 12
    card._containerW = 300;
    const count = card._getVisibleCount();
    expect(count).toBe(4 * 3); // cols(300,3) * rows(3)
  });

  it('falls back to calculated rows when rows is not set', () => {
    card.setConfig({ entity_id: ['media_player.salon'], item_size: 3 });
    card._containerW = 1200;
    card._containerH = 610;
    // calcCols(1200, 3) = 4, calcRows(1200, 610, 3) = 2 → 8
    const count = card._getVisibleCount();
    expect(count).toBe(4 * 2);
  });

  it('uses minimum of 1 for rows config', () => {
    card.setConfig({ entity_id: ['media_player.salon'], rows: 0 });
    card._containerW = 300;
    const count = card._getVisibleCount();
    // rows 0 → configRows = null (falsy), falls back to calculated
    expect(count).toBeGreaterThan(0);
  });
});

// ─── provider_instance config ─────────────────────────────────────────────────

describe('MassPlaylistCard — provider_instance config', () => {
  let card;

  beforeEach(() => {
    card = document.createElement('mass-coverwall-card');
  });

  afterEach(() => {
    if (card.parentNode) card.parentNode.removeChild(card);
  });

  it('defaults provider_instance to empty string', () => {
    card.setConfig({ entity_id: ['media_player.salon'] });
    expect(card._config.provider_instance).toBe('');
  });

  it('stores provider_instance from config', () => {
    card.setConfig({ entity_id: ['media_player.salon'], provider_instance: 'spotify_account1' });
    expect(card._config.provider_instance).toBe('spotify_account1');
  });
});

// ─── provider_instance filtering ──────────────────────────────────────────────

describe('MassPlaylistCard — provider_instance filtering', () => {
  let card;

  const makeItem = (name, providerMappings) => ({
    uri:               `library://playlist/${name}`,
    name,
    metadata:          { images: [{ url: `https://example.com/${name}.jpg` }] },
    provider_mappings: providerMappings,
  });

  const itemAccount1   = makeItem('Playlist A', [{ provider_instance_id: 'spotify_account1', provider_domain: 'spotify' }]);
  const itemAccount2   = makeItem('Playlist B', [{ provider_instance_id: 'spotify_account2', provider_domain: 'spotify' }]);
  const itemBoth       = makeItem('Playlist C', [
    { provider_instance_id: 'spotify_account1', provider_domain: 'spotify' },
    { provider_instance_id: 'spotify_account2', provider_domain: 'spotify' },
  ]);
  const itemNoMappings = makeItem('Playlist D', undefined);

  const mockHass = (items) => ({
    language:    'en',
    auth:        { data: { hassUrl: 'http://homeassistant.local' } },
    callWS:      async () => ({ response: { items } }),
    callService: async () => {},
  });

  beforeEach(() => {
    card = document.createElement('mass-coverwall-card');
    card.setConfig({ entity_id: ['media_player.salon'], rows: 10 });
    card._configEntryId = 'test-entry-id';
    card._containerW    = 300;
  });

  afterEach(() => {
    if (card.parentNode) card.parentNode.removeChild(card);
  });

  it('shows all items when provider_instance is empty', async () => {
    card._hass = mockHass([itemAccount1, itemAccount2, itemBoth]);
    card._config.provider_instance = '';
    await card._fetchItems();
    expect(card._items).toHaveLength(3);
  });

  it('filters to items matching provider_instance_id of first account', async () => {
    card._hass = mockHass([itemAccount1, itemAccount2, itemBoth, itemNoMappings]);
    card._config.provider_instance = 'spotify_account1';
    await card._fetchItems();
    expect(card._items.map(i => i.name)).toEqual(['Playlist A', 'Playlist C']);
  });

  it('filters to items matching provider_instance_id of second account', async () => {
    card._hass = mockHass([itemAccount1, itemAccount2, itemBoth, itemNoMappings]);
    card._config.provider_instance = 'spotify_account2';
    await card._fetchItems();
    expect(card._items.map(i => i.name)).toEqual(['Playlist B', 'Playlist C']);
  });

  it('excludes items without provider_mappings when filter is active', async () => {
    card._hass = mockHass([itemAccount1, itemNoMappings]);
    card._config.provider_instance = 'spotify_account1';
    await card._fetchItems();
    expect(card._items.map(i => i.name)).toEqual(['Playlist A']);
  });

  it('supports filtering by provider_domain', async () => {
    const itemApple = makeItem('Apple Playlist', [{ provider_instance_id: 'apple_music_1', provider_domain: 'apple_music' }]);
    card._hass = mockHass([itemAccount1, itemApple]);
    card._config.provider_instance = 'apple_music';
    await card._fetchItems();
    expect(card._items.map(i => i.name)).toEqual(['Apple Playlist']);
  });
});
