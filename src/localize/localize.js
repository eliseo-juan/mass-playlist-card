import { en } from './en.js';
import { es } from './es.js';
import { fr } from './fr.js';
import { de } from './de.js';
import { it } from './it.js';
import { pt } from './pt.js';

const TRANSLATIONS = {
  en,
  es,
  fr,
  de,
  it,
  pt
};

export function localize(key, lang = 'en') {
  const shortLang = String(lang).split('-')[0].toLowerCase();
  const translations = TRANSLATIONS[shortLang] || TRANSLATIONS['en'];
  return translations[key] || TRANSLATIONS['en'][key] || key;
}
