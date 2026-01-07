import { en } from './en';
import { pt } from './pt';
import { es } from './es';

export const translations = {
  en,
  pt,
  es
};

export const getTranslation = (language) => {
  return translations[language] || translations.en;
};
