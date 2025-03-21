import { defineNuxtPlugin, useRuntimeConfig, useHead } from "#imports";
import { configKey } from "../module";
import type { LazyLoadRule, LazyLoadRuleScreenSize, LazyLoadProcessedFiles } from "../module";
import { name } from "../../package.json";

const screensizeGreaterThan = (path: string, { width }: LazyLoadRuleScreenSize) => {
  if (window.innerWidth < width) {
    useHead({
      link: [{ rel: "stylesheet", type: "text/css", href: path }],
    });
    return;
  }

  const update = (ev: Event) => {
    if ((ev.target as any).innerWidth < width) {
      useHead({
        link: [{ rel: "stylesheet", type: "text/css", href: path }],
      });

      window.removeEventListener("resize", update);
    }
  };

  window.addEventListener("resize", update, { passive: true });
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const ruleMapper: Record<LazyLoadRule, Function> = {
  widthLT: screensizeGreaterThan,
  widthGT: screensizeGreaterThan,
};

export default defineNuxtPlugin({
  name,
  parallel: true,
  hooks: {
    "app:created"() {
      const files: LazyLoadProcessedFiles[] = useRuntimeConfig().app[configKey];

      if (!files) {
        return;
      }

      files.forEach(({ path, rules }) => {
        Object.entries(rules).forEach(([rule, config]) => {
          ruleMapper[rule as LazyLoadRule]!(path, config);
        });
      });
    },
  },
  env: { islands: false },
});
