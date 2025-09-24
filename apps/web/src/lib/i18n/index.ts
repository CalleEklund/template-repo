import { defaultOptions, i18next } from '@template-repo/i18n';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

void i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    ...defaultOptions,
    react: { useSuspense: false },
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18next;
