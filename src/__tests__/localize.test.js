import { describe, it, expect } from 'vitest';
import { localize } from '../localize.js';

// ─── All 6 languages return correct value for editor_speaker ──────────────────

describe('localize — editor_speaker key across all languages', () => {
  it('returns English value', () => {
    expect(localize('editor_speaker', 'en')).toBe('Speakers');
  });

  it('returns Spanish value', () => {
    expect(localize('editor_speaker', 'es')).toBe('Altavoces');
  });

  it('returns French value', () => {
    expect(localize('editor_speaker', 'fr')).toBe('Enceintes');
  });

  it('returns German value', () => {
    expect(localize('editor_speaker', 'de')).toBe('Lautsprecher');
  });

  it('returns Italian value', () => {
    expect(localize('editor_speaker', 'it')).toBe('Altoparlanti');
  });

  it('returns Portuguese value', () => {
    expect(localize('editor_speaker', 'pt')).toBe('Alto-falantes');
  });
});

// ─── Fallback behaviour ───────────────────────────────────────────────────────

describe('localize — fallback to English', () => {
  it('falls back to English for unknown language', () => {
    expect(localize('editor_speaker', 'ja')).toBe('Speakers');
  });

  it('falls back to English for empty string language', () => {
    expect(localize('editor_speaker', '')).toBe('Speakers');
  });

  it('returns key itself when key is unknown in all languages', () => {
    expect(localize('nonexistent_key', 'en')).toBe('nonexistent_key');
  });

  it('returns key when key is unknown and language is unknown', () => {
    expect(localize('nonexistent_key', 'zh')).toBe('nonexistent_key');
  });

  it('uses English when no language arg is provided', () => {
    expect(localize('editor_speaker')).toBe('Speakers');
  });
});

// ─── Language variant stripping (e.g. en-US → en) ────────────────────────────

describe('localize — language variant handling', () => {
  it('handles en-US → en', () => {
    expect(localize('editor_speaker', 'en-US')).toBe('Speakers');
  });

  it('handles es-MX → es', () => {
    expect(localize('editor_speaker', 'es-MX')).toBe('Altavoces');
  });

  it('handles fr-CA → fr', () => {
    expect(localize('editor_speaker', 'fr-CA')).toBe('Enceintes');
  });

  it('handles de-AT → de', () => {
    expect(localize('editor_speaker', 'de-AT')).toBe('Lautsprecher');
  });

  it('handles pt-BR → pt', () => {
    expect(localize('editor_speaker', 'pt-BR')).toBe('Alto-falantes');
  });

  it('handles uppercase lang codes like EN → en', () => {
    expect(localize('editor_speaker', 'EN')).toBe('Speakers');
  });
});

// ─── A few keys per language to verify JSON files loaded correctly ─────────────

describe('localize — spot-check multiple keys per language', () => {
  it('en: aria_play', () => {
    expect(localize('aria_play', 'en')).toBe('Play');
  });

  it('en: state_no_items', () => {
    expect(localize('state_no_items', 'en')).toBe('No items found in library');
  });

  it('es: aria_play', () => {
    expect(localize('aria_play', 'es')).toBe('Reproducir');
  });

  it('es: type_playlist', () => {
    expect(localize('type_playlist', 'es')).toBe('Listas de reproducción');
  });

  it('fr: aria_play', () => {
    expect(localize('aria_play', 'fr')).toBe('Lire');
  });

  it('fr: order_random', () => {
    expect(localize('order_random', 'fr')).toBe('Aléatoire');
  });

  it('de: aria_play', () => {
    expect(localize('aria_play', 'de')).toBe('Abspielen');
  });

  it('de: type_album', () => {
    expect(localize('type_album', 'de')).toBe('Alben');
  });

  it('it: aria_play', () => {
    expect(localize('aria_play', 'it')).toBe('Riproduci');
  });

  it('it: order_random', () => {
    expect(localize('order_random', 'it')).toBe('Casuale');
  });

  it('pt: aria_play', () => {
    expect(localize('aria_play', 'pt')).toBe('Reproduzir');
  });

  it('pt: type_album', () => {
    expect(localize('type_album', 'pt')).toBe('Álbuns');
  });
});
