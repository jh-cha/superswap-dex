import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { default as enTranslations } from "./translations/en.json";

const DEFAULT_NAMESPACE = "translation";

const en = { [DEFAULT_NAMESPACE]: enTranslations };

i18n.use(initReactI18next).init({
  resources: {
    en,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;