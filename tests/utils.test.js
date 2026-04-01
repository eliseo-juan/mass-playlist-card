import { describe, it, expect } from 'vitest';
import {
  calcCols,
  calcRows,
  getImageUrl,
  getUri,
  getName,
} from '../dist/mass-coverwall-card.js';

// ROW_HEIGHT matches the constant in the card implementation
const ROW_HEIGHT = 56;

// ─── calcCols ─────────────────────────────────────────────────────────────────

describe('calcCols', () => {
  it('returns at least 1', () => {
    expect(calcCols(10, 12)).toBeGreaterThanOrEqual(1);
  });

  it('returns 4 columns for 1200px wide with itemSize=3', () => {
    expect(calcCols(1200, 3)).toBe(4);
  });

  it('returns 2 columns for 1200px wide with itemSize=6', () => {
    expect(calcCols(1200, 6)).toBe(2);
  });

  it('returns 1 column when itemSize fills the full 12 columns', () => {
    // itemSize=12 means one item spans all 12 grid columns → 1 item per row
    expect(calcCols(300, 12)).toBe(1);
  });

  it('returns 12 columns for itemSize=1 on 300px wide card', () => {
    expect(calcCols(300, 1)).toBe(12);
  });

  it('defaults to itemSize=3 (4 cols at 1200px) when itemSize is 0', () => {
    expect(calcCols(1200, 0)).toBe(4);
  });

  it('defaults to itemSize=3 when itemSize is null', () => {
    expect(calcCols(1200, null)).toBe(4);
  });

  it('defaults to itemSize=3 when itemSize is undefined', () => {
    expect(calcCols(1200, undefined)).toBe(4);
  });

  it('defaults to itemSize=3 when itemSize is a non-numeric string', () => {
    expect(calcCols(1200, 'abc')).toBe(4);
  });

  it('accepts numeric string for itemSize', () => {
    expect(calcCols(1200, '6')).toBe(2);
  });
});

// ─── calcRows ─────────────────────────────────────────────────────────────────

describe('calcRows', () => {
  it('returns 1 when h=0', () => {
    expect(calcRows(1200, 0, 3)).toBe(1);
  });

  it('returns 1 when h is null/falsy', () => {
    expect(calcRows(1200, null, 3)).toBe(1);
    expect(calcRows(1200, undefined, 3)).toBe(1);
  });

  it('returns 1 when h is less than ROW_HEIGHT', () => {
    expect(calcRows(1200, ROW_HEIGHT - 1, 3)).toBe(1);
  });

  it('returns 1 when h equals ROW_HEIGHT (boundary — less than itemW)', () => {
    // itemW at w=1200, itemSize=3 is 294px; 56 < 294 so floor gives 1
    expect(calcRows(1200, ROW_HEIGHT, 3)).toBe(1);
  });

  it('returns 1 for h=302 (one itemW+GAP exactly)', () => {
    // itemW = 294, so one row needs (294 + GAP) = 302px; floor(302+8 / 302) = floor(1.026) = 1
    expect(calcRows(1200, 302, 3)).toBe(1);
  });

  it('returns 2 for h=610 (more than one row height)', () => {
    expect(calcRows(1200, 610, 3)).toBe(2);
  });

  it('returns 3 for h=1000', () => {
    expect(calcRows(1200, 1000, 3)).toBe(3);
  });

  it('returns at least 1', () => {
    expect(calcRows(100, 200, 3)).toBeGreaterThanOrEqual(1);
  });
});

// ─── getName ──────────────────────────────────────────────────────────────────

describe('getName', () => {
  it('returns item.name when present', () => {
    expect(getName({ name: 'My Playlist' })).toBe('My Playlist');
  });

  it('falls back to item.title when name is absent', () => {
    expect(getName({ title: 'My Album' })).toBe('My Album');
  });

  it('prefers name over title', () => {
    expect(getName({ name: 'Name', title: 'Title' })).toBe('Name');
  });

  it('returns empty string when neither name nor title is present', () => {
    expect(getName({})).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(getName(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(getName(undefined)).toBe('');
  });
});

// ─── getUri ───────────────────────────────────────────────────────────────────

describe('getUri', () => {
  it('returns item.uri when present', () => {
    expect(getUri({ uri: 'library://playlist/42' })).toBe('library://playlist/42');
  });

  it('falls back to item.item_id when uri is absent', () => {
    expect(getUri({ item_id: 'abc123' })).toBe('abc123');
  });

  it('prefers uri over item_id', () => {
    expect(getUri({ uri: 'library://playlist/1', item_id: 'fallback' })).toBe('library://playlist/1');
  });

  it('returns empty string when neither uri nor item_id is present', () => {
    expect(getUri({})).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(getUri(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(getUri(undefined)).toBe('');
  });
});

// ─── getImageUrl ──────────────────────────────────────────────────────────────

describe('getImageUrl', () => {
  it('returns null when item has no image fields', () => {
    expect(getImageUrl({}, '')).toBeNull();
  });

  it('returns null for null item', () => {
    expect(getImageUrl(null, '')).toBeNull();
  });

  it('returns null for undefined item', () => {
    expect(getImageUrl(undefined, '')).toBeNull();
  });

  it('returns http URL as-is (no proxying)', () => {
    const url = 'https://example.com/cover.jpg';
    expect(getImageUrl({ image: url }, 'http://homeassistant.local:8123')).toBe(url);
  });

  it('proxies a relative URL through HA image proxy', () => {
    const relative = '/local/cover.jpg';
    const hassUrl  = 'http://homeassistant.local:8123';
    expect(getImageUrl({ image: relative }, hassUrl)).toBe(
      `${hassUrl}/api/music_assistant/image_proxy?url=${encodeURIComponent(relative)}`
    );
  });

  it('reads from item.metadata.images[0].url (highest priority)', () => {
    const item = {
      metadata: { images: [{ url: 'https://meta.example.com/img.jpg' }] },
      image: { url: 'https://other.example.com/img.jpg' },
    };
    expect(getImageUrl(item, '')).toBe('https://meta.example.com/img.jpg');
  });

  it('falls back to item.image.url when metadata images absent', () => {
    const item = { image: { url: 'https://image-url.example.com/img.jpg' } };
    expect(getImageUrl(item, '')).toBe('https://image-url.example.com/img.jpg');
  });

  it('falls back to item.image string when image.url absent', () => {
    const item = { image: 'https://image-string.example.com/img.jpg' };
    expect(getImageUrl(item, '')).toBe('https://image-string.example.com/img.jpg');
  });

  it('falls back to item.thumbnail when image absent', () => {
    const item = { thumbnail: 'https://thumb.example.com/img.jpg' };
    expect(getImageUrl(item, '')).toBe('https://thumb.example.com/img.jpg');
  });

  it('proxies relative thumbnail through HA image proxy', () => {
    const relative = '/config/www/thumb.jpg';
    const hassUrl  = 'http://ha.local:8123';
    expect(getImageUrl({ thumbnail: relative }, hassUrl)).toBe(
      `${hassUrl}/api/music_assistant/image_proxy?url=${encodeURIComponent(relative)}`
    );
  });

  it('works with empty hassUrl for relative path', () => {
    const relative = '/local/img.jpg';
    expect(getImageUrl({ image: relative }, '')).toBe(
      `/api/music_assistant/image_proxy?url=${encodeURIComponent(relative)}`
    );
  });
});
