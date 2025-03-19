import type { LazyLoadRule, LazyLoadRuleScreenSize, ProcessedFiles } from "../module";

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
  name: "lazyload-css",
  parallel: true,
  hooks: {
    "app:created"(_app) {
      const config = useRuntimeConfig();

      const files: ProcessedFiles[] = config.app.lazyLoadCSS;

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
