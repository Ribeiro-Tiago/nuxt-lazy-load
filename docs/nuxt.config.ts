import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: ["@nuxt-themes/docus"],
  devtools: { enabled: true },
  devServer: { port: 3001 },

  compatibilityDate: "2024-10-24",
});
