import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';
import ja from './locales/ja.json';

// Get browser's default language
const browserLang = navigator.language.split('-')[0];
const defaultLocale = ['vi', 'en', 'ja'].includes(browserLang) ? browserLang : 'en';

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    vi,
    ja,
  },
});

export default i18n;
