// @ts-check
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: { tooling: true },
  dirs: { src: ["./playground"] },
}).overrideRules({
  quotes: ["warn", "double", { avoidEscape: true }],
  "@typescript-eslint/no-explicit-any": "warn",
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
