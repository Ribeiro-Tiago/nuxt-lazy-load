import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: { port: 3002 },
  modules: ["../src/module"],

  lazyLoadFiles: {
    files: {
      css: [
        { filePath: "assets/styles/plain.css", windowWidthGreaterThan: { width: 1 } },
        { filePath: "assets/styles/sass.sass", windowWidthLessThan: { width: 1000 } },
        { filePath: "assets/styles/scss.scss", windowWidthLessThan: { width: 1000 } },
        { filePath: "assets/styles/less.less", windowWidthLessThan: { width: 4000 } },
        { filePath: "assets/styles/stylus.stylus", windowWidthGreaterThan: { width: 10 } },
        { filePath: "assets/styles/styl.styl", windowWidthGreaterThan: { width: 10 } },
      ],
    },
  },

  compatibilityDate: "2025-03-23",
});
