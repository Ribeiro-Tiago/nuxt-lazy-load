import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: { port: 3002 },
  modules: ["../src/module"],

  lazyLoadFiles: {
    files: {
      css: [
        { filePath: "assets/styles/plain.css", windowWidthGreaterThan: { width: 1 } },
        { filePath: "assets/styles/scss.scss", windowWidthLessThan: { width: 1000 } },
      ],
    },
  },

  compatibilityDate: "2025-03-23",
});
