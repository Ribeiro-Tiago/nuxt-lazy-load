// @ts-check
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: ["./playground"],
  },
}).overrideRules({
  quotes: ["warn", "double", { avoidEscape: true }],
  "no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars

  "vue/no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars
  "vue/multi-word-component-names": "off",
  "vue/no-v-text-v-html-on-component": "off",
  "vue/no-multiple-template-root": "off",
  "vue/html-self-closing": "off",

  "@typescript-eslint/no-this-alias": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_", // Ignore variables starting with "_"
      argsIgnorePattern: "^_", // Ignore arguments starting with "_"
      caughtErrorsIgnorePattern: "^_", // Ignore caught errors starting with "_"
    },
  ],
});
