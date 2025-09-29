import enTranslations from "./resources/en/translations.json";
import svTranslations from "./resources/sv/translations.json";

export const resources = {
  sv: {
    common: svTranslations.common,
  },
  en: {
    common: enTranslations.common,
  },
} as const;

const defaultLanguage = "sv";
const namespaces = Object.keys(resources[defaultLanguage]);
const languages = Object.keys(resources);

export const utils = {
  languages,
  defaultLanguage,
  namespaces,
};
