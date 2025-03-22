import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: ["@nuxt-themes/docus"],
  devtools: { enabled: true },
  devServer: { port: 3001 },

  app: { baseURL: "/nuxt-lazyload-files" },

  compatibilityDate: "2024-10-24",
});
