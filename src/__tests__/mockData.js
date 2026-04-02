import { vi } from 'vitest';

export function createMockHass(overrides = {}) {
  return {
    language: 'en',
    auth: { data: { hassUrl: 'http://homeassistant.local:8123' } },
    callWS: vi.fn().mockResolvedValue([]),
    callService: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

export function createMockConfig(overrides = {}) {
  return {
    entity_id: ['media_player.salon'],
    media_type: 'playlist',
    order_by: 'timestamp_added_desc',
    item_size: 3,
    manual_items: [],
    ...overrides,
  };
}

export function createMockItem(overrides = {}) {
  return {
    uri: 'library://playlist/1',
    name: 'Test Playlist',
    metadata: { images: [{ url: 'https://example.com/cover.jpg' }] },
    ...overrides,
  };
}
