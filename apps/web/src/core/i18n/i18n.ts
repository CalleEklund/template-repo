import { resources, utils } from "@template-repo/translations";
import _i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

await _i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: utils.namespaces,
    fallbackLng: utils.defaultLanguage,
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
export const i18n = _i18n;
