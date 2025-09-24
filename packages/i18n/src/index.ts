import { Resources } from './defaultConfig';
import i18next from 'i18next';

export { defaultOptions } from './defaultConfig';
export { languageCodeList } from './languageCodeList';
export { i18next };
type i18n = typeof i18next;
export { type i18n };

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: Resources;
  }
}
