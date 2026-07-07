import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEN from "./locales/common.en";
import commonID from "./locales/common.id";

import dashboardEN from "./locales/dashboard.en";
import dashboardID from "./locales/dashboard.id";


i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    resources: {
  en: {
    translation: {
      common: commonEN,
      dashboard: dashboardEN,
    },
  },

  id: {
    translation: {
      common: commonID,
      dashboard: dashboardID,
    },
  },
},
  });

export default i18n;