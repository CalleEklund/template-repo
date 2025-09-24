import enCommon from './locales/en/common.json';
import svCommon from './locales/sv/common.json';

import i18n, { InitOptions } from 'i18next';

export const defaultOptions = {
  fallbackLng: 'sv',
  defaultNS: 'common',
  fallbackNS: 'common',
  returnObjects: true,
  pluralSeparator: '_',
  compatibilityJSON: 'v4',
  resources: {
    en: {
      common: enCommon,
    },
    sv: {
      common: svCommon,
    },
  },
} as const satisfies InitOptions;

export interface Resources {
  common: typeof svCommon;
}

export default i18n;
