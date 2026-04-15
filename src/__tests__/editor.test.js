import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import side effects (registers custom elements)
import '../editor.js';

// ─── setConfig ────────────────────────────────────────────────────────────────

describe('MassPlaylistCardEditor — setConfig', () => {
  let editor;

  beforeEach(() => {
    editor = document.createElement('mass-coverwall-card-editor');
  });

  afterEach(() => {
    if (editor.parentNode) editor.parentNode.removeChild(editor);
  });

  it('normalizes string entity_id to array', () => {
    editor.setConfig({ entity_id: 'media_player.salon' });
    expect(editor._config.entity_id).toEqual(['media_player.salon']);
  });

  it('accepts array entity_id as-is', () => {
    editor.setConfig({ entity_id: ['media_player.salon', 'media_player.cocina'] });
    expect(editor._config.entity_id).toEqual(['media_player.salon', 'media_player.cocina']);
  });

  it('normalizes missing entity_id to empty array', () => {
    editor.setConfig({ entity_id: undefined });
    expect(editor._config.entity_id).toEqual([]);
  });

  it('migrates legacy entity_ids into entity_id array', () => {
    editor.setConfig({
      entity_id: 'media_player.salon',
      entity_ids: ['media_player.cocina'],
    });
    expect(editor._config.entity_id).toContain('media_player.salon');
    expect(editor._config.entity_id).toContain('media_player.cocina');
  });

  it('does not duplicate entities from entity_ids already in entity_id', () => {
    editor.setConfig({
      entity_id: ['media_player.salon'],
      entity_ids: ['media_player.salon', 'media_player.cocina'],
    });
    const occurrences = editor._config.entity_id.filter(e => e === 'media_player.salon');
    expect(occurrences).toHaveLength(1);
  });

  it('sets default media_type to "playlist"', () => {
    editor.setConfig({ entity_id: [] });
    expect(editor._config.media_type).toBe('playlist');
  });

  it('sets default order_by to "timestamp_added_desc"', () => {
    editor.setConfig({ entity_id: [] });
    expect(editor._config.order_by).toBe('timestamp_added_desc');
  });

  it('sets default item_size to 3', () => {
    editor.setConfig({ entity_id: [] });
    expect(editor._config.item_size).toBe(3);
  });

  it('sets default manual_items to empty array', () => {
    editor.setConfig({ entity_id: [] });
    expect(editor._config.manual_items).toEqual([]);
  });

  it('sets default provider_instance to empty string', () => {
    editor.setConfig({ entity_id: [] });
    expect(editor._config.provider_instance).toBe('');
  });

  it('preserves provided provider_instance over default', () => {
    editor.setConfig({ entity_id: [], provider_instance: 'spotify_account1' });
    expect(editor._config.provider_instance).toBe('spotify_account1');
  });

  it('respects provided values over defaults', () => {
    editor.setConfig({ entity_id: [], media_type: 'album', order_by: 'name', item_size: 6 });
    expect(editor._config.media_type).toBe('album');
    expect(editor._config.order_by).toBe('name');
    expect(editor._config.item_size).toBe(6);
  });

  it('stores the normalized config in _config', () => {
    editor.setConfig({ entity_id: ['media_player.salon'] });
    expect(editor._config).toBeDefined();
    expect(editor._config.entity_id).toEqual(['media_player.salon']);
  });
});

// ─── _fire — config-changed event ─────────────────────────────────────────────

describe('MassPlaylistCardEditor — _fire', () => {
  let editor;

  beforeEach(() => {
    editor = document.createElement('mass-coverwall-card-editor');
    editor.setConfig({ entity_id: ['media_player.salon'] });
    // Attach to DOM so events can bubble
    document.body.appendChild(editor);
  });

  afterEach(() => {
    if (editor.parentNode) editor.parentNode.removeChild(editor);
  });

  it('dispatches a config-changed event', () => {
    const events = [];
    editor.addEventListener('config-changed', (e) => events.push(e));

    editor._fire({ entity_id: ['media_player.salon'], media_type: 'album' });

    expect(events).toHaveLength(1);
  });

  it('event detail.config contains the new config', () => {
    let received = null;
    editor.addEventListener('config-changed', (e) => { received = e.detail.config; });

    const newConfig = { entity_id: ['media_player.salon'], media_type: 'album' };
    editor._fire(newConfig);

    expect(received).toEqual(newConfig);
  });

  it('updates _config after _fire', () => {
    const newConfig = { entity_id: ['media_player.salon'], media_type: 'album' };
    editor._fire(newConfig);
    expect(editor._config).toEqual(newConfig);
  });

  it('event bubbles and is composed', () => {
    let bubbled = false;
    document.body.addEventListener('config-changed', () => { bubbled = true; });

    editor._fire({ entity_id: [] });

    expect(bubbled).toBe(true);
    document.body.removeEventListener('config-changed', () => {});
  });
});

// ─── _renderEditor — concurrent render guard ───────────────────────────────────

describe('MassPlaylistCardEditor — _renderEditor concurrent guard', () => {
  let editor;

  beforeEach(() => {
    editor = document.createElement('mass-coverwall-card-editor');
    editor.setConfig({ entity_id: ['media_player.salon'] });
    document.body.appendChild(editor);
  });

  afterEach(() => {
    if (editor.parentNode) editor.parentNode.removeChild(editor);
  });

  it('only appends one ha-form even when _renderEditor is called concurrently', async () => {
    // Trigger two concurrent renders and wait for both to settle
    await Promise.all([editor._renderEditor(), editor._renderEditor()]);

    const forms = editor.shadowRoot.querySelectorAll('ha-form');
    expect(forms).toHaveLength(1);
  });

  it('increments _renderGen on each call so stale renders abort', async () => {
    const genBefore = editor._renderGen;
    const p1 = editor._renderEditor();
    const p2 = editor._renderEditor();
    expect(editor._renderGen).toBe(genBefore + 2);
    await Promise.all([p1, p2]);
  });
});
