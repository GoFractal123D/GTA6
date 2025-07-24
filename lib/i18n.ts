import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from '../public/locales/fr/translation.json';
import en from '../public/locales/en/translation.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'fr',
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    });
}

export default i18n; 