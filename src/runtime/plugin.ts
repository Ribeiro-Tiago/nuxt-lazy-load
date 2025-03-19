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

const ruleMapper: Record<LazyLoadRule, Function> = {
  widthLT: screensizeGreaterThan,
  widthGT: screensizeGreaterThan,
};

export default defineNuxtPlugin({
  name,
  parallel: true,
  hooks: {
    "app:created"(_app) {
      const config = useRuntimeConfig();

      const files: LazyLoadProcessedFiles[] = config.app.lazyLoadCSS;

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
