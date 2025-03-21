import { defineNuxtPlugin, useHead, useRuntimeConfig } from "#imports";

import { configKey } from "../config";
import ruleMapper from "../rules";
import type { LazyLoadRule, LazyLoadProcessedFiles } from "../module";
import { name } from "../../package.json";

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
          // todo: make rule check happen in the module so it isn't needed here
          const mapper = ruleMapper[rule as LazyLoadRule];
          if (mapper) {
            mapper(path, config, useHead);
          }
        });
      });
    },
  },
  env: { islands: false },
});
