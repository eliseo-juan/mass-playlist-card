import en from '../.translations/en.json';
import es from '../.translations/es.json';
import fr from '../.translations/fr.json';
import de from '../.translations/de.json';
import it from '../.translations/it.json';
import pt from '../.translations/pt.json';

const TRANSLATIONS = { en, es, fr, de, it, pt };

export function localize(key, lang = 'en') {
  const shortLang = String(lang).split('-')[0].toLowerCase();
  const t = TRANSLATIONS[shortLang] || TRANSLATIONS['en'];
  return t[key] || TRANSLATIONS['en'][key] || key;
}
