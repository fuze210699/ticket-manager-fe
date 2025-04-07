import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';
import ja from './locales/ja.json';

// Get browser's default language
const browserLang = navigator.language.split('-')[0];
const defaultLocale = ['vi', 'en', 'ja'].includes(browserLang) ? browserLang : 'en';

// Function to transform keys with dots to nested objects
function transformMessages(messages) {
  const transformed = {};
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === 'object' && value !== null) {
      transformed[key] = transformMessages(value);
    } else {
      const parts = key.split('.');
      let current = transformed;
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    }
  }
  return transformed;
}

// Transform all locale messages
const transformedMessages = {
  en: transformMessages(en),
  vi: transformMessages(vi),
  ja: transformMessages(ja),
};

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: transformedMessages,
});

export default i18n;
